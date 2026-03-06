import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendVacancyNotificationEmail } from '@/lib/email';
import Teacher from '@/model/Teacher';
import NonTeacher from '@/model/NonTeacher';
import User from '@/model/User';
import Coaching from '@/model/Coaching';
import School from '@/model/School';
import Consultant from '@/model/Consultant';

/* =====================
   GET: All vacancies
===================== */
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const postedBy = searchParams.get('postedBy');

    const query: { isApproved?: boolean; postedBy?: string | null } = { isApproved: true };
    if (postedBy) {
      query.postedBy = postedBy;
      // If fetching own vacancies, show even if not approved (optional, but good for dashboard)
      delete query.isApproved;
    }

    const vacancies = await Vacancy.find(query)
      .populate({ path: 'postedBy', model: User, select: 'name' })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(vacancies);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch vacancies' },
      { status: 500 }
    );
  }
}

/* =====================
   POST: Create vacancy
===================== */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const session = await getServerSession(authOptions as AuthOptions);

    // Auto-approve all vacancies by default per user request
    const isApproved = true;
    let postedBy = null;
    let posterRole = null;

    if (session?.user) {
      const user = session.user as { role: string; id: string; email: string };

      const allowedRoles = ['coaching', 'school', 'consultant', 'admin', 'hr'];
      let isAuthorized = allowedRoles.includes(user.role);
      let actualSenderRole = user.role;

      // Check database profiles for multi-role users
      if (!isAuthorized && user.email) {
        await dbConnect();
        const [hasCoaching, hasSchool, hasConsultant] = await Promise.all([
          Coaching.exists({ email: user.email }),
          School.exists({ email: user.email }),
          Consultant.exists({ email: user.email })
        ]);

        if (hasCoaching) actualSenderRole = 'coaching';
        else if (hasSchool) actualSenderRole = 'school';
        else if (hasConsultant) actualSenderRole = 'consultant';

        isAuthorized = !!(hasCoaching || hasSchool || hasConsultant);
      }

      if (!isAuthorized) {
        return NextResponse.json(
          { error: 'Unauthorized: Only Coaching Owners, School Owners, Consultants, and internal staff can post jobs.' },
          { status: 403 }
        );
      }

      postedBy = user.id;
      posterRole = actualSenderRole;
    } else {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to post jobs.' },
        { status: 401 }
      );
    }

    // Validation for India
    if (body.country === 'India' && (!body.city || !body.state)) {
      return NextResponse.json(
        { error: 'City and State are required for vacancies in India' },
        { status: 400 }
      );
    }

    // Automatically set location if city/state provided, but PRESERVE existing location detail
    if (body.city && body.state) {
      const area = body.location || '';
      if (area && !area.toLowerCase().includes(body.city.toLowerCase())) {
        body.location = `${area}, ${body.city}, ${body.state}`;
      } else if (!area) {
        body.location = `${body.city}, ${body.state}`;
      }
    }

    const _vacancy = await Vacancy.create({
      ...body,
      isApproved,
      postedBy,
      posterRole
    });

    if (isApproved) {
      // Fire and forget email notifications
      (async () => {
        try {
          const teacherEmails: string[] = [];
          const nonTeacherEmails: string[] = [];

          const locQuery = {
            $or: [] as Record<string, unknown>[]
          };

          // Build Location Matching logic
          const cleanCity = body.city?.trim();
          const cleanState = body.state?.trim();

          if (cleanCity) {
            locQuery.$or.push({ city: { $regex: new RegExp(`^${cleanCity}$`, 'i') } });
          }
          if (cleanState) {
            locQuery.$or.push({ state: { $regex: new RegExp(`^${cleanState}$`, 'i') } });
            locQuery.$or.push({ nativeState: { $regex: new RegExp(`^${cleanState}$`, 'i') } });
            locQuery.$or.push({ preferedState: { $elemMatch: { $regex: new RegExp(`^${cleanState}$`, 'i') } } });
          }
          // Pan India preference matches everything
          locQuery.$or.push({ preferedState: { $elemMatch: { $regex: /Pan India/i } } });

          // Fallback if no specific city/state provided
          if (locQuery.$or.length === 1) { // Only contains Pan India
            locQuery.$or.push({ _id: { $exists: true } }); // Matches everything
          }

          if (body.vacancyCategory !== 'Non-Teaching') {
            // Build Teacher Query
            const tQuery: Record<string, unknown> = { email: { $exists: true, $ne: null } };

            // Location
            tQuery.$or = locQuery.$or;

            // Subjects
            const vacancySubjects: string[] = [];
            if (body.subject) vacancySubjects.push(body.subject);
            if (Array.isArray(body.requirements)) {
              body.requirements.forEach((req: { subject?: string }) => {
                if (req.subject) vacancySubjects.push(req.subject);
              });
            }
            if (vacancySubjects.length > 0) {
              const subjectRegexes = vacancySubjects.map(s => new RegExp(`^${s.trim()}$`, 'i'));
              tQuery.subject = { $in: subjectRegexes };
            }

            // Exams
            if (Array.isArray(body.exam) && body.exam.length > 0) {
              const examRegexes = body.exam.map((e: string) => new RegExp(`^${e.trim()}$`, 'i'));
              tQuery.exams = { $in: examRegexes };
            }

            const teachers = await Teacher.find(tQuery, 'email').lean() as { email?: string }[];
            teachers.forEach(t => { if (t.email) teacherEmails.push(t.email); });
          }

          if (body.vacancyCategory !== 'Teaching') {
            // Build Non-Teacher Query
            const ntQuery: Record<string, unknown> = { email: { $exists: true, $ne: null } };

            // Location
            ntQuery.$or = locQuery.$or;

            // Optional: Job Title fuzzy matching
            if (body.jobTitle) {
              ntQuery.jobRole = { $elemMatch: { $regex: new RegExp(body.jobTitle.split(' ')[0], 'i') } };
            }

            const nonTeachers = await NonTeacher.find(ntQuery, 'email').lean() as { email?: string }[];
            nonTeachers.forEach(nt => { if (nt.email) nonTeacherEmails.push(nt.email); });
          }

          const uniqueEmails = Array.from(new Set([...teacherEmails, ...nonTeacherEmails]));

          if (uniqueEmails.length > 0) {
            await sendVacancyNotificationEmail(_vacancy, uniqueEmails);
          }
        } catch (error) {
          console.error("Failed to send vacancy notification emails:", error);
        }
      })();
    }

    return NextResponse.json(
      { message: isApproved ? 'Vacancy posted successfully!' : 'Vacancy submitted for approval' },
      { status: 201 }
    );
  } catch (error) {
    console.error("VACANCY_POST_ERROR:", error);
    return NextResponse.json(
      { error: 'Failed to post vacancy' },
      { status: 500 }
    );
  }
}
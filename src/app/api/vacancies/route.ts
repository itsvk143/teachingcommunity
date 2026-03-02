import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendVacancyNotificationEmail } from '@/lib/email';
import Teacher from '@/model/Teacher';
import NonTeacher from '@/model/NonTeacher';
import User from '@/model/User';

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
      const user = session.user as { role: string; id: string };

      const allowedRoles = ['coaching', 'school', 'consultant', 'admin', 'hr'];

      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Unauthorized: Only Coaching Owners, School Owners, and Consultants can post jobs.' },
          { status: 403 }
        );
      }

      postedBy = user.id;
      posterRole = user.role;
    } else {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to post jobs.' },
        { status: 401 }
      );
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
          const [teachers, nonTeachers] = await Promise.all([
            Teacher.find({ email: { $exists: true, $ne: null } }, 'email').lean(),
            NonTeacher.find({ email: { $exists: true, $ne: null } }, 'email').lean()
          ]);

          const emails = [
            ...teachers.map(t => (t as { email?: string }).email),
            ...nonTeachers.map(nt => (nt as { email?: string }).email)
          ].filter(Boolean) as string[];

          const uniqueEmails = Array.from(new Set(emails));
          await sendVacancyNotificationEmail(_vacancy, uniqueEmails);
        } catch (error) {
          console.error("Failed to send vacancy notification emails:", error);
        }
      })();
    }

    return NextResponse.json(
      { message: isApproved ? 'Vacancy posted successfully!' : 'Vacancy submitted for approval' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to post vacancy' },
      { status: 500 }
    );
  }
}
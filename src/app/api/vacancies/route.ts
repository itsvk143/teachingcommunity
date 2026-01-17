import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

/* =====================
   GET: All vacancies
===================== */
export async function GET() {
  try {
    await dbConnect();

    const vacancies = await Vacancy.find({ isApproved: true })
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

    let isApproved = false;
    let postedBy = null;
    let posterRole = null;

    if (session?.user) {
      // Auto-approve for registered users
      const allowedRoles = ['admin', 'coaching', 'teacher', 'non-teacher'];
      const user = session.user as { role: string; id: string };
      if (allowedRoles.includes(user.role)) {
        isApproved = true;
        postedBy = user.id;
        posterRole = user.role;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _vacancy = await Vacancy.create({
      ...body,
      isApproved,
      postedBy,
      posterRole
    });

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
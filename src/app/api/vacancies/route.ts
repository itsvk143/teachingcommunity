import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';
import { getServerSession } from 'next-auth';
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
  } catch (error) {
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
    const session = await getServerSession(authOptions as any) as any;

    let isApproved = false;
    let postedBy = null;
    let posterRole = null;

    if (session?.user) {
      // Auto-approve for registered users
      const allowedRoles = ['admin', 'coaching', 'teacher', 'non-teacher'];
      const user = session.user as any;
      if (allowedRoles.includes(user.role)) {
        isApproved = true;
        postedBy = user.id;
        posterRole = user.role;
      }
    }

    const vacancy = await Vacancy.create({
      ...body,
      isApproved,
      postedBy,
      posterRole
    });

    return NextResponse.json(
      { message: isApproved ? 'Vacancy posted successfully!' : 'Vacancy submitted for approval' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to post vacancy' },
      { status: 500 }
    );
  }
}
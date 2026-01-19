import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HomeTuition from '@/model/HomeTuition';
import { getServerSession, type AuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const role = searchParams.get('role');

    const query: Record<string, string> = {};
    if (email) query.userEmail = email;
    if (role) query.role = role;

    const posts = await HomeTuition.find(query).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // 🔒 SECURTY CHECK: User MUST have a profile to post
    const userEmail = session.user?.email;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session.user as any)?.id;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized: No email found' }, { status: 401 });
    }

    const [teacher, staff, school, coaching, parent, student] = await Promise.all([
      import('@/model/Teacher').then(m => m.default.exists({ email: userEmail })),
      import('@/model/NonTeacher').then(m => m.default.exists({ email: userEmail })),
      import('@/model/School').then(m => m.default.exists({ owner_user_id: userId })),
      import('@/model/Coaching').then(m => m.default.exists({ email: userEmail })),
      import('@/model/ParentProfile').then(m => m.default.exists({ userEmail: userEmail })),
      import('@/model/StudentProfile').then(m => m.default.exists({ userEmail: userEmail }))
    ]);

    if (!teacher && !staff && !school && !coaching && !parent && !student) {
      return NextResponse.json(
        { error: 'You must create a profile (Teacher, Staff, Parent, etc.) before posting.' },
        { status: 403 }
      );
    }

    if (!body.name || !body.contact || !body.location || !body.classGrade || !body.subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = await HomeTuition.create({
      ...body,
      userEmail: session.user.email
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

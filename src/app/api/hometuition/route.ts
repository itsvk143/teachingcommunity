import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HomeTuition from '@/model/HomeTuition';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const role = searchParams.get('role');

    const query: any = {};
    if (email) query.userEmail = email;
    if (role) query.role = role;

    const posts = await HomeTuition.find(query).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

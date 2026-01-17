import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import StudentProfile from '@/model/StudentProfile';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      const profile = await StudentProfile.findOne({ userEmail: email });
      return NextResponse.json(profile);
    }

    // If no email, check for Admin session
    const session = await getServerSession(authOptions);
    if (session?.user?.role === 'admin') {
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '25');
      const skip = (page - 1) * limit;

      const [profiles, total] = await Promise.all([
        StudentProfile.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
        StudentProfile.countDocuments({})
      ]);

      return NextResponse.json({
        profiles,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    }

    return NextResponse.json({ error: 'Email is required or unauthorized access' }, { status: 400 });
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

    const existingProfile = await StudentProfile.findOne({ userEmail: session.user.email });
    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 });
    }

    const newProfile = await StudentProfile.create({
      ...body,
      userEmail: session.user.email
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

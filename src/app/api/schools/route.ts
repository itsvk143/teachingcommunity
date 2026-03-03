import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import School from '@/model/School';
import User from '@/model/User';
import slugify from 'slugify';
import { getServerSession, type AuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const city = searchParams.get('city');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (email) {
      query.email = { $regex: new RegExp(`^${email}$`, 'i') };
    }

    if (city) {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    // Add more filters as needed

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const skip = (page - 1) * limit;

    const [schools, total] = await Promise.all([
      School.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      School.countDocuments(query)
    ]);

    return NextResponse.json({
      schools,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Basic Validation
    if (!body.name || !body.email || !body.phone_primary) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    if (!body.slug && body.name) {
      body.slug = slugify(body.name, { lower: true, strict: true }) + '-' + Date.now(); // Ensure unique slug
    }

    // Link to user and update role
    const userId = (session.user as { id: string }).id;
    body.owner_user_id = userId;

    if (userId) {
      await User.findByIdAndUpdate(userId, { role: 'school' });
    }

    const newSchool = await School.create(body);
    return NextResponse.json(newSchool, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { error: 'Duplicate entry (Email or Slug already exists)' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

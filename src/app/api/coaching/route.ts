import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coaching from '@/model/Coaching';
import slugify from 'slugify';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const query = email ? { email: { $regex: new RegExp(`^${email}$`, 'i') } } : {};
    const coachings = await Coaching.find(query).sort({ createdAt: -1 });
    return NextResponse.json(coachings);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Basic Validation
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    if (!body.slug && body.name) {
      body.slug = slugify(body.name, { lower: true, strict: true });
    }

    const newCoaching = await Coaching.create(body);
    return NextResponse.json(newCoaching, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

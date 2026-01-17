import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/* ================================
   GET: Fetch all teachers
   Sorted by sequence (ASC)
================================ */
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url); // Extract query params
    const email = searchParams.get('email'); // Check for 'email' param

    // Build filter object (case-insensitive for email)
    const filter = email ? { email: { $regex: new RegExp(`^${email}$`, 'i') } } : {};

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const skip = (page - 1) * limit;

    const [teachers, total] = await Promise.all([
      Teacher.find(filter)
        .sort({ sequence: 1, createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Teacher.countDocuments(filter)
    ]);

    return NextResponse.json({
      teachers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET /api/teachers error:', error);
    return NextResponse.json(
      { error: `Failed to fetch teachers: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/* ================================
   POST: Create new teacher
   Auto-assign sequence (last)
================================ */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    // Normalize email
    const email = body.email.toLowerCase();

    // Check for existing teacher (case-insensitive)
    const existing = await Teacher.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (existing) {
      return NextResponse.json(
        { error: 'Teacher already exists' },
        { status: 409 }
      );
    }

    // 🔹 Generate slug
    const slug = slugify(`${body.email}-${body.phone}`);

    // 🔹 Get max sequence
    const lastTeacher = await Teacher.findOne()
      .sort({ sequence: -1 })
      .select('sequence')
      .lean() as { sequence?: number } | null;

    const nextSequence =
      lastTeacher && typeof lastTeacher.sequence === 'number'
        ? lastTeacher.sequence + 1
        : 1;

    // 🔹 Create teacher with sequence
    const newTeacher = await Teacher.create({
      ...body,
      slug,
      sequence: nextSequence, // ⭐ AUTO SEQUENCE
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.error('POST /api/teachers error:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    );
  }
}

/* ================================
   Utility: Slugify
================================ */
function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9@.-]/g, '');
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NonTeacher from '@/model/NonTeacher';
import slugify from 'slugify';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const query = email ? { email: { $regex: new RegExp(`^${email}$`, 'i') } } : {};

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const skip = (page - 1) * limit;

    const [staff, total] = await Promise.all([
      NonTeacher.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NonTeacher.countDocuments(query)
    ]);

    return NextResponse.json({
      staff,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching non-teachers:', error);
    return NextResponse.json({ error: 'Failed to fetch non-teachers' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();

    // Generate slug
    let slug = slugify(body.name, { lower: true, strict: true });

    // Check for duplicate slug
    let slugExists = await NonTeacher.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${slugify(body.name, { lower: true, strict: true })}-${counter}`;
      slugExists = await NonTeacher.findOne({ slug });
      counter++;
    }

    const newStaff = await NonTeacher.create({ ...body, slug });
    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error('Error creating non-teacher:', error);
    return NextResponse.json({ error: error.message || 'Failed to create' }, { status: 500 });
  }
}

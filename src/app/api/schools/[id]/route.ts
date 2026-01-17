import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import School from '@/model/School';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    return NextResponse.json(school);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Authorization
    const isOwner = school.owner_user_id === session.user.id || school.email === session.user.email;
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    // Prevent updating critical fields if needed, or allow all for now.
    // Update slug if name changes
    if (body.name && body.name !== school.name) {
      body.slug = slugify(body.name, { lower: true, strict: true }) + '-' + Date.now();
    }

    const updatedSchool = await School.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedSchool);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Authorization
    const isOwner = school.owner_user_id === session.user.id || school.email === session.user.email;
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await school.deleteOne();

    return NextResponse.json({ message: 'School deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coaching from '@/model/Coaching';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return NextResponse.json({ error: 'Coaching not found' }, { status: 404 });
    }

    return NextResponse.json(coaching);
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
    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return NextResponse.json({ error: 'Coaching not found' }, { status: 404 });
    }

    // Authorization: Allow Admin or Owner
    // Assuming 'admin' role or matching owner email/id
    const isOwner = coaching.email === session.user.email || coaching.owner_user_id === session.user.id;
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    // Prevent updating reviews via this endpoint
    delete body.platform_reviews;
    delete body.google_reviews_list;
    delete body.is_verified; // Prevent verifying themselves

    // Update slug if name changes
    if (body.name && body.name !== coaching.name) {
      body.slug = slugify(body.name, { lower: true, strict: true });
    }

    const updatedCoaching = await Coaching.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedCoaching);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

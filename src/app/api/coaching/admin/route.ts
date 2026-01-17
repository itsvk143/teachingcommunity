
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coaching from '@/model/Coaching';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url); // Extract query params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const skip = (page - 1) * limit;

    const [coachings, total] = await Promise.all([
      Coaching.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Coaching.countDocuments({})
    ]);

    return NextResponse.json({
      coachings,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch coachings' }, { status: 500 });
  }
} // GET

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, isVerified } = await req.json();
    await dbConnect();

    const updated = await Coaching.findByIdAndUpdate(
      id,
      { is_verified: isVerified }, // Mapping incoming isVerified to schema's is_verified
      { new: true }
    );

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    await dbConnect();

    await Coaching.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

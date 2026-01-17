import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NonTeacher from '@/model/NonTeacher';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const staff = await NonTeacher.findById(id);
    if (!staff) {
      return NextResponse.json({ error: 'Non-Teacher not found' }, { status: 404 });
    }
    return NextResponse.json(staff);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    const updatedStaff = await NonTeacher.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return NextResponse.json({ error: 'Non-Teacher not found' }, { status: 404 });
    }

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const deleted = await NonTeacher.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Non-Teacher not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

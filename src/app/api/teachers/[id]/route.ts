import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';
import { isValidObjectId, Types } from 'mongoose';

// GET handler for a specific teacher by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Log for debugging
    console.log("Requested teacher ID:", id);
    console.log("Is valid ObjectId?", isValidObjectId(id));

    // Validate MongoDB ObjectId - this might be the issue
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid teacher ID format' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Try a more direct approach with explicit ObjectId conversion
    // This can sometimes solve ObjectId comparison issues
    const teacher = await Teacher.findOne({ _id: new Types.ObjectId(id) }).lean();

    console.log("Teacher found?", !!teacher);

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error("Error fetching teacher:", error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher', details: error.message },
      { status: 500 }
    );
  }
}

// PUT handler to update teacher
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid teacher ID format' },
        { status: 400 }
      );
    }

    // Check ownership before update
    const existingTeacher = await Teacher.findById(id);
    if (!existingTeacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const isOwner = (session as any).user?.email?.toLowerCase() === existingTeacher.email?.toLowerCase();
    const isAdmin = (session as any).user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    // Sanitize input data to prevent security issues
    const { _id, createdAt, updatedAt, __v, sequence, ...rest } = data;

    // Prevent non-admins from verifying themselves
    let updateData = rest;
    if (!isAdmin) {
      const { isVerified, ...safeData } = rest;
      updateData = safeData;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedTeacher);
  } catch (error: any) {
    console.error("Error updating teacher:", error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: Object.keys(error.errors).map(field => ({
            field,
            message: error.errors[field].message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to update teacher: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a teacher
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid teacher ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return NextResponse.json(
        { error: 'Teacher not found for deletion' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error: any) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: `Failed to delete teacher: ${error.message}` },
      { status: 500 }
    );
  }
}
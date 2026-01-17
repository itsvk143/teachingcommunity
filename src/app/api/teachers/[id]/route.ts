import { NextResponse } from 'next/server';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';
import { isValidObjectId, Types } from 'mongoose';

// GET handler for a specific teacher by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT handler to update teacher
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
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

    const isOwner = (session.user as { email?: string })?.email?.toLowerCase() === existingTeacher.email?.toLowerCase();
    const isAdmin = (session.user as { role?: string })?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    // Sanitize input data to prevent security issues
    // Manually delete forbidden fields to avoid unused variable lint errors
    const safeUpdateData = { ...data };
    delete safeUpdateData._id;
    delete safeUpdateData.createdAt;
    delete safeUpdateData.updatedAt;
    delete safeUpdateData.__v;
    delete safeUpdateData.sequence;

    // Prevent non-admins from verifying themselves
    if (!isAdmin) {
      delete safeUpdateData.isVerified;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      safeUpdateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error("Error updating teacher:", error);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          details: Object.keys((error as any).errors).map(field => ({
            field,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            message: (error as any).errors[field].message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to update teacher: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a teacher
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: `Failed to delete teacher: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
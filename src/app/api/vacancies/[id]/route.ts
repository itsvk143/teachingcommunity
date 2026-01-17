import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';
import { isValidObjectId } from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid vacancy ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    const vacancy = await Vacancy.findById(id);

    if (!vacancy) {
      return NextResponse.json(
        { error: 'Vacancy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vacancy);
  } catch (error: any) {
    console.error("Error fetching vacancy:", error);
    return NextResponse.json(
      { error: 'Failed to fetch vacancy', details: error.message },
      { status: 500 }
    );
  }
}

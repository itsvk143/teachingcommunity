import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';
import { isValidObjectId } from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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
  } catch (error) {
    console.error("Error fetching vacancy:", error);
    return NextResponse.json(
      { error: 'Failed to fetch vacancy', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid vacancy ID' }, { status: 400 });
    }

    await dbConnect();

    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedVacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 });
    }

    return NextResponse.json(updatedVacancy);
  } catch (error) {
    console.error("Error updating vacancy:", error);
    return NextResponse.json(
      { error: 'Failed to update vacancy', details: (error as Error).message },
      { status: 500 }
    );
  }
}

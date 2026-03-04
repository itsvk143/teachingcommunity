import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';
import { isValidObjectId } from 'mongoose';
import User from '@/model/User';

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

    const vacancy = await Vacancy.findById(id).populate({ path: 'postedBy', model: User, select: 'name' });

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

    // Validation for India
    if (body.country === 'India' && (!body.city || !body.state)) {
      return NextResponse.json(
        { error: 'City and State are required for vacancies in India' },
        { status: 400 }
      );
    }

    // Automatically set location if city/state provided, but PRESERVE existing location detail
    if (body.city && body.state) {
      const area = body.location || '';
      if (area && !area.toLowerCase().includes(body.city.toLowerCase())) {
        body.location = `${area}, ${body.city}, ${body.state}`;
      } else if (!area) {
        body.location = `${body.city}, ${body.state}`;
      }
    }

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

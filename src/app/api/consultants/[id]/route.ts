import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Consultant from '@/model/Consultant';
import { isValidObjectId } from 'mongoose';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { error: 'Invalid Consultant ID format' },
                { status: 400 }
            );
        }

        await dbConnect();

        const consultant = await Consultant.findById(id);

        if (!consultant) {
            return NextResponse.json(
                { error: 'Consultant not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(consultant);
    } catch (error) {
        console.error("Error fetching consultant:", error);
        return NextResponse.json(
            { error: 'Failed to fetch consultant', details: (error as Error).message },
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
            return NextResponse.json({ error: 'Invalid Consultant ID' }, { status: 400 });
        }

        await dbConnect();

        const updatedConsultant = await Consultant.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedConsultant) {
            return NextResponse.json({ error: 'Consultant not found' }, { status: 404 });
        }

        return NextResponse.json(updatedConsultant);
    } catch (error) {
        console.error("Error updating consultant:", error);
        return NextResponse.json(
            { error: 'Failed to update consultant', details: (error as Error).message },
            { status: 500 }
        );
    }
}

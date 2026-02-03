import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Application from '@/model/Application';
import Vacancy from '@/model/Vacancy';
import { authOptions } from '@/lib/auth';

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized. Please log in to apply.' },
                { status: 401 }
            );
        }

        const { vacancyId } = await req.json();

        if (!vacancyId) {
            return NextResponse.json(
                { message: 'Vacancy ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if vacancy exists
        const vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return NextResponse.json(
                { message: 'Vacancy not found' },
                { status: 404 }
            );
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            vacancyId,
            userId: session.user.id,
        });

        if (existingApplication) {
            return NextResponse.json(
                { message: 'You have already applied for this vacancy.' },
                { status: 409 } // Conflict
            );
        }

        // Create Application
        const application = await Application.create({
            vacancyId,
            userId: session.user.id,
        });

        return NextResponse.json(
            { message: 'Application submitted successfully', application },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error submitting application:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

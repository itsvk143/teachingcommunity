import { NextResponse } from 'next/server';
import { getServerSession, type AuthOptions } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Application from '@/model/Application';
import Vacancy from '@/model/Vacancy';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        const user = session?.user as { id: string; email: string; role: string } | undefined;

        if (!user || !user.id) {
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
            userId: user.id,
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
            userId: user.id,
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

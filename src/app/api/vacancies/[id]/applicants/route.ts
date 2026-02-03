import { NextResponse } from 'next/server';
import { getServerSession, type AuthOptions } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Application from '@/model/Application';
// User model import removed
import Teacher from '@/model/Teacher'; // Ensure Teacher model is registered
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        const user = session?.user as { role: string; email: string } | undefined;

        if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id: vacancyId } = params;

        await dbConnect();

        // Fetch applications and populate User details
        const applications = await Application.find({ vacancyId })
            .populate('userId', 'name email role')
            .lean();

        // Enhance with Teacher/Profile details
        const enhancedApplications = await Promise.all(
            applications.map(async (app) => {
                if (!app.userId || !app.userId.email) return app;

                // Try to find Teacher profile by email
                // We use lean() for performance
                const teacherProfile = await Teacher.findOne({ email: app.userId.email })
                    .select('name phone currentlyWorkingIn maxQualification city state resumeLink')
                    .lean();

                return {
                    ...app,
                    profile: teacherProfile || null, // If no teacher profile, it will be null
                };
            })
        );

        return NextResponse.json(enhancedApplications, { status: 200 });
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

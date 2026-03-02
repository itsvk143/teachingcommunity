import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coaching from '@/model/Coaching';
import School from '@/model/School';
import Consultant from '@/model/Consultant';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ canMessage: false });
        }

        const { role, email } = session.user as { role: string; email: string };
        const allowedSenderRoles = ['coaching', 'school', 'consultant', 'admin', 'hr'];

        let canMessage = allowedSenderRoles.includes(role);

        // Standard users (e.g. teachers) might have an inactive session role but still own an institute profile
        if (!canMessage) {
            await dbConnect();
            const [hasCoaching, hasSchool, hasConsultant] = await Promise.all([
                Coaching.exists({ email }),
                School.exists({ email }),
                Consultant.exists({ email })
            ]);
            canMessage = !!(hasCoaching || hasSchool || hasConsultant);
        }

        return NextResponse.json({ canMessage });
    } catch (error) {
        console.error("Error evaluating message permissions:", error);
        return NextResponse.json({ canMessage: false }, { status: 500 });
    }
}

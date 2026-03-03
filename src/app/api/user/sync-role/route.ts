import { NextResponse } from 'next/server';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/User';
import Consultant from '@/model/Consultant';
import Coaching from '@/model/Coaching';
import Teacher from '@/model/Teacher';
import NonTeacher from '@/model/NonTeacher';
import School from '@/model/School';

export async function POST() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const userEmail = session.user.email;

        // Fetch existing user to check current role
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Only sync if the role is 'user' (we don't want to downgrade admins/hr)
        if (user.role !== 'user') {
            return NextResponse.json({
                message: 'Sync not required',
                role: user.role,
                synced: false
            });
        }

        let newRole = 'user';

        // 1. Check for Consultant profile (Linked by owner_user_id)
        const consultant = await Consultant.findOne({ owner_user_id: userId });
        if (consultant) {
            newRole = 'consultant';
        } else {
            // 2. Check for Coaching profile (Linked by owner_user_id)
            const coaching = await Coaching.findOne({ owner_user_id: userId });
            if (coaching) {
                newRole = 'coaching';
            } else {
                // 3. Check for School profile (Linked by owner_user_id)
                const school = await School.findOne({ owner_user_id: userId });
                if (school) {
                    newRole = 'school';
                } else {
                    // 4. Check for Teacher profile (Linked by email)
                    const teacher = await Teacher.findOne({ email: userEmail });
                    if (teacher) {
                        newRole = 'teacher';
                    } else {
                        // 5. Check for Non-Teacher profile (Linked by email)
                        const nonTeacher = await NonTeacher.findOne({ email: userEmail });
                        if (nonTeacher) {
                            newRole = 'non-teacher';
                        }
                    }
                }
            }
        }

        if (newRole !== 'user') {
            await User.findByIdAndUpdate(userId, { role: newRole });
            return NextResponse.json({
                message: `Role synchronized to ${newRole}`,
                role: newRole,
                synced: true
            });
        }

        return NextResponse.json({
            message: 'No specialized profile found',
            role: 'user',
            synced: false
        });

    } catch (error) {
        console.error('Error synchronizing role:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

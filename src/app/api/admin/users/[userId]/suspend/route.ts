import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/User';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ userId: string }> } // Await params in next 15
) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required.' },
                { status: 403 }
            );
        }

        const { userId } = await params;
        const body = await req.json();
        const { duration } = body; // '1week', 'permanent', 'lift'

        if (!duration) {
            return NextResponse.json(
                { error: 'Duration is required.' },
                { status: 400 }
            );
        }

        await dbConnect();

        let updateData: any = {};

        if (duration === '1week') {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 7);
            updateData = {
                isSuspended: true,
                suspensionEndDate: endDate
            };
        } else if (duration === 'permanent') {
            updateData = {
                isSuspended: true,
                suspensionEndDate: null // Null with isSuspended=true means permanent
            };
        } else if (duration === 'lift') {
            updateData = {
                isSuspended: false,
                suspensionEndDate: null
            };
        } else {
            return NextResponse.json(
                { error: 'Invalid duration specified.' },
                { status: 400 }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Suspension successfully updated to: ${duration}`
        });

    } catch (error) {
        console.error("Admin Suspend User Error:", error);
        return NextResponse.json(
            { error: 'Failed to update user suspension status' },
            { status: 500 }
        );
    }
}

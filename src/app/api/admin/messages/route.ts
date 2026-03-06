import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/model/Message';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        // Strictly protect this route for Admins only
        if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required.' },
                { status: 403 }
            );
        }

        await dbConnect();

        // Fetch all messages, sort by newest first
        const messages = await Message.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Admin Fetch Messages Error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch all messages' },
            { status: 500 }
        );
    }
}

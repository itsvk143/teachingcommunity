import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/model/Message';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ unread: 0 });
        }

        await dbConnect();
        const unreadCount = await Message.countDocuments({
            receiverEmail: session.user.email,
            read: false
        });

        return NextResponse.json({ unread: unreadCount });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return NextResponse.json({ unread: 0 });
    }
}

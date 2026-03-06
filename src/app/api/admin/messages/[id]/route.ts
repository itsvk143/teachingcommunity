import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/model/Message';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        // Strictly protect this route for Admins only
        if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required.' },
                { status: 403 }
            );
        }

        const unwrappedParams = await params;
        const { id } = unwrappedParams;

        await dbConnect();

        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return NextResponse.json(
                { error: 'Message not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error("Admin Delete Message Error:", error);
        return NextResponse.json(
            { error: 'Failed to delete message' },
            { status: 500 }
        );
    }
}

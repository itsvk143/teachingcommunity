import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/model/Message';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

/* =======================================
   PATCH: Mark a specific message as read
======================================= */
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Verify ownership before marking read
        const msg = await Message.findById(params.id);
        if (!msg || msg.receiverEmail !== session.user.email) {
            return NextResponse.json({ error: 'Message not found or unauthorized' }, { status: 404 });
        }

        msg.read = true;
        await msg.save();

        return NextResponse.json({ message: 'Marked as read', data: msg });
    } catch (error) {
        console.error("Error updating message:", error);
        return NextResponse.json(
            { error: 'Failed to update message' },
            { status: 500 }
        );
    }
}

/* =======================================
   DELETE: Delete a message from the inbox
======================================= */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Verify ownership before deleting
        const msg = await Message.findById(params.id);
        if (!msg || msg.receiverEmail !== session.user.email) {
            return NextResponse.json({ error: 'Message not found or unauthorized' }, { status: 404 });
        }

        await Message.findByIdAndDelete(params.id);

        return NextResponse.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json(
            { error: 'Failed to delete message' },
            { status: 500 }
        );
    }
}

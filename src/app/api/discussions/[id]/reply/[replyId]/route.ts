import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/model/Discussion';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string, replyId: string }> } // Await params in Next 15
) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required to delete replies.' },
                { status: 403 }
            );
        }

        const { id, replyId } = await params;

        await dbConnect();

        // Use MongoDB $pull to remove the specific subdocument from the replies array
        const updatedDiscussion = await Discussion.findByIdAndUpdate(
            id,
            { $pull: { replies: { _id: replyId } } },
            { new: true }
        );

        if (!updatedDiscussion) {
            return NextResponse.json(
                { error: 'Discussion not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Reply deleted successfully' });
    } catch (error) {
        console.error("Admin Delete Reply Error:", error);
        return NextResponse.json(
            { error: 'Failed to delete reply' },
            { status: 500 }
        );
    }
}

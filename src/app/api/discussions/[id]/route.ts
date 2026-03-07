import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/model/Discussion';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Await params in Next 15
) {
    try {
        const { id } = await params;

        await dbConnect();

        // Fetch the discussion and include the replies array
        const discussion = await Discussion.findById(id).lean();

        if (!discussion) {
            return NextResponse.json(
                { error: 'Discussion not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(discussion);
    } catch (error) {
        console.error("Fetch Single Discussion Error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch discussion' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Await params in Next 15
) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required to delete threads.' },
                { status: 403 }
            );
        }

        const { id } = await params;

        await dbConnect();

        const deletedThread = await Discussion.findByIdAndDelete(id);

        if (!deletedThread) {
            return NextResponse.json(
                { error: 'Discussion not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Thread deleted successfully' });
    } catch (error) {
        console.error("Admin Delete Thread Error:", error);
        return NextResponse.json(
            { error: 'Failed to delete thread' },
            { status: 500 }
        );
    }
}

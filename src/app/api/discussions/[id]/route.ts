import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/model/Discussion';

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

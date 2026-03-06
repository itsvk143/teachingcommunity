import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/model/Discussion';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Await params in Next 15
) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized: Please log in to reply.' },
                { status: 401 }
            );
        }

        const { id } = await params;

        await dbConnect();
        const body = await req.json();

        if (!body.content || body.content.trim() === '') {
            return NextResponse.json(
                { error: 'Reply content is required.' },
                { status: 400 }
            );
        }

        const { role, id: userId, email, name } = session.user as { role: string; id: string; email: string; name: string };

        const newReply = {
            content: body.content,
            authorId: userId,
            authorEmail: email,
            authorName: name || 'Anonymous',
            authorRole: role || 'user',
            createdAt: new Date()
        };

        // Push the new reply to the array using MongoDB $push
        const updatedDiscussion = await Discussion.findByIdAndUpdate(
            id,
            {
                $push: { replies: newReply },
                $set: { updatedAt: new Date() } // Bump the thread updatedAt timestamp
            },
            { new: true, runValidators: true }
        );

        if (!updatedDiscussion) {
            return NextResponse.json(
                { error: 'Discussion thread not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(newReply, { status: 201 });
    } catch (error) {
        console.error("Add Reply Error:", error);
        return NextResponse.json(
            { error: 'Failed to add reply' },
            { status: 500 }
        );
    }
}

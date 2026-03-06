import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/model/Discussion';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all discussions
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const query: Record<string, unknown> = {};
        if (category && category !== 'All') {
            query.category = category;
        }

        const discussions = await Discussion.find(query)
            .sort({ createdAt: -1 })
            // Fetch the document to accurately count replies
            .lean();

        // Map to include a replyCount instead of sending the full array to the client
        const mapped = discussions.map(d => {
            const dRecord = d as Record<string, unknown>;
            const replyCount = Array.isArray(dRecord.replies) ? dRecord.replies.length : 0;
            const { replies, ...rest } = dRecord;
            return {
                ...rest,
                replyCount
            };
        });

        return NextResponse.json(mapped);
    } catch (error) {
        console.error("Fetch Discussions Error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch discussions' },
            { status: 500 }
        );
    }
}

// POST a new discussion
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized: Please log in to post a discussion.' },
                { status: 401 }
            );
        }

        await dbConnect();
        const body = await req.json();

        if (!body.title || !body.content || !body.category) {
            return NextResponse.json(
                { error: 'Title, content, and category are required.' },
                { status: 400 }
            );
        }

        const { role, id, email, name } = session.user as { role: string; id: string; email: string; name: string };

        const newDiscussion = await Discussion.create({
            title: body.title,
            content: body.content,
            category: body.category,
            authorId: id,
            authorEmail: email,
            authorName: name || 'Anonymous',
            authorRole: role || 'user',
            replies: []
        });

        return NextResponse.json(newDiscussion, { status: 201 });
    } catch (error) {
        console.error("Create Discussion Error:", error);
        return NextResponse.json(
            { error: 'Failed to create discussion' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/model/Discussion';
import User from '@/model/User';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all discussions
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        const userRole = (session?.user as { role?: string })?.role;
        const isUnregistered = !session || userRole === 'user';

        if (isUnregistered) {
            return NextResponse.json(
                { error: 'Unauthorized: Complete registration to view discussions.' },
                { status: 403 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const requestedCategory = searchParams.get('category');

        const query: Record<string, unknown> = {};

        if (userRole !== 'admin') {
            // Determine allowed categories for this user
            const allowed = ["General"];
            switch (userRole) {
                case 'teacher': allowed.push("Teacher", "NEET/JEE", "BOARD", "FOUNDATION", "PSC", "BANKING"); break;
                case 'non-teacher': allowed.push("Non-Teacher"); break;
                case 'school': allowed.push("School"); break;
                case 'coaching': allowed.push("Coaching", "NEET/JEE", "BOARD", "FOUNDATION", "PSC", "BANKING"); break;
                case 'parent': allowed.push("Parents"); break;
                case 'student': allowed.push("Student", "BOARD", "NEET", "JEE", "SSC", "PSC", "BANKING", "OTHER"); break;
                case 'consultant': allowed.push("Consultant"); break;
            }

            // If a specific category was requested, ensure it's allowed
            if (requestedCategory && requestedCategory !== 'All') {
                if (allowed.includes(requestedCategory)) {
                    query.category = requestedCategory;
                } else {
                    // Fallback to only their allowed categories if they requested something else
                    query.category = { $in: allowed };
                }
            } else {
                // Return all allowed categories
                query.category = { $in: allowed };
            }
        } else {
            // Admin can see all, apply standard filtering
            if (requestedCategory && requestedCategory !== 'All') {
                query.category = requestedCategory;
            }
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

        // Check for suspension
        const dbUser = await User.findById(id).lean() as Record<string, any>;
        if (dbUser?.isSuspended) {
            if (!dbUser.suspensionEndDate) {
                return NextResponse.json(
                    { error: 'Your account has been permanently suspended from participating in discussions.' },
                    { status: 403 }
                );
            } else if (new Date() < new Date(dbUser.suspensionEndDate)) {
                return NextResponse.json(
                    { error: `Your account is suspended from discussions until ${new Date(dbUser.suspensionEndDate).toLocaleDateString()}.` },
                    { status: 403 }
                );
            }
        }

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

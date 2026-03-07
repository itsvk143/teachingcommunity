import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/model/Discussion';
import User from '@/model/User';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized: Please log in to vote.' },
                { status: 401 }
            );
        }

        await dbConnect();
        const unwrappedParams = await params;
        const { id } = unwrappedParams;
        const body = await req.json();
        const { action } = body; // 'upvote' or 'downvote'

        if (action !== 'upvote' && action !== 'downvote') {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const { id: userId } = session.user as { id: string };

        // Check for suspension
        const dbUser = await User.findById(userId).lean() as Record<string, any>;
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

        // Fetch the discussion
        const discussion = await Discussion.findById(id);

        if (!discussion) {
            return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
        }

        const hasUpvoted = discussion.upvotes.includes(userId);
        const hasDownvoted = discussion.downvotes.includes(userId);

        if (action === 'upvote') {
            if (hasUpvoted) {
                // Toggle off
                discussion.upvotes = discussion.upvotes.filter(u => u !== userId);
            } else {
                // Add upvote, remove downvote if exists
                discussion.upvotes.push(userId);
                if (hasDownvoted) {
                    discussion.downvotes = discussion.downvotes.filter(u => u !== userId);
                }
            }
        } else if (action === 'downvote') {
            if (hasDownvoted) {
                // Toggle off
                discussion.downvotes = discussion.downvotes.filter(u => u !== userId);
            } else {
                // Add downvote, remove upvote if exists
                discussion.downvotes.push(userId);
                if (hasUpvoted) {
                    discussion.upvotes = discussion.upvotes.filter(u => u !== userId);
                }
            }
        }

        await discussion.save();

        return NextResponse.json({
            message: 'Vote recorded',
            upvotes: discussion.upvotes,
            downvotes: discussion.downvotes
        });

    } catch (error) {
        console.error("Vote Discussion Error:", error);
        return NextResponse.json(
            { error: 'Failed to record vote' },
            { status: 500 }
        );
    }
}

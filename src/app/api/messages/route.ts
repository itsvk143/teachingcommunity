import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/model/Message';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Coaching from '@/model/Coaching';
import School from '@/model/School';
import Consultant from '@/model/Consultant';

/* =======================================
   GET: Fetch all messages for the recipient
======================================= */
export async function GET() {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch messages where the receiver is the currently logged-in user
        const messages = await Message.find({ receiverEmail: session.user.email })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

/* =======================================
   POST: Send a message to a recipient
======================================= */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { role, name, id, email } = session.user as { role: string; name: string; id: string; email: string };

        // Only non-individuals can send messages
        const allowedSenderRoles = ['coaching', 'school', 'consultant', 'admin', 'hr'];
        let isAuthorized = allowedSenderRoles.includes(role);

        // If their primary session role isn't authorized, check if they have registered an institute/consultant profile
        if (!isAuthorized && email) {
            await dbConnect();
            const [hasCoaching, hasSchool, hasConsultant] = await Promise.all([
                Coaching.exists({ email }),
                School.exists({ email }),
                Consultant.exists({ email })
            ]);
            isAuthorized = !!(hasCoaching || hasSchool || hasConsultant);
        }

        if (!isAuthorized) {
            return NextResponse.json(
                { error: 'Unauthorized: Only Institutes and Consultants can send messages.' },
                { status: 403 }
            );
        }

        const { receiverEmail, subject, content } = await req.json();

        if (!receiverEmail || !subject || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const newMessage = await Message.create({
            senderId: id,
            senderRole: role,
            senderName: name,
            receiverEmail,
            subject,
            content,
        });

        return NextResponse.json(
            { message: 'Message sent successfully', data: newMessage },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

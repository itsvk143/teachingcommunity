import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message, { IMessage } from '@/model/Message';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Coaching from '@/model/Coaching';
import School from '@/model/School';
import Consultant from '@/model/Consultant';
import ParentProfile from '@/model/ParentProfile';
import StudentProfile from '@/model/StudentProfile';

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
        // We use populate('senderId', 'email') as a fallback for legacy messages that don't have senderEmail natively
        const messages = await Message.find({ receiverEmail: session.user.email })
            .sort({ createdAt: -1 })
            .populate('senderId', 'email')
            .lean();

        // Map the results to ensure senderEmail is attached even for legacy messages and remove senderId object for clean JSON
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedMessages = messages.map((msg: any) => {
            const legacyEmail = msg.senderId?.email;

            return {
                ...msg,
                senderId: msg.senderId?._id || msg.senderId, // Keep it as an ID string/ObjectId
                senderEmail: msg.senderEmail || legacyEmail || 'unknown@example.com'
            };
        });

        return NextResponse.json(formattedMessages);
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

        const allowedSenderRoles = ['coaching', 'school', 'consultant', 'admin', 'hr', 'parent', 'student'];

        const { receiverEmail, subject, content, replyToMessageId } = await req.json();

        if (!receiverEmail || !subject || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // -------------------------------------------------------------
        // ROLE & AUTHORIZATION LOGIC
        // -------------------------------------------------------------

        let isAuthorized = allowedSenderRoles.includes(role);
        let actualSenderRole = role;

        // If not fundamentally authorized by role, check if they are replying to a message they received
        if (!isAuthorized && replyToMessageId) {
            const originalMessage = await Message.findById(replyToMessageId).lean() as unknown as IMessage;

            if (originalMessage && originalMessage.receiverEmail === email) {
                // They are the recipient of the original message, so they are allowed to reply
                isAuthorized = true;
                actualSenderRole = 'user'; // Standard teacher/user role answering back
            }
        }

        // If STILL not authorized, check if it's a generic session role but they actually own a specialized profile
        if (!isAuthorized && email) {
            const [hasCoaching, hasSchool, hasConsultant, hasParent, hasStudent] = await Promise.all([
                Coaching.exists({ email }),
                School.exists({ email }),
                Consultant.exists({ email }),
                ParentProfile.exists({ email }),
                StudentProfile.exists({ email })
            ]);

            if (hasCoaching) actualSenderRole = 'coaching';
            else if (hasSchool) actualSenderRole = 'school';
            else if (hasConsultant) actualSenderRole = 'consultant';
            else if (hasParent) actualSenderRole = 'parent';
            else if (hasStudent) actualSenderRole = 'student';

            isAuthorized = !!(hasCoaching || hasSchool || hasConsultant || hasParent || hasStudent);
        }

        if (!isAuthorized) {
            return NextResponse.json(
                { error: 'Unauthorized: You must have a registered profile to send new messages, or be replying to an existing one.' },
                { status: 403 }
            );
        }

        // -------------------------------------------------------------
        // MESSAGE CREATION
        // -------------------------------------------------------------

        const newMessage = await Message.create({
            senderId: id,
            senderRole: actualSenderRole,
            senderName: name || 'User',
            senderEmail: email, // Store the sender's email so the receiver can reply
            receiverEmail,
            subject,
            content,
            replyToMessageId: replyToMessageId || undefined
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

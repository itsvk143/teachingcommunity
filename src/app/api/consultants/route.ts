import { NextResponse } from 'next/server';
import { getServerSession, AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Consultant from '@/model/Consultant';
import slugify from 'slugify';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const ownerId = searchParams.get('ownerId');
        const email = searchParams.get('email');

        const criteria = [];
        if (email) criteria.push({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (ownerId) criteria.push({ owner_user_id: ownerId });

        const query = criteria.length > 0 ? { $or: criteria } : {};
        const consultants = await Consultant.find(query).sort({ createdAt: -1 });
        return NextResponse.json(consultants);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const session = await getServerSession(authOptions as AuthOptions);

        // Basic Validation
        if (!body.name || !body.email || !body.phone) {
            return NextResponse.json(
                { error: 'Name, email, and phone are required' },
                { status: 400 }
            );
        }

        if (!body.slug && body.brand_name) {
            body.slug = slugify(body.brand_name, { lower: true, strict: true });
        } else if (!body.slug && body.name) {
            body.slug = slugify(body.name, { lower: true, strict: true });
        }

        // Attach User ID if available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((session?.user as any)?.id) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            body.owner_user_id = (session?.user as any)?.id;
        }

        const newConsultant = await Consultant.create(body);
        return NextResponse.json(newConsultant, { status: 201 });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).code === 11000) {
            return NextResponse.json(
                { error: 'Duplicate entry: A record with this email, slug, or ID already exists.' },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const bulkOps = orderedIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { sequence: index + 1 },
      },
    }));

    await Teacher.bulkWrite(bulkOps);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reorder error:', err);
    return NextResponse.json(
      { error: 'Failed to save sequence' },
      { status: 500 }
    );
  }
}

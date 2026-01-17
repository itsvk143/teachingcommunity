import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';

/* =========================
   GET: All vacancies (admin)
========================= */
export async function GET() {
  try {
    await dbConnect();
    const vacancies = await Vacancy.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(vacancies);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch vacancies' },
      { status: 500 }
    );
  }
}

/* =========================
   PATCH: Approve vacancy
========================= */
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, ids, isApproved } = await req.json();

    // Handle Bulk Action
    if (ids && Array.isArray(ids)) {
      await Vacancy.updateMany(
        { _id: { $in: ids } },
        { $set: { isApproved: isApproved !== undefined ? isApproved : true } }
      );
      return NextResponse.json({ success: true, count: ids.length });
    }

    // Handle Single Action
    if (id) {
      await Vacancy.findByIdAndUpdate(id, {
        isApproved: isApproved !== undefined ? isApproved : true
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing id or ids' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update vacancy' },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE: Reject vacancy
========================= */
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    await Vacancy.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete vacancy' },
      { status: 500 }
    );
  }
}
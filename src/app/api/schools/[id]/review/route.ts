import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import School from '@/model/School';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// POST: Add a new review
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    // Check if user already reviewed
    const existingReview = await School.findOne({
      _id: id,
      'platform_reviews.userId': new mongoose.Types.ObjectId((session.user as { id: string }).id)
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this school' }, { status: 400 });
    }

    // Determine Review Category based on User Role
    const userRole = (session.user as { role?: string })?.role || 'student';
    let reviewCategory = 'general';
    if (['teacher', 'non-teacher'].includes(userRole)) {
      reviewCategory = 'staff';
    }

    const review = {
      userId: new mongoose.Types.ObjectId((session.user as { id: string }).id),
      userName: session.user?.name,
      rating,
      comment,
      review_category: reviewCategory,
      createdAt: new Date(),
    };

    const school = await School.findByIdAndUpdate(
      id,
      {
        $push: { platform_reviews: review },
        $inc: { platform_reviews_count: 1 },
      },
      { new: true }
    );

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Recalculate average rating
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalRating = school.platform_reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    const avgRating = totalRating / school.platform_reviews.length;

    await School.findByIdAndUpdate(id, { platform_rating: avgRating });

    return NextResponse.json({ message: 'Review added', review });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PATCH: Reply (Owner) or Edit (Author)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const body = await req.json();
    const { reviewId, replyText, rating, comment } = body;

    // SCENARIO 1: Owner Replying
    if (replyText !== undefined) {
      const isOwner = school.email === session.user?.email || school.owner_user_id === (session.user as { id: string }).id;
      const isAdmin = (session.user as { role?: string })?.role === 'admin';

      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reviewIndex = school.platform_reviews.findIndex((r: any) => r._id.toString() === reviewId);
      if (reviewIndex === -1) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

      school.platform_reviews[reviewIndex].reply = {
        text: replyText,
        createdAt: new Date()
      };

      await school.save();
      return NextResponse.json({ message: 'Reply added', review: school.platform_reviews[reviewIndex] });
    }

    // SCENARIO 2: User Editing Review
    if (rating !== undefined && comment !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reviewIndex = school.platform_reviews.findIndex((r: any) => r._id.toString() === reviewId);
      if (reviewIndex === -1) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

      const review = school.platform_reviews[reviewIndex];

      if (review.userId.toString() !== (session.user as { id: string }).id) {
        return NextResponse.json({ error: 'You can only edit your own review' }, { status: 403 });
      }

      school.platform_reviews[reviewIndex].rating = rating;
      school.platform_reviews[reviewIndex].comment = comment;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalRating = school.platform_reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      const avgRating = totalRating / school.platform_reviews.length;
      school.platform_rating = avgRating;

      await school.save();
      return NextResponse.json({ message: 'Review updated', review: school.platform_reviews[reviewIndex] });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE: Remove Review
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const isOwner = school.email === session.user?.email || school.owner_user_id === (session.user as { id: string }).id;
    const isAdmin = (session.user as { role?: string })?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    await School.findByIdAndUpdate(id, {
      $pull: { platform_reviews: { _id: reviewId } },
      $inc: { platform_reviews_count: -1 }
    });

    // Recalc Average
    const updatedSchool = await School.findById(id);
    if (updatedSchool.platform_reviews.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalRating = updatedSchool.platform_reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      const avgRating = totalRating / updatedSchool.platform_reviews.length;
      updatedSchool.platform_rating = avgRating;
    } else {
      updatedSchool.platform_rating = 0;
    }
    await updatedSchool.save();

    return NextResponse.json({ message: 'Review deleted' });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

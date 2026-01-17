import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coaching from '@/model/Coaching';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// POST: Add a new review
export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    // Check if user already reviewed
    const existingReview = await Coaching.findOne({
      _id: id,
      'platform_reviews.userId': new mongoose.Types.ObjectId(session.user.id)
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this institute' }, { status: 400 });
    }

    const review = {
      userId: new mongoose.Types.ObjectId(session.user.id),
      userName: session.user.name,
      rating,
      comment,
      createdAt: new Date(),
    };

    const coaching = await Coaching.findByIdAndUpdate(
      id,
      {
        $push: { platform_reviews: review },
        $inc: { platform_reviews_count: 1 },
      },
      { new: true }
    );

    if (!coaching) {
      return NextResponse.json({ error: 'Coaching not found' }, { status: 404 });
    }

    // Recalculate average rating
    const totalRating = coaching.platform_reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = totalRating / coaching.platform_reviews.length;

    await Coaching.findByIdAndUpdate(id, { platform_reviews_rating: avgRating });

    return NextResponse.json({ message: 'Review added', review });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Reply to a review (Owner Only) OR Edit a review (Author Only)
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return NextResponse.json({ error: 'Coaching not found' }, { status: 404 });
    }

    const body = await req.json();
    const { reviewId, replyText, rating, comment } = body;

    // SCENARIO 1: Owner Replying
    if (replyText !== undefined) {
      // Authorization: Owner or Admin
      const isOwner = coaching.email === session.user.email || coaching.owner_user_id === session.user.id;
      const isAdmin = session.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const reviewIndex = coaching.platform_reviews.findIndex(r => r._id.toString() === reviewId);
      if (reviewIndex === -1) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

      coaching.platform_reviews[reviewIndex].reply = {
        text: replyText,
        createdAt: new Date()
      };

      await coaching.save();
      return NextResponse.json({ message: 'Reply added', review: coaching.platform_reviews[reviewIndex] });
    }

    // SCENARIO 2: User Editing Review
    if (rating !== undefined && comment !== undefined) {
      // Find the review
      const reviewIndex = coaching.platform_reviews.findIndex(r => r._id.toString() === reviewId);
      if (reviewIndex === -1) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

      const review = coaching.platform_reviews[reviewIndex];

      // Authorization: Must be the author
      if (review.userId.toString() !== session.user.id) {
        return NextResponse.json({ error: 'You can only edit your own review' }, { status: 403 });
      }

      // Update fields
      coaching.platform_reviews[reviewIndex].rating = rating;
      coaching.platform_reviews[reviewIndex].comment = comment;
      // Optional: Update timestamp or add editedAt field if schema allowed (skipping for now to stick to schema)

      // Recalculate Average Rating
      const totalRating = coaching.platform_reviews.reduce((acc, r) => acc + r.rating, 0);
      const avgRating = totalRating / coaching.platform_reviews.length;
      coaching.platform_reviews_rating = avgRating;

      await coaching.save();
      return NextResponse.json({ message: 'Review updated', review: coaching.platform_reviews[reviewIndex] });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a review (Owner/Admin Only)
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return NextResponse.json({ error: 'Coaching not found' }, { status: 404 });
    }

    // Authorize: Owner or Admin
    const isOwner = coaching.email === session.user.email || coaching.owner_user_id === session.user.id;
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Remove review
    await Coaching.findByIdAndUpdate(id, {
      $pull: { platform_reviews: { _id: reviewId } },
      $inc: { platform_reviews_count: -1 }
    });

    // Fetch fresh data to recalculate specific rating if needed, but simple removal is often enough. 
    // Ideally we should recalculate the average.
    const updatedCoaching = await Coaching.findById(id);
    if (updatedCoaching.platform_reviews.length > 0) {
      const totalRating = updatedCoaching.platform_reviews.reduce((acc, r) => acc + r.rating, 0);
      const avgRating = totalRating / updatedCoaching.platform_reviews.length;
      updatedCoaching.platform_rating = avgRating;
    } else {
      updatedCoaching.platform_rating = 0;
    }
    await updatedCoaching.save();

    return NextResponse.json({ message: 'Review deleted' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

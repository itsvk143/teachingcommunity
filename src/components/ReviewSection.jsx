'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star, User } from 'lucide-react';

export default function ReviewSection({ coachingId, initialReviews = [], canReply = false }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reply State
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replying, setReplying] = useState(false);

  // Edit State
  const [editingReviewId, setEditingReviewId] = useState(null);

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    setError('');

    try {
      const method = editingReviewId ? 'PATCH' : 'POST';
      const body = editingReviewId
        ? { reviewId: editingReviewId, rating, comment }
        : { rating, comment };

      const res = await fetch(`/api/coaching/${coachingId}/review`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      if (editingReviewId) {
        setReviews(prev => prev.map(r => r._id === editingReviewId ? data.review : r));
        setEditingReviewId(null);
      } else {
        setReviews([data.review, ...reviews]);
      }

      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    // Scroll to form
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setRating(5);
    setComment('');
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;
    setReplying(true);

    try {
      const res = await fetch(`/api/coaching/${coachingId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, replyText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit reply');

      // Update local state
      setReviews(prev => prev.map(r =>
        r._id === reviewId ? { ...r, reply: data.review.reply } : r
      ));

      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      alert(err.message);
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`/api/coaching/${coachingId}/review`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (err) {
      alert(err.message);
    }
  };

  const hasReviewed = session && reviews.some(r => r.userId === session.user?.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        Reviews
        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {reviews.length}
        </span>
      </h2>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-8 bg-blue-50 p-4 rounded-lg">
        <div className="text-4xl font-bold text-blue-600">{averageRating}</div>
        <div>
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Average Rating</p>
        </div>
      </div>

      {/* Review Form */}
      {session ? (
        (hasReviewed && !editingReviewId) ? (
          <div className="mb-10 text-center py-6 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">You have already submitted a review for this institute.</p>
            <button
              onClick={() => {
                const myReview = reviews.find(r => r.userId === session.user.id);
                if (myReview) handleEditClick(myReview);
              }}
              className="mt-2 text-sm text-green-700 underline hover:text-green-900"
            >
              Edit your review
            </button>
          </div>
        ) : (
          <form id="review-form" onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">{editingReviewId ? 'Edit Review' : 'Write a Review'}</h3>
              {editingReviewId && (
                <button type="button" onClick={handleCancelEdit} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
              )}
            </div>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  >
                    <Star className="w-full h-full" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Your Review</label>
              <textarea
                required
                rows={3}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? (editingReviewId ? 'Updating...' : 'Submitting...') : (editingReviewId ? 'Update Review' : 'Post Review')}
            </button>
          </form>
        )
      ) : (
        <div className="mb-10 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-600">Please <a href="/login" className="text-blue-600 font-medium hover:underline">log in</a> to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {review.userName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900 cursor-default">{review.userName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-GB')}
                  </span>

                  {session && session.user?.id === review.userId && !editingReviewId && (
                    <button
                      onClick={() => handleEditClick(review)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                  )}

                  {canReply && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="flex text-yellow-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>

              {/* Reply Section */}
              {review.reply ? (
                <div className="mt-3 ml-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-gray-800 mb-1">Response from Institute</p>
                  </div>
                  <p className="text-sm text-gray-600">{review.reply.text}</p>
                </div>
              ) : (
                canReply && (
                  <div className="mt-2">
                    {replyingTo === review._id ? (
                      <div className="mt-2">
                        <textarea
                          className="w-full text-sm p-2 border rounded mb-2"
                          rows={2}
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="flex gap-2">
                          <button onClick={() => handleReplySubmit(review._id)} disabled={replying} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">
                            {replying ? 'Sending...' : 'Send Reply'}
                          </button>
                          <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReplyingTo(review._id)} className="text-xs text-blue-600 font-medium hover:underline mt-1">
                        Reply
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No reviews yet. Be the first to share your experience!</p>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Star, User, Users, Briefcase } from 'lucide-react';

export default function ReviewSection({ entityId, entityType = 'coaching', initialReviews = [], canReply = false }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('general'); // 'general' | 'staff'

  // Reply State
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replying, setReplying] = useState(false);

  // Edit State
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Filter Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => (r.review_category || 'general') === activeCategory);
  }, [reviews, activeCategory]);

  const averageRating = filteredReviews.length
    ? (filteredReviews.reduce((acc, r) => acc + r.rating, 0) / filteredReviews.length).toFixed(1)
    : 0;

  const endpoint = entityType === 'school' ? `/api/schools/${entityId}/review` : `/api/coaching/${entityId}/review`;

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

      const res = await fetch(endpoint, {
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
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, replyText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit reply');

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
      const res = await fetch(endpoint, {
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

  // Check user role to suggest where their review will go
  const userRole = session?.user?.role || 'student';
  const myTargetCategory = ['teacher', 'non-teacher'].includes(userRole) ? 'staff' : 'general';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Reviews
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {reviews.length}
          </span>
        </h2>

        {/* Category Toggle */}
        <div className="bg-gray-100 p-1 rounded-lg inline-flex items-center">
          <button
            onClick={() => setActiveCategory('general')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeCategory === 'general' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Users className="w-4 h-4 mr-2" /> General
          </button>
          <button
            onClick={() => setActiveCategory('staff')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeCategory === 'staff' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Briefcase className="w-4 h-4 mr-2" /> Staff
          </button>
        </div>
      </div>

      {/* Summary for Active Category */}
      <div className="flex items-center gap-4 mb-8 p-4 rounded-lg bg-gray-50 border border-gray-100">
        <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
        <div>
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">{filteredReviews.length} {activeCategory === 'general' ? 'Student/Parent' : 'Staff'} Reviews</p>
        </div>
      </div>

      {/* Review Form */}
      {session ? (
        (hasReviewed && !editingReviewId) ? (
          <div className="mb-10 text-center py-6 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-blue-800 font-medium">You have submitted your review.</p>
            <p className="text-xs text-blue-600 mt-1">It appears under the <strong>{myTargetCategory === 'staff' ? 'Staff' : 'General'}</strong> section.</p>
            <button
              onClick={() => {
                const myReview = reviews.find(r => r.userId === session.user.id);
                if (myReview) {
                  setActiveCategory(myReview.review_category || 'general');
                  handleEditClick(myReview);
                }
              }}
              className="mt-2 text-sm text-blue-700 underline hover:text-blue-900"
            >
              Edit your review
            </button>
          </div>
        ) : (
          <form id="review-form" onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{editingReviewId ? 'Edit Review' : 'Write a Review'}</h3>
                <p className="text-xs text-gray-500 mt-1">Posting publicly as <span className="font-semibold">{session.user.name}</span> ({userRole})</p>
              </div>
              {editingReviewId && (
                <button type="button" onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              )}
            </div>

            {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-10 h-10 transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  >
                    <Star className="w-full h-full" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
              <textarea
                required
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                placeholder="Share your honest feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
            >
              {submitting ? (editingReviewId ? 'Updating...' : 'Button Posting...') : (editingReviewId ? 'Update Review' : 'Post Review')}
            </button>
          </form>
        )
      ) : (
        <div className="mb-10 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-600">Please <a href="/login" className="text-blue-600 font-bold hover:underline">log in</a> to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${review.review_category === 'staff' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {review.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{review.userName}</p>
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {activeCategory === 'staff' && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded border border-purple-100">Staff</span>}

                  {session && session.user?.id === review.userId && !editingReviewId && (
                    <button onClick={() => handleEditClick(review)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  )}
                  {canReply && (
                    <button onClick={() => handleDeleteReview(review._id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
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
                <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-bold text-gray-900 mb-1 flex items-center gap-2"><Briefcase className="w-3 h-3" /> Institute Response</p>
                  <p className="text-sm text-gray-600">{review.reply.text}</p>
                </div>
              ) : (
                canReply && (
                  <div className="mt-3">
                    {replyingTo === review._id ? (
                      <div className="mt-2 animate-in fade-in">
                        <textarea
                          className="w-full text-sm p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          rows={2}
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="flex gap-2">
                          <button onClick={() => handleReplySubmit(review._id)} disabled={replying} className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium">
                            {replying ? 'Sending...' : 'Send Reply'}
                          </button>
                          <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-500 hover:text-gray-700 px-2">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReplyingTo(review._id)} className="text-xs text-blue-600 font-medium hover:underline flex items-center mt-2">
                        Reply to this review
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">No {activeCategory} reviews yet.</p>
            <p className="text-sm text-gray-500">Be the first {activeCategory === 'staff' ? 'staff member' : 'student/parent'} to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
}

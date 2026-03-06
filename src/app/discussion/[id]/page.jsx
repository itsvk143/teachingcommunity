"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Send, Clock, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";

export default function DiscussionThread({ params }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const { data: session } = useSession();
    const router = useRouter();

    const [thread, setThread] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [replyContent, setReplyContent] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);
    const [replyError, setReplyError] = useState(null);

    useEffect(() => {
        fetchThread();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchThread = async () => {
        try {
            const res = await fetch(`/api/discussions/${id}`);
            if (!res.ok) throw new Error("Discussion not found");
            const data = await res.json();
            setThread(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setReplyLoading(true);
        setReplyError(null);

        try {
            const res = await fetch(`/api/discussions/${id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: replyContent }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to post reply");
            }

            const newReply = await res.json();
            setThread(prev => ({
                ...prev,
                replies: [...(prev.replies || []), newReply]
            }));
            setReplyContent("");
        } catch (err) {
            setReplyError(err.message);
        } finally {
            setReplyLoading(false);
        }
    };

    const handleVote = async (replyId, action) => {
        if (!session?.user) {
            router.push('/login');
            return;
        }

        // Optimistic UI Update
        const userId = session.user.id;

        setThread(prev => {
            const updatedReplies = prev.replies.map(reply => {
                if (reply._id !== replyId) return reply;

                let newUpvotes = [...(reply.upvotes || [])];
                let newDownvotes = [...(reply.downvotes || [])];

                const hasUpvoted = newUpvotes.includes(userId);
                const hasDownvoted = newDownvotes.includes(userId);

                if (action === 'upvote') {
                    if (hasUpvoted) {
                        newUpvotes = newUpvotes.filter(id => id !== userId);
                    } else {
                        newUpvotes.push(userId);
                        newDownvotes = newDownvotes.filter(id => id !== userId);
                    }
                } else if (action === 'downvote') {
                    if (hasDownvoted) {
                        newDownvotes = newDownvotes.filter(id => id !== userId);
                    } else {
                        newDownvotes.push(userId);
                        newUpvotes = newUpvotes.filter(id => id !== userId);
                    }
                }

                return { ...reply, upvotes: newUpvotes, downvotes: newDownvotes };
            });
            return { ...prev, replies: updatedReplies };
        });

        // Background API call
        try {
            const res = await fetch(`/api/discussions/${id}/reply/${replyId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (!res.ok) console.error("Failed to record vote");
        } catch (err) {
            console.error("Failed to fetch vote route", err);
        }
    };

    const handleMainVote = async (action) => {
        if (!session?.user) {
            router.push('/login');
            return;
        }

        const userId = session.user.id;

        // Optimistic UI Update
        setThread(prev => {
            let newUpvotes = [...(prev.upvotes || [])];
            let newDownvotes = [...(prev.downvotes || [])];

            const hasUpvoted = newUpvotes.includes(userId);
            const hasDownvoted = newDownvotes.includes(userId);

            if (action === 'upvote') {
                if (hasUpvoted) {
                    newUpvotes = newUpvotes.filter(id => id !== userId);
                } else {
                    newUpvotes.push(userId);
                    newDownvotes = newDownvotes.filter(id => id !== userId);
                }
            } else if (action === 'downvote') {
                if (hasDownvoted) {
                    newDownvotes = newDownvotes.filter(id => id !== userId);
                } else {
                    newDownvotes.push(userId);
                    newUpvotes = newUpvotes.filter(id => id !== userId);
                }
            }

            return { ...prev, upvotes: newUpvotes, downvotes: newDownvotes };
        });

        // Background API call
        try {
            const res = await fetch(`/api/discussions/${id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (!res.ok) console.error("Failed to record main post vote");
        } catch (err) {
            console.error("Failed to fetch main post vote route", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading thread...</p>
            </div>
        );
    }

    if (error || !thread) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-32 pb-12">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Discussion</h1>
                <p className="text-gray-600 mb-6">{error || "Thread not found."}</p>
                <Link href="/discussion" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Return to Forum
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">

                <Link
                    href="/discussion"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-6 transition"
                >
                    <ArrowLeft size={18} /> Back to Forum
                </Link>

                {/* ORIGINAL POST */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 relative">
                    <div className="h-1.5 w-full bg-blue-600 absolute top-0 left-0"></div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                {thread.category}
                            </span>
                            <span className="text-sm text-gray-400 flex items-center gap-1.5">
                                <Clock size={14} />
                                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(thread.createdAt))}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-snug">
                            {thread.title}
                        </h1>

                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {thread.authorName?.charAt(0) || "U"}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">{thread.authorName}</div>
                                <div className="text-sm text-gray-500 capitalize flex items-center gap-1.5">
                                    {thread.authorRole || 'User'}
                                    {session?.user?.email === thread.authorEmail && (
                                        <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Author</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed mb-6">
                            {thread.content}
                        </div>

                        {/* MAIN POST VOTING ACTIONS */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleMainVote('upvote')}
                                className={`flex items-center gap-1.5 font-medium transition-colors ${(thread.upvotes || []).includes(session?.user?.id) ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                                title="Agree / Thumbs Up"
                            >
                                <ThumbsUp size={18} className={(thread.upvotes || []).includes(session?.user?.id) ? 'fill-green-600' : ''} />
                                {(thread.upvotes || []).length}
                            </button>
                            <button
                                onClick={() => handleMainVote('downvote')}
                                className={`flex items-center gap-1.5 font-medium transition-colors ${(thread.downvotes || []).includes(session?.user?.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                                title="Disagree / Thumbs Down"
                            >
                                <ThumbsDown size={18} className={(thread.downvotes || []).includes(session?.user?.id) ? 'fill-red-600' : ''} />
                                {(thread.downvotes || []).length}
                            </button>
                        </div>
                    </div>
                </div>

                {/* REPLIES SECTION */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 px-2">
                        <MessageSquare size={20} className="text-gray-400" />
                        {thread.replies?.length || 0} {(thread.replies?.length === 1) ? "Reply" : "Replies"}
                    </h2>

                    <div className="space-y-4">
                        {thread.replies?.map((reply, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 ml-0 md:ml-8 relative">
                                {/* Thread connecting line icon for visual hierarchy desktop */}
                                <div className="hidden md:block absolute -left-8 top-8 w-6 h-px bg-gray-300"></div>
                                <div className="hidden md:block absolute -left-8 -top-4 bottom-auto h-12 w-px bg-gray-300"></div>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                                            {reply.authorName?.charAt(0) || "U"}
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm">{reply.authorName}</span>
                                        <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                            {reply.authorRole || 'User'}
                                        </span>
                                        {reply.authorEmail === thread.authorEmail && (
                                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">OP</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(reply.createdAt))}
                                    </span>
                                </div>
                                <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed pl-10 mb-3">
                                    {reply.content}
                                </div>

                                {/* VOTING ACTIONS */}
                                <div className="pl-10 flex items-center gap-4">
                                    <button
                                        onClick={() => handleVote(reply._id, 'upvote')}
                                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${(reply.upvotes || []).includes(session?.user?.id) ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                                        title="Agree / Thumbs Up"
                                    >
                                        <ThumbsUp size={14} className={(reply.upvotes || []).includes(session?.user?.id) ? 'fill-green-600' : ''} />
                                        {(reply.upvotes || []).length}
                                    </button>
                                    <button
                                        onClick={() => handleVote(reply._id, 'downvote')}
                                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${(reply.downvotes || []).includes(session?.user?.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                                        title="Disagree / Thumbs Down"
                                    >
                                        <ThumbsDown size={14} className={(reply.downvotes || []).includes(session?.user?.id) ? 'fill-red-600' : ''} />
                                        {(reply.downvotes || []).length}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* POST REPLY FORM */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 md:p-8 ml-0 md:ml-8">
                    {session ? (
                        <form onSubmit={handleReplySubmit}>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                Leave a Reply
                            </h3>

                            {replyError && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
                                    {replyError}
                                </div>
                            )}

                            <div className="mb-4">
                                <textarea
                                    required
                                    rows={4}
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="What are your thoughts on this?"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-y text-gray-800"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={replyLoading || !replyContent.trim()}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                                >
                                    {replyLoading ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Post Reply
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Join the Conversation</h3>
                            <p className="text-gray-500 text-sm mb-4">You must be logged in to post a reply.</p>
                            <Link
                                href="/login"
                                className="inline-flex py-2 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Log In to Reply
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

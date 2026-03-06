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
        <div className="min-h-screen bg-slate-50 relative pt-28 pb-12 overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10">

                <Link
                    href="/discussion"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-700 font-bold mb-8 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:shadow-md"
                >
                    <ArrowLeft size={18} /> Back to Forum
                </Link>

                {/* ORIGINAL POST */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10 relative">
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0"></div>

                    <div className="p-6 md:p-10">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                                {thread.category}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                                <Clock size={14} className="text-gray-300" />
                                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(thread.createdAt))}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                            {thread.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
                                {thread.authorName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-lg">{thread.authorName || 'Anonymous'}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2 mt-0.5">
                                    {thread.authorRole || 'User'}
                                    {session?.user?.email === thread.authorEmail && (
                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Author</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed mb-8 md:text-lg">
                            {thread.content}
                        </div>

                        {/* MAIN POST VOTING ACTIONS */}
                        <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => handleMainVote('upvote')}
                                className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full transition-all ${(thread.upvotes || []).includes(session?.user?.id) ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200'}`}
                                title="Agree / Thumbs Up"
                            >
                                <ThumbsUp size={18} className={(thread.upvotes || []).includes(session?.user?.id) ? 'fill-green-600' : ''} />
                                {(thread.upvotes || []).length}
                            </button>
                            <button
                                onClick={() => handleMainVote('downvote')}
                                className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full transition-all ${(thread.downvotes || []).includes(session?.user?.id) ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200'}`}
                                title="Disagree / Thumbs Down"
                            >
                                <ThumbsDown size={18} className={(thread.downvotes || []).includes(session?.user?.id) ? 'fill-red-600' : ''} />
                                {(thread.downvotes || []).length}
                            </button>
                        </div>
                    </div>
                </div>

                {/* REPLIES SECTION */}
                <div className="mb-12">
                    <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-3 px-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                            <MessageSquare size={20} className="text-blue-600" />
                        </div>
                        {thread.replies?.length || 0} {(thread.replies?.length === 1) ? "Reply" : "Replies"}
                    </h2>

                    <div className="space-y-5">
                        {thread.replies?.map((reply, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 ml-0 md:ml-12 relative hover:border-gray-200 transition-colors">
                                {/* Thread connecting line icon for visual hierarchy desktop */}
                                <div className="hidden md:block absolute -left-12 top-10 w-10 h-px bg-gray-200"></div>
                                <div className="hidden md:block absolute -left-12 -top-6 bottom-auto h-16 w-px bg-gray-200"></div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm shadow-sm border border-white">
                                            {reply.authorName?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900">{reply.authorName || 'Anonymous'}</span>
                                                {reply.authorEmail === thread.authorEmail && (
                                                    <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-widest">OP</span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                {reply.authorRole || 'User'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(reply.createdAt))}
                                    </span>
                                </div>
                                <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed md:text-base pl-0 md:pl-12 mb-5">
                                    {reply.content}
                                </div>

                                {/* VOTING ACTIONS */}
                                <div className="pl-0 md:pl-12 flex items-center gap-4">
                                    <button
                                        onClick={() => handleVote(reply._id, 'upvote')}
                                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors px-3 py-1.5 rounded-full ${(reply.upvotes || []).includes(session?.user?.id) ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-transparent'}`}
                                        title="Agree / Thumbs Up"
                                    >
                                        <ThumbsUp size={14} className={(reply.upvotes || []).includes(session?.user?.id) ? 'fill-green-600' : ''} />
                                        {(reply.upvotes || []).length}
                                    </button>
                                    <button
                                        onClick={() => handleVote(reply._id, 'downvote')}
                                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors px-3 py-1.5 rounded-full ${(reply.downvotes || []).includes(session?.user?.id) ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-transparent'}`}
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
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 ml-0 md:ml-12 relative overflow-hidden">
                    {/* Top gradient bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-200 to-gray-300"></div>

                    {session ? (
                        <form onSubmit={handleReplySubmit}>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                                Leave a Reply
                            </h3>

                            {replyError && (
                                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 border border-red-100 font-medium">
                                    {replyError}
                                </div>
                            )}

                            <div className="mb-6 relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                                <textarea
                                    required
                                    rows={4}
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="What are your thoughts on this?"
                                    className="relative w-full px-5 py-4 bg-gray-50 hover:bg-white border text-lg border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-colors duration-300 resize-y text-gray-800 shadow-inner"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={replyLoading || !replyContent.trim()}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                                >
                                    {replyLoading ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                    Post Reply
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <MessageSquare className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Join the Conversation</h3>
                            <p className="text-gray-500 font-medium mb-8">You must be logged in to post a reply.</p>
                            <Link
                                href="/login"
                                className="inline-flex py-3 px-8 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
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

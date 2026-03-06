"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MessageSquare, Plus, Clock, Users, ThumbsUp, ThumbsDown } from "lucide-react";

const getAvailableCategories = (role) => {
    if (role === 'admin') return ["All", "General", "Teacher", "Non-Teacher", "Coaching", "School", "Home Tuition", "Consultant", "Parents", "Student", "BOARD", "NEET", "JEE", "SSC", "PSC", "BANKING", "NEET/JEE", "FOUNDATION", "OTHER"];
    const base = ["All", "General"];
    switch (role) {
        case 'teacher': return [...base, "Teacher", "NEET/JEE", "BOARD", "FOUNDATION", "PSC", "BANKING"];
        case 'non-teacher': return [...base, "Non-Teacher"];
        case 'school': return [...base, "School"];
        case 'coaching': return [...base, "Coaching", "NEET/JEE", "BOARD", "FOUNDATION", "PSC", "BANKING"];
        case 'parent': return [...base, "Parents"];
        case 'student': return [...base, "Student", "BOARD", "NEET", "JEE", "SSC", "PSC", "BANKING", "OTHER"];
        case 'consultant': return [...base, "Consultant"];
        default: return base; // should not reach here due to block
    }
};

export default function DiscussionFeed() {
    const { data: session, status } = useSession();
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    const userRole = session?.user?.role;
    const isReady = status !== "loading";
    const isUnregistered = status === "unauthenticated" || (session && userRole === "user");
    const allowedCategories = getAvailableCategories(userRole);

    useEffect(() => {
        fetchDiscussions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory]);

    const fetchDiscussions = async () => {
        setLoading(true);
        try {
            const url = activeCategory === "All"
                ? "/api/discussions"
                : `/api/discussions?category=${encodeURIComponent(activeCategory)}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setDiscussions(data);
            }
        } catch (error) {
            console.error("Failed to load discussions", error);
        } finally {
            setLoading(false);
        }
    };

    if (isReady && isUnregistered) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-12 flex flex-col items-center px-4 relative">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg w-full relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                        <MessageSquare className="h-10 w-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Access Restricted</h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Complete your profile registration to participate in the community discussion.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Link href="/login" className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold hover:shadow-lg transition-all text-center hover:-translate-y-0.5">
                            Log In
                        </Link>
                        <Link href="/register" className="flex-1 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all text-center hover:shadow-sm">
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative pt-28 pb-12 overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-blue-100">
                                <MessageSquare className="text-blue-600 h-7 w-7" />
                            </div>
                            Community Forum
                        </h1>
                        <p className="mt-3 text-gray-600 text-lg">Join the conversation, explore ideas, and share your views.</p>
                    </div>

                    <Link
                        href="/discussion/new"
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        Start Discussion
                    </Link>
                </div>

                {/* Category Filters */}
                <div className="flex overflow-x-auto pb-6 mb-4 gap-3 hide-scrollbar">
                    {allowedCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-sm ${activeCategory === cat
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 border-transparent hover:shadow-lg hover:-translate-y-0.5"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Discussions List */}
                {loading ? (
                    <div className="py-24 text-center flex flex-col items-center">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-t-2 border-blue-600 animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        <p className="mt-6 text-gray-500 font-medium text-lg">Loading discussions...</p>
                    </div>
                ) : discussions.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {discussions.map((doc) => (
                            <Link
                                href={`/discussion/${doc._id}`}
                                key={doc._id}
                                className="block p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
                            >
                                {/* Decorative accent line */}
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-3xl"></div>

                                <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-start pl-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                                                {doc.category}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                                                <Clock size={14} className="text-gray-300" />
                                                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(doc.createdAt))}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight pr-4">
                                            {doc.title}
                                        </h2>
                                        <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed mb-5 pr-4">
                                            {doc.content}
                                        </p>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-sm border border-white">
                                                {doc.authorName?.charAt(0)?.toUpperCase() || "U"}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 leading-none mb-1">{doc.authorName || 'Anonymous'}</span>
                                                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold leading-none">
                                                    {doc.authorRole || 'User'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 pt-5 sm:pt-0 sm:pl-8 sm:border-l sm:border-gray-100 border-t sm:border-t-0 border-gray-100 min-w-[140px] mt-2 sm:mt-0">
                                        <div className="flex flex-col items-center bg-slate-50 group-hover:bg-blue-50/40 transition-colors px-6 py-3 rounded-2xl border border-gray-100 min-w-[100px]">
                                            <span className="text-2xl font-black text-gray-700 group-hover:text-blue-700 transition-colors">{doc.replyCount || 0}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Replies</span>
                                        </div>

                                        <div className="flex gap-5 sm:w-full sm:justify-center text-gray-500 mt-1">
                                            <div className="flex items-center gap-1.5 group/vote" title="Upvotes">
                                                <ThumbsUp size={16} className={(doc.upvotes || []).includes(session?.user?.id) ? 'fill-green-500 text-green-500' : 'text-gray-300 group-hover/vote:text-green-500 transition-colors'} />
                                                <span className={`text-sm font-bold ${(doc.upvotes || []).includes(session?.user?.id) ? 'text-green-600' : 'text-gray-400'}`}>{(doc.upvotes || []).length}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 group/vote" title="Downvotes">
                                                <ThumbsDown size={16} className={(doc.downvotes || []).includes(session?.user?.id) ? 'fill-red-500 text-red-500' : 'text-gray-300 group-hover/vote:text-red-500 transition-colors'} />
                                                <span className={`text-sm font-bold ${(doc.downvotes || []).includes(session?.user?.id) ? 'text-red-600' : 'text-gray-400'}`}>{(doc.downvotes || []).length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                            <MessageSquare className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No discussions yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-lg">Be the first to start a conversation in this category and share your thoughts!</p>
                        <Link
                            href="/discussion/new"
                            className="mt-8 inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-bold transition-colors shadow-sm"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            Start a New Topic
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}

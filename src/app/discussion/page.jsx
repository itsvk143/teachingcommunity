"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MessageSquare, Plus, Clock, Users, ThumbsUp, ThumbsDown } from "lucide-react";

const CATEGORIES = ["All", "General", "Teacher", "Non-Teacher", "Coaching", "School", "Home Tuition", "Other"];

export default function DiscussionFeed() {
    const { data: session } = useSession();
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

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

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <MessageSquare className="text-blue-600 h-8 w-8" />
                            Community Forum
                        </h1>
                        <p className="mt-2 text-gray-600">Join the conversation, ask questions, and share your views.</p>
                    </div>

                    <Link
                        href="/discussion/new"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Start Discussion
                    </Link>
                </div>

                {/* Category Filters */}
                <div className="flex overflow-x-auto pb-4 mb-6 gap-2 hide-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeCategory === cat
                                ? "bg-blue-100 border-blue-200 text-blue-700"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Discussions List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            Loading discussions...
                        </div>
                    ) : discussions.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {discussions.map((doc) => (
                                <Link
                                    href={`/discussion/${doc._id}`}
                                    key={doc._id}
                                    className="block p-6 hover:bg-blue-50/50 transition duration-150 group"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                                    {doc.category}
                                                </span>
                                                <span className="text-sm text-gray-400 flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(doc.createdAt))}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                                {doc.title}
                                            </h2>
                                            <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed mb-3">
                                                {doc.content}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {doc.authorName?.charAt(0) || "U"}
                                                </div>
                                                <span className="font-medium text-gray-700">{doc.authorName}</span>
                                                <span className="text-gray-400 capitalize px-2 border-l border-gray-300">
                                                    {doc.authorRole || 'User'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-4 sm:pt-0 sm:pl-4 sm:border-l sm:border-gray-100 border-t sm:border-t-0 border-gray-100">
                                            <div className="flex gap-4 sm:w-full sm:justify-center text-gray-500">
                                                <div className="flex items-center gap-1.5" title="Upvotes">
                                                    <ThumbsUp size={16} className={(doc.upvotes || []).includes(session?.user?.id) ? 'fill-green-600 text-green-600' : ''} />
                                                    <span className="text-sm font-medium">{(doc.upvotes || []).length}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5" title="Downvotes">
                                                    <ThumbsDown size={16} className={(doc.downvotes || []).includes(session?.user?.id) ? 'fill-red-600 text-red-600' : ''} />
                                                    <span className="text-sm font-medium">{(doc.downvotes || []).length}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 min-w-[80px]">
                                                <span className="text-lg font-bold text-gray-700">{doc.replyCount || 0}</span>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Replies</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No discussions found</h3>
                            <p className="mt-1 text-gray-500">Be the first to start a conversation in this category!</p>
                            <Link
                                href="/discussion/new"
                                className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Plus size={16} />
                                Start a New Topic
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

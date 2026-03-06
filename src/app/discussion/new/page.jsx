"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageSquarePlus } from "lucide-react";

const CATEGORIES = ["General", "Teacher", "Non-Teacher", "Coaching", "School", "Home Tuition", "Other"];

export default function NewDiscussion() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "General",
    });

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Strictly require authentication to post
    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-12 flex flex-col items-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full">
                    <MessageSquarePlus className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-600 mb-6">You must be signed in to start a new discussion.</p>
                    <div className="flex gap-4 w-full">
                        <button onClick={() => router.back()} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                            Go Back
                        </button>
                        <Link href="/login" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/discussions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to post discussion");
            }

            const newPost = await res.json();
            router.push(`/discussion/${newPost._id}`);

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12">
            <div className="container mx-auto px-4 max-w-3xl">

                <Link
                    href="/discussion"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-6 transition"
                >
                    <ArrowLeft size={18} /> Back to Forum
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                    {/* Decorative Top Banner */}
                    <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0"></div>

                    <div className="p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Start a New Discussion</h1>
                        <p className="text-gray-600 mb-8">Got a question? Want to share an insight? Publish it to the community.</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Discussion Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Best practices for teaching mathematics online?"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm bg-white"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Details <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    required
                                    rows={8}
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Explain your topic, question, or thought in detail..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm resize-y"
                                />
                                <p className="text-xs text-gray-500 mt-2 text-right">
                                    Markdown and HTML are not currently supported. Plain text only.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                    className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.title.trim() || !formData.content.trim()}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquarePlus className="w-5 h-5" />
                                            Publish Topic
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

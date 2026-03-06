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
        <div className="min-h-screen bg-slate-50 relative pt-28 pb-12 overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-3xl relative z-10">

                <Link
                    href="/discussion"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-700 font-bold mb-8 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:shadow-md"
                >
                    <ArrowLeft size={18} /> Back to Forum
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                    {/* Decorative Top Banner */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0"></div>

                    <div className="p-6 md:p-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Start a New Discussion</h1>
                        <p className="text-gray-500 font-medium mb-10 text-lg">Got a question? Want to share an insight? Publish it to the community.</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100 font-bold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="group">
                                <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Discussion Title <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., Best practices for teaching mathematics online?"
                                        className="relative w-full px-5 py-4 bg-gray-50 hover:bg-white border text-lg border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-colors duration-300 shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="relative w-full px-5 py-4 bg-gray-50 hover:bg-white border text-lg border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-colors duration-300 shadow-inner appearance-none cursor-pointer"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat} className="text-gray-900">{cat}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Details <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                                    <textarea
                                        id="content"
                                        name="content"
                                        required
                                        rows={8}
                                        value={formData.content}
                                        onChange={handleChange}
                                        placeholder="Explain your topic, question, or thought in detail..."
                                        className="relative w-full px-5 py-4 bg-gray-50 hover:bg-white border text-lg border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-colors duration-300 shadow-inner resize-y"
                                    />
                                </div>
                                <p className="text-xs font-semibold text-gray-400 mt-3 text-right uppercase tracking-wider">
                                    Markdown and HTML are not currently supported. Plain text only.
                                </p>
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex justify-end gap-4 mt-10">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                    className="px-8 py-3.5 text-gray-600 font-bold hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.title.trim() || !formData.content.trim()}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white px-10 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg disabled:shadow-none"
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

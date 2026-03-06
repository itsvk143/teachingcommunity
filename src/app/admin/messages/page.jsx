"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
    LayoutDashboard, Users, Briefcase, GraduationCap,
    Crown, BookOpen, Search, Mail
} from "lucide-react";

export default function AdminMessagesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchAllMessages() {
            try {
                const res = await fetch("/api/admin/messages");
                if (!res.ok) throw new Error("Failed to fetch messages. Admin access required.");

                const data = await res.json();
                setMessages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (session?.user?.role === 'admin') {
            fetchAllMessages();
        }
    }, [session]);

    if (status === "loading" || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Messages...</div>;
    }

    if (session?.user?.role !== "admin") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p>You must be an admin to view this page.</p>
                <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    const filteredMessages = messages.filter((msg) => {
        const term = searchTerm.toLowerCase();
        return (
            msg.senderName?.toLowerCase().includes(term) ||
            msg.senderEmail?.toLowerCase().includes(term) ||
            msg.receiverEmail?.toLowerCase().includes(term) ||
            msg.subject?.toLowerCase().includes(term) ||
            msg.content?.toLowerCase().includes(term) ||
            msg.senderRole?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white min-h-screen fixed left-0 top-0 bottom-0 z-10 pt-20">
                <div className="px-6 pb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <LayoutDashboard className="text-blue-400" />
                        Admin
                    </h2>
                </div>
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <NavLink href="/admin" icon={<LayoutDashboard size={20} />}>Dashboard</NavLink>
                    <NavLink href="/admin/messages" active icon={<Mail size={20} />}>Global Inbox</NavLink>
                    <NavLink href="/teachersadmin" icon={<GraduationCap size={20} />}>Manage Teachers</NavLink>
                    <NavLink href="/nonteachersadmin" icon={<Users size={20} />}>Manage Non Teachers</NavLink>
                    <NavLink href="/admin/vacancies" icon={<Briefcase size={20} />}>Manage Vacancies</NavLink>
                    <NavLink href="/admin/coaching" icon={<Crown size={20} />}>Manage Coaching</NavLink>
                    <NavLink href="/admin/consultants" icon={<Briefcase size={20} />}>Manage Consultants</NavLink>
                    <NavLink href="/admin/parents" icon={<Users size={20} />}>Manage Parents</NavLink>
                    <NavLink href="/admin/students" icon={<GraduationCap size={20} />}>Manage Students</NavLink>
                    <NavLink href="/admin/hometuition" icon={<BookOpen size={20} />}>Manage Home Tuition</NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 min-h-screen overflow-x-hidden w-full">
                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <Mail className="text-blue-600" />
                                Global Inbox Viewer
                            </h1>
                            <p className="text-gray-500 mt-1">Read all messages sent between users on the platform.</p>
                        </div>

                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold">Sender</th>
                                        <th className="px-6 py-4 font-semibold">Receiver</th>
                                        <th className="px-6 py-4 font-semibold">Subject</th>
                                        <th className="px-6 py-4 font-semibold">Content Preview</th>
                                        <th className="px-6 py-4 font-semibold">Context</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredMessages.length > 0 ? (
                                        filteredMessages.map((msg) => (
                                            <tr key={msg._id} className="hover:bg-blue-50/50 transition-colors group">
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(msg.createdAt))}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{msg.senderName}</div>
                                                    <div className="text-xs text-gray-500">{msg.senderEmail || "N/A"}</div>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                        {msg.senderRole}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-900">{msg.receiverEmail}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-medium ${msg.replyToMessageId ? 'text-purple-600' : 'text-gray-900'}`}>
                                                        {msg.replyToMessageId ? 'Re: ' : ''}{msg.subject}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs truncate text-gray-600" title={msg.content}>
                                                        {msg.content}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {msg.relatedVacancyId ? (
                                                        <Link href={`/vacancies/${msg.relatedVacancyId}`} target="_blank" className="text-blue-600 hover:underline text-xs">
                                                            View Vacancy &nearr;
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Direct Profile</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                {searchTerm ? "No messages matching your search." : "No messages found in the database."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm text-gray-600 flex justify-between items-center">
                            <span>Showing <strong>{filteredMessages.length}</strong> messages</span>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

function NavLink({ href, children, icon, active = false }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            {icon}
            <span className="font-medium">{children}</span>
        </Link>
    );
}

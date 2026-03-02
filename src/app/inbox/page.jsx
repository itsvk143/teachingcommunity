'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen, Trash2, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function InboxPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchMessages();
        }
    }, [status, router]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            if (res.ok) {
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenMessage = async (msg) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            try {
                await fetch(`/api/messages/${msg._id}`, { method: 'PATCH' });
                // Update local state to show it's read
                setMessages(messages.map(m => m._id === msg._id ? { ...m, read: true } : m));
            } catch (error) {
                console.error("Failed to mark as read:", error);
            }
        }
    };

    const handleDeleteMessage = async (id, e) => {
        e?.stopPropagation(); // Prevent opening if clicking delete on list
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessages(messages.filter(m => m._id !== id));
                if (selectedMessage?._id === id) {
                    setSelectedMessage(null);
                }
            }
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center py-20 px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">Please log in to view your Inbox.</p>
                    <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Go to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors bg-white">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Your Inbox</h1>
                        <p className="text-gray-500 mt-1">Review messages and job offers from institutions.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                    {/* Left / Top side: Message List */}
                    <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center shrink-0">
                            <h2 className="font-bold text-gray-700">Messages ({messages.length})</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 mt-10">
                                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Your inbox is empty.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-50">
                                    {messages.map((msg) => (
                                        <li
                                            key={msg._id}
                                            onClick={() => handleOpenMessage(msg)}
                                            className={`p-4 cursor-pointer hover:bg-blue-50/50 transition-colors flex items-start gap-3 ${selectedMessage?._id === msg._id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'} ${!msg.read ? 'bg-white' : 'bg-gray-50/30'}`}
                                        >
                                            <div className="mt-1">
                                                {!msg.read ? (
                                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" title="Unread"></div>
                                                ) : (
                                                    <MailOpen className="w-4 h-4 text-gray-400 mt-0.5" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <p className={`text-sm truncate pr-2 ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                        {msg.senderName}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className={`text-sm truncate ${!msg.read ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                                    {msg.subject}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Right / Bottom side: Message Viewer */}
                    <div className={`w-full md:w-2/3 bg-white flex flex-col ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                        {selectedMessage ? (
                            <div className="flex flex-col h-full animate-in fade-in duration-300">
                                {/* Header for View */}
                                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <button className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-500" onClick={() => setSelectedMessage(null)}>
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="font-semibold px-2 flex items-center gap-1.5 py-1 bg-gray-100 rounded-md">
                                                    <Building2Icon role={selectedMessage.senderRole} />
                                                    {selectedMessage.senderName}
                                                </span>
                                                <span className="text-gray-400">&bull;</span>
                                                <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleDeleteMessage(selectedMessage._id, e)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
                                    </button>
                                </div>

                                {/* Body for View */}
                                <div className="p-8 flex-1 overflow-y-auto">
                                    <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.content}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                    <Mail className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-lg font-medium">Select a message to read</p>
                                <p className="text-sm mt-1">Offers and messages will appear here.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

// Simple helper for icon based on sender role
function Building2Icon({ role }) {
    if (role === 'coaching' || role === 'school') {
        return <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M9 8h1" /><path d="M9 12h1" /><path d="M9 16h1" /><path d="M14 8h1" /><path d="M14 12h1" /><path d="M14 16h1" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /></svg>;
    } else if (role === 'consultant') {
        return <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    }
    return <Send className="w-3.5 h-3.5" />;
}

'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ConsultantProfileView from '@/components/ConsultantProfileView';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ConsultantDetailPage({ params }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const { data: session } = useSession();

    const [consultant, setConsultant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchConsultant() {
            try {
                const res = await fetch(`/api/consultants/${id}`);
                if (!res.ok) throw new Error('Failed to fetch consultant profile');

                const data = await res.json();
                setConsultant(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchConsultant();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading consultant profile...</p>
            </div>
        );
    }

    if (error || !consultant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
                <p className="text-gray-600 mb-6 text-center">
                    {error || "The consultant profile you are looking for does not exist or has been removed."}
                </p>
                <Link href="/consultants" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition">
                    Return to Directory
                </Link>
            </div>
        );
    }

    const isOwner = session?.user?.email === consultant.email || session?.user?.id === consultant.owner_user_id;
    const isAdmin = session?.user?.role === 'admin';
    const canEdit = isOwner || isAdmin;

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/consultants" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Consultants
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 sm:p-8">
                    <ConsultantProfileView consultant={consultant} canEdit={canEdit} />
                </div>
            </div>
        </div>
    );
}

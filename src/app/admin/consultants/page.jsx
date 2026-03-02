'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PaginationControls from '@/components/PaginationControls';

export default function AdminConsultantsPage() {
    const { data: session } = useSession();
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const fetchConsultants = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                page: pagination.page,
                limit: 25,
            });

            const res = await fetch(`/api/consultants/admin?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.consultants) {
                    setConsultants(data.consultants);
                    setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
                } else {
                    setConsultants(Array.isArray(data) ? data : []);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultants();
    }, [pagination.page]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const toggleApproval = async (id, currentStatus) => {
        try {
            const res = await fetch('/api/consultants/admin', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isApproved: !currentStatus }),
            });

            if (res.ok) {
                setConsultants(prev => prev.map(c => c._id === id ? { ...c, is_approved: !currentStatus } : c));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteConsultant = async (id) => {
        if (!confirm('Are you sure you want to delete this Consultant Profile?')) return;

        try {
            const res = await fetch('/api/consultants/admin', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                setConsultants(prev => prev.filter(c => c._id !== id));
                fetchConsultants(); // Refresh to ensure pagination is correct
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (session?.user?.role !== 'admin') {
        return <div className="p-8 text-red-600">Unauthorized</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Job Consultants</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Consultant Firm</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {consultants.map((consultant) => {
                                const name = consultant.brand_name || consultant.name;
                                const contactPerson = consultant.name;
                                const isApproved = consultant.is_approved;

                                return (
                                    <tr key={consultant._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{name}</p>
                                            <p className="text-gray-500 text-xs">Contact: {contactPerson}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {consultant.city ? `${consultant.city}, ${consultant.state}` : consultant.state || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <p>{consultant.email}</p>
                                            <p>{consultant.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleApproval(consultant._id, isApproved)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                                            >
                                                {isApproved ? 'Approved' : 'Unapproved'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/consultants/${consultant._id}/edit`}
                                                className="text-blue-600 hover:text-blue-800 font-medium mr-3 inline-block"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteConsultant(consultant._id)}
                                                className="text-red-500 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {consultants.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No job consultants found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <PaginationControls
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        onPageChange={handlePageChange}
                        totalItems={pagination.total}
                    />
                </div>
            )}
        </div>
    );
}

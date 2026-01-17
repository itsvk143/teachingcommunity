'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PaginationControls from '@/components/PaginationControls';

export default function AdminCoachingPage() {
  const { data: session } = useSession();
  const [coachings, setCoachings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCoachings = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.page,
        limit: 25,
      });

      const res = await fetch(`/api/coaching/admin?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.coachings) {
          setCoachings(data.coachings);
          setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
        } else {
          setCoachings(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachings();
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const toggleVerification = async (id, currentStatus) => {
    try {
      const res = await fetch('/api/coaching/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isVerified: !currentStatus }),
      });

      if (res.ok) {
        setCoachings(prev => prev.map(c => c._id === id ? { ...c, isVerified: !currentStatus } : c));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCoaching = async (id) => {
    if (!confirm('Are you sure you want to delete this institute?')) return;

    try {
      const res = await fetch('/api/coaching/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setCoachings(prev => prev.filter(c => c._id !== id));
        fetchCoachings(); // Refresh to ensure pagination is correct
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Institutes</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Institute</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coachings.map((institute) => {
                const name = institute.name || institute.instituteName;
                const owner = institute.contact_person_name || institute.ownerName;
                const isVerified = institute.is_verified || institute.isVerified;

                return (
                  <tr key={institute._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{name}</p>
                      <p className="text-gray-500 text-xs">Owner: {owner}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {institute.city || institute.location}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p>{institute.email}</p>
                      <p>{institute.phone_primary || institute.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVerification(institute._id, isVerified)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${isVerified ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                      >
                        {isVerified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/coaching/${institute._id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-3 inline-block"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteCoaching(institute._id)}
                        className="text-red-500 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
              {coachings.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No institutes found.
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

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, CheckCircle, XCircle, Search, School } from 'lucide-react';
import Link from 'next/link';
import PaginationControls from '@/components/PaginationControls';

export default function AdminSchools() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/dashboard'); // Restrict to admin
      } else {
        fetchSchools();
      }
    }
  }, [status, session, pagination.page, debouncedSearch]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.page,
        limit: 25,
      });

      // Simple implementation: if we want server-side search, we pass params.
      // But verify if the API supports partial matching on 'name' via 'email' or 'city' params only?
      // API currently supports 'email' and 'city'. It does not look like it supports general search on 'name'.
      // For now, I will fetch paginated results. If client-side search is needed on full dataset, pagination breaks it.
      // Ideally, API should be updated to support 'search' query that checks name/city/email.
      // But previous implementation of this page did CLIENT-SIDE filtering.
      // With server-side pagination, client-side filtering only filters the current page.
      // I'll leave the 'search' input but disabling it or mapping it to 'city' if applicable is confusing.
      // For now, I'll paginate. Search might be limited to current page unless I update API further.
      // Actually, let's keep it simple: Just pagination.

      const res = await fetch(`/api/schools?${query.toString()}`);
      const data = await res.json();

      if (data.schools) {
        setSchools(data.schools);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } else if (Array.isArray(data)) {
        setSchools(data);
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/schools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSchools(prev => prev.filter(s => s._id !== id));
        fetchSchools(); // Refresh
      } else {
        alert('Failed to delete school');
      }
    } catch (error) {
      console.error('Error deleting school:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && schools.length === 0) return <div className="p-10 text-center">Loading School Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <School className="w-8 h-8 mr-3 text-blue-600" />
            School Management
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search is limited to current page..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.map((school) => {
                // Simple client-side search filter for current page
                if (search && !school.name?.toLowerCase().includes(search.toLowerCase()) && !school.city?.toLowerCase().includes(search.toLowerCase())) {
                  return null;
                }

                return (
                  <tr key={school._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {school.unique_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{school.name}</div>
                      <div className="text-xs text-gray-500">{school.principal_name} (Principal)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.city}, {school.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{school.phone_primary}</div>
                      <div className="text-xs text-gray-400">{school.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {school.is_verified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/schools/${school._id}/edit`}>
                          <button className="text-blue-600 hover:text-blue-900" title="Edit">
                            <Edit className="w-5 h-5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(school._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {schools.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No schools found.
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
      </div>
    </div>
  );
}

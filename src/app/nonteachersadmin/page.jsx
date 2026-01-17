'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import PaginationControls from '@/components/PaginationControls';

export default function NonTeachersAdminList() {
  const { data: session, status } = useSession();
  const [staffList, setStaffList] = useState([]);
  // const [filteredStaff, setFilteredStaff] = useState([]); // Removed for server-side pagination
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterVerified, setFilterVerified] = useState('all'); // all, verified, pending

  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FETCH ================= */
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.page,
        limit: 25,
      });

      if (filterVerified !== 'all') query.append('verified', filterVerified === 'verified' ? 'true' : 'false');
      if (debouncedSearch) query.append('search', debouncedSearch);

      const res = await fetch(`/api/non-teachers?${query.toString()}`);
      const data = await res.json();

      if (data.staff) {
        setStaffList(data.staff);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } else {
        setStaffList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [pagination.page, debouncedSearch, filterVerified]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  /* ================= ACTIONS ================= */
  const toggleVerification = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/non-teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentStatus })
      });

      if (res.ok) {
        setStaffList(prev => prev.map(t => t._id === id ? { ...t, isVerified: !currentStatus } : t));
      }
    } catch (error) {
      console.error("Failed to toggle verification", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await fetch(`/api/non-teachers/${id}`, { method: 'DELETE' });
      fetchStaff();
    } catch (error) {
      console.error(error);
    }
  };


  /* ================= UI ================= */
  if (status === 'loading') return <p className="p-8">Loading...</p>;
  if (session?.user?.role !== 'admin') return <p className="p-8 text-red-600">Unauthorized</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Non-Teaching Staff</h1>
        <Link href="/nonteachersadmin/new" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Staff
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search not fully implemented server-side yet..."
          className="border p-2 rounded-lg flex-1 disabled:bg-gray-100 disabled:text-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled
        />
        <select
          className="border p-2 rounded-lg"
          value={filterVerified}
          onChange={(e) => {
            setFilterVerified(e.target.value);
            setPagination(p => ({ ...p, page: 1 }));
          }}
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading data...</div>
        ) : (
          <>
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Staff Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Job Role</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          {staff.photoUrl ? (
                            <img src={staff.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">{staff.name?.[0] || 'S'}</div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{staff.name}</p>
                          <p className="text-gray-500 text-xs">{staff.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {Array.isArray(staff.jobRole) ? staff.jobRole.join(', ') : (staff.jobRole || '-')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVerification(staff._id, staff.isVerified)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${staff.isVerified ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                      >
                        {staff.isVerified ? 'Verified' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/nonteachersadmin/${staff._id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                      <button onClick={() => handleDelete(staff._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {staffList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No staff members found.
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
          </>
        )}
      </div>
    </div>
  );
}

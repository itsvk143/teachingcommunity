'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AdminVacanciesPage() {
  const { data: session } = useSession();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vacancies/admin');
      if (res.ok) {
        const data = await res.json();
        setVacancies(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  /* ================= SELECTION LOGIC ================= */
  const toggleSelectAll = () => {
    if (selectedIds.length === vacancies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vacancies.map(v => v._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  /* ================= ACTIONS ================= */
  const approveSelected = async () => {
    if (!selectedIds.length) return;

    try {
      const res = await fetch('/api/vacancies/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, isApproved: true }),
      });

      if (res.ok) {
        setVacancies(prev => prev.map(v =>
          selectedIds.includes(v._id) ? { ...v, isApproved: true } : v
        ));
        setSelectedIds([]);
        alert('Selected vacancies approved!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to approve selected');
    }
  };

  const approveVacancy = async (id, currentStatus) => {
    try {
      const res = await fetch('/api/vacancies/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !currentStatus }),
      });

      if (res.ok) {
        setVacancies(prev => prev.map(v => v._id === id ? { ...v, isApproved: !currentStatus } : v));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVacancy = async (id) => {
    if (!confirm('Are you sure you want to delete this vacancy?')) return;

    try {
      const res = await fetch('/api/vacancies/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setVacancies(prev => prev.filter(v => v._id !== id));
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Vacancies</h1>
        {selectedIds.length > 0 && (
          <button
            onClick={approveSelected}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
          >
            Approve Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={vacancies.length > 0 && selectedIds.length === vacancies.length}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">Role & Company</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vacancies.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(job._id)}
                      onChange={() => toggleSelect(job._id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{job.jobTitle}</p>
                    <p className="text-gray-500">{job.companyName}</p>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 mt-1 inline-block">{job.jobType}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <p>{job.contactEmail}</p>
                    {job.contactPhone && <p className="text-xs">{job.contactPhone}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => approveVacancy(job._id, job.isApproved)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${job.isApproved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                    >
                      {job.isApproved ? 'Approved' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteVacancy(job._id)}
                      className="text-red-500 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {vacancies.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No vacancies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
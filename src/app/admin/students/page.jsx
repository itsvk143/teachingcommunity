'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, Search, GraduationCap, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import PaginationControls from '@/components/PaginationControls';

export default function AdminStudents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/dashboard');
      } else {
        fetchProfiles();
      }
    }
  }, [status, session, pagination.page]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.page,
        limit: 25,
      });

      const res = await fetch(`/api/students?${query.toString()}`);
      const data = await res.json();
      if (data.profiles) {
        setProfiles(data.profiles);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } else if (Array.isArray(data)) {
        setProfiles(data);
      } else {
        console.error('Failed to load student profiles');
      }
    } catch (error) {
      console.error('Failed to fetch student profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles; // Search logic handled mainly by pagination window in simple implementation, or add client-side filter for page

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && profiles.length === 0) return <div className="p-10 text-center">Loading Student Profiles...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-teal-600" />
            Registered Students
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search is limited to current page..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-teal-500 w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class & School</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((s) => {
                // Simple client-side search filter for current page
                if (search && !s.name?.toLowerCase().includes(search.toLowerCase()) && !s.userEmail?.toLowerCase().includes(search.toLowerCase())) {
                  return null;
                }

                return (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{s.classGrade}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{s.school}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {s.contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="truncate max-w-[150px] block" title={s.favoriteSubjects}>
                        {s.favoriteSubjects || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/students/${s._id}/edit`}>
                        <span className="text-blue-600 hover:text-blue-900 cursor-pointer">Edit</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No student profiles found.
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

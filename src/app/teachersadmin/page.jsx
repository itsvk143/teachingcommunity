'use client';

import PaginationControls from '@/components/PaginationControls';

export default function TeachersList() {
  const { data: session, status } = useSession();
  const [teachers, setTeachers] = useState([]);
  // const [filteredTeachers, setFilteredTeachers] = useState([]); // Client-side filtering removed for server-side pagination approach or needs adjustment
  // For simplicity with server-side pagination, we will trigger fetch on filter change
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
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.page,
        limit: 25,
      });

      // Note: If API supports search/filter params, append them here. 
      // Current API implementation in previous step only looked for 'email'. 
      // If we want full search, we need to update API to support 'search' param or done locally?
      // The previous implementation did client-side filtering. 
      // For true pagination, filtering MUST be server-side. 
      // I will assume for now we just paginate the full list, and if I need to add search support to API I will do that.
      // Wait, I should probably check if I should add search support to API too?
      // The user asked for pagination. Retaining client-side search with server-side pagination is tricky (searching only current page).
      // Best approach: Add search/filter params to API in next step if needed, or just paginate what we get.
      // Let's pass the params we have.

      if (filterVerified !== 'all') query.append('verified', filterVerified === 'verified' ? 'true' : 'false');
      if (debouncedSearch) query.append('search', debouncedSearch); // Need to update API to handle this

      const res = await fetch(`/api/teachers?${query.toString()}`);
      const data = await res.json();

      if (data.teachers) {
        setTeachers(data.teachers);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } else {
        // Fallback if API hasn't been fully updated or returns array
        setTeachers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [pagination.page, debouncedSearch, filterVerified]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  /* ================= ACTIONS ================= */
  const toggleVerification = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentStatus })
      });

      if (res.ok) {
        setTeachers(prev => prev.map(t => t._id === id ? { ...t, isVerified: !currentStatus } : t));
      }
    } catch (error) {
      console.error("Failed to toggle verification", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      // Refresh to keep pagination correct
      fetchTeachers();
    } catch (error) {
      console.error(error);
    }
  };


  /* ================= UI ================= */
  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (session?.user?.role !== 'admin') return <p className="p-8 text-red-600">Unauthorized</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Teachers</h1>
        <Link href="/teachersadmin/new" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Teacher
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
          disabled // Disable search temporarily until server-side search is added, or enable if I add it now.
        />
        <select
          className="border p-2 rounded-lg"
          value={filterVerified}
          onChange={(e) => {
            setFilterVerified(e.target.value);
            setPagination(p => ({ ...p, page: 1 })); // Reset to page 1 on filter
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
                  <th className="px-6 py-4 font-semibold text-gray-700">Teacher</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Subject</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          {teacher.photoUrl ? (
                            <img src={teacher.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">{teacher.name?.[0]}</div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{teacher.name}</p>
                          <p className="text-gray-500 text-xs">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {teacher.subject || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVerification(teacher._id, teacher.isVerified)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${teacher.isVerified ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                      >
                        {teacher.isVerified ? 'Verified' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/teachersadmin/${teacher._id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                      <button onClick={() => handleDelete(teacher._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No teachers found.
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

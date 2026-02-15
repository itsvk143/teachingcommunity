'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Search,
  Plus,
  MapPin,
  Briefcase,
  Mail,
  Filter,
  User,
  Loader2,
  Layers,
  BookOpen
} from 'lucide-react';
import { TEACHING_CATEGORIES } from '@/utils/teachingCategories';
import { STATE_OPTIONS, CITIES_BY_STATE } from '@/utils/indianCities';

const ALL_EXAMS = Array.from(new Set(Object.values(TEACHING_CATEGORIES).flatMap(c => c.exams))).sort();
const ALL_SUBJECTS = Array.from(new Set(Object.values(TEACHING_CATEGORIES).flatMap(c => c.subjects))).sort();

export default function TeachersList() {
  const { data: session } = useSession();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FILTER STATES ================= */
  const [filters, setFilters] = useState({
    search: '', // Combined Name/Email search for cleaner UI
    category: '',
    subject: '',
    experience: '',
    state: '',
    city: '',
    exam: '',
  });

  /* ================= FETCH TEACHERS ================= */
  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      // Fetch with high limit to support client-side filtering for now
      const res = await fetch('/api/teachers?limit=1000', { cache: 'no-store' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to fetch teachers: ${res.status}`);
      }
      const data = await res.json();

      const list = data.teachers || (Array.isArray(data) ? data : []);
      setTeachers(list);
      setFilteredTeachers(list);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch teachers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* ================= MULTI-PARAMETER FILTER ================= */
  useEffect(() => {
    const filtered = teachers.filter((teacher) => {
      // Combined search logic (Name OR Email)
      const searchLower = filters.search.toLowerCase();
      const nameMatch = teacher.name?.toLowerCase().includes(searchLower);
      const emailMatch = teacher.email?.toLowerCase().includes(searchLower);
      const isSearchMatch = !filters.search || nameMatch || emailMatch;

      const subjectMatch = Array.isArray(teacher.subject)
        ? teacher.subject.join(', ').toLowerCase().includes(filters.subject.toLowerCase())
        : teacher.subject?.toLowerCase().includes(filters.subject.toLowerCase());

      const experienceMatch = filters.experience
        ? String(teacher.experience || '').includes(filters.experience)
        : true;

      const stateMatch = teacher.state?.toLowerCase().includes(filters.state.toLowerCase());
      const cityMatch = teacher.city?.toLowerCase().includes(filters.city.toLowerCase());

      const examMatch = filters.exam
        ? (teacher.exams && Array.isArray(teacher.exams)
          ? teacher.exams.some(e => typeof e === 'string' && e.toLowerCase().includes(filters.exam.toLowerCase()))
          : (typeof teacher.exams === 'string' && teacher.exams.toLowerCase().includes(filters.exam.toLowerCase()))
        )
        : true;

      const legacyExamMatch = filters.exam
        ? (Array.isArray(teacher.subject)
          ? teacher.subject.join(' ').toLowerCase().includes(filters.exam.toLowerCase())
          : (typeof teacher.subject === 'string' && teacher.subject.toLowerCase().includes(filters.exam.toLowerCase()))
        )
        : true;


      const categoryMatch = filters.category
        ? (teacher.categories?.includes(filters.category) || teacher.category === filters.category) // Support both new array and old string
        : true;


      return isSearchMatch && categoryMatch && subjectMatch && experienceMatch && stateMatch && (cityMatch || !filters.city) && (examMatch || !filters.exam);
    });

    setFilteredTeachers(filtered);
  }, [filters, teachers]);

  /* ================= HANDLE FILTER INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= HELPER: INITIALS AVATAR ================= */
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'T';
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Teacher Directory</h1>
            <p className="text-gray-500 mt-1">Manage and view all registered educators.</p>
          </div>

          {session?.user && (
            <Link
              href="/teachersadmin/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5" />
              Add Teacher
            </Link>
          )}
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Search Bar - Full Width on Mobile, 4 cols on Desktop */}
          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="search"
              placeholder="Search Name/Email"
              value={filters.search}
              onChange={handleChange}
              className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Layers className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="pl-9 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-700 active:text-gray-900"
            >
              <option value="">All Categories</option>
              {Object.entries(TEACHING_CATEGORIES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter (Dropdown now preferred since we have structure, but keep text search capability or allow dropdown?) 
              Let's use a Text Input with Datalist or just simple Text Input for flexibility, 
              OR if a category is selected, show numeric list.
          */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleChange}
              className="pl-9 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-700"
            >
              <option value="">All Subjects</option>
              {(filters.category ? TEACHING_CATEGORIES[filters.category].subjects : ALL_SUBJECTS).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Exam Filter Dropdown */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="exam"
              value={filters.exam}
              onChange={handleChange}
              className="pl-9 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-700 active:text-gray-900"
            >
              <option value="">All Exams</option>
              {(filters.category ? TEACHING_CATEGORIES[filters.category].exams : ALL_EXAMS).map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="md:col-span-1 relative">
            <input
              name="experience"
              placeholder="Exp"
              type="number"
              value={filters.experience}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>


          {/* State Filter */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="state"
              value={filters.state}
              onChange={(e) => {
                // When state changes, clear city
                setFilters(prev => ({ ...prev, state: e.target.value, city: '' }));
              }}
              className="pl-9 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-700"
            >
              <option value="">All States</option>
              {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* City Filter */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="city"
              value={filters.city}
              onChange={handleChange}
              disabled={!filters.state}
              className={`pl-9 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-700 ${!filters.state ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">{filters.state ? 'All Cities' : 'Select State First'}</option>
              {filters.state && CITIES_BY_STATE[filters.state]?.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
            <p>Loading teacher profiles...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* TABLE SECTION */}
        {!isLoading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredTeachers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expertise</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher._id} className="hover:bg-gray-50/80 transition-colors group">

                        {/* Name & Avatar */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{teacher.name}</div>
                              <div className="text-xs text-gray-500">ID: {teacher._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Mail className="w-3.5 h-3.5" />
                            {teacher.email}
                          </div>
                        </td>

                        {/* Subject (Badge Style) */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {Array.isArray(teacher.subject) ? teacher.subject.join(', ') : teacher.subject}
                          </span>
                        </td>

                        {/* Experience */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {teacher.experience ? `${teacher.experience} Years` : <span className="text-gray-400">-</span>}
                        </td>

                        {/* State */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {teacher.state || <span className="text-gray-400">-</span>}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/teacherspublic/${teacher._id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View
                          </Link>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <Filter className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No teachers found</h3>
                <p className="text-gray-500 max-w-sm mt-1">
                  We couldn't find any teachers matching your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={() => setFilters({ search: '', subject: '', experience: '', state: '', city: '', exam: '' })}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
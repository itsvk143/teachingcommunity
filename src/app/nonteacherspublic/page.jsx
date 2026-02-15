'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  Search,
  Plus,
  MapPin,
  Briefcase,
  Mail,
  Filter,
  Loader2,
  UserCog,
  FileText,
  ChevronRight
} from 'lucide-react';
import { STATE_OPTIONS } from '@/utils/indianCities';

const JOB_ROLE_OPTIONS = [
  'MANAGEMENT',
  'OPERATION',
  'SALES & MARKETING',
  'HR',
  'ACCOUNTANT',
  'LEGAL SUPPORT',
  'OTHER'
];

export default function NonTeachersList() {
  const { data: session } = useSession();
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FILTER STATES ================= */
  const [filters, setFilters] = useState({
    search: '', // Combined Name/Email search
    jobRole: '',
    experience: '',
    state: '',
  });

  /* ================= FETCH STAFF ================= */
  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/non-teachers?limit=1000', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch staff: ${res.status}`);
      const data = await res.json();

      const list = data.staff || (Array.isArray(data) ? data : []);
      setStaffList(list);
      setFilteredStaff(list);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch staff');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  /* ================= MULTI-PARAMETER FILTER ================= */
  useEffect(() => {
    const filtered = staffList.filter((staff) => {
      // Combined search logic (Name OR Email)
      const searchLower = filters.search.toLowerCase();
      const nameMatch = staff.name?.toLowerCase().includes(searchLower);
      const emailMatch = staff.email?.toLowerCase().includes(searchLower);
      const isSearchMatch = !filters.search || nameMatch || emailMatch;

      const jobMatch = Array.isArray(staff.jobRole)
        ? staff.jobRole.join(', ').toLowerCase().includes(filters.jobRole.toLowerCase())
        : staff.jobRole?.toLowerCase().includes(filters.jobRole.toLowerCase());

      const experienceMatch = filters.experience
        ? String(staff.experience || '').includes(filters.experience)
        : true;

      const stateMatch = staff.state?.toLowerCase().includes(filters.state.toLowerCase());

      return isSearchMatch && jobMatch && experienceMatch && stateMatch;
    });

    setFilteredStaff(filtered);
  }, [filters, staffList]);

  /* ================= HANDLE FILTER INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= HELPER: INITIALS AVATAR ================= */
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S';
  };

  /* ================= ANIMATIONS ================= */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50/50">

      {/* HEADER WITH GRADIENT */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
          <UserCog className="w-64 h-64 text-white" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2 text-blue-200 font-medium text-sm bg-blue-500/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                <FileText className="w-4 h-4" />
                <span>Staff Directory</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Non-Teaching Staff</h1>
              <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
                Connect with qualified administrative, technical, and support professionals ready to strengthen your institute.
              </p>
            </div>

            {session?.user && (
              <Link
                href="/nonteachersadmin/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-full shadow-lg text-blue-700 bg-white hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Staff
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">

        {/* FILTERS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Search */}
            <div className="md:col-span-4 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                name="search"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={handleChange}
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Job Role Filter */}
            <div className="md:col-span-3 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <select
                name="jobRole"
                value={filters.jobRole}
                onChange={handleChange}
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-gray-600"
              >
                <option value="">All Job Roles</option>
                {JOB_ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div className="md:col-span-2 relative">
              <input
                name="experience"
                placeholder="Exp (Years)"
                type="number"
                value={filters.experience}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* State Filter */}
            <div className="md:col-span-3 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <select
                name="state"
                value={filters.state}
                onChange={handleChange}
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-gray-600"
              >
                <option value="">All Locations</option>
                {STATE_OPTIONS.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
            <p className="text-lg font-medium">Loading staff profiles...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-2xl flex items-center justify-center">
            Error: {error}
          </div>
        )}

        {/* TABLE SECTION */}
        {!isLoading && !error && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {filteredStaff.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Name & ID</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Job Role</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredStaff.map((staff) => (
                      <motion.tr
                        key={staff._id}
                        variants={itemVariants}
                        className="hover:bg-blue-50/50 transition-colors group"
                      >

                        {/* Name & Avatar */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1.5" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-base">{staff.name}</div>
                              <div className="text-xs text-blue-500 font-mono bg-blue-50 px-2 py-0.5 rounded-md w-fit mt-1">ID: {staff._id.slice(-6).toUpperCase()}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">{staff.email}</span>
                          </div>
                        </td>

                        {/* Job Role (Badge Style) */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {Array.isArray(staff.jobRole) ? staff.jobRole.join(', ') : staff.jobRole}
                          </span>
                        </td>

                        {/* Experience */}
                        <td className="px-6 py-4">
                          {staff.experience ? (
                            <span className="font-semibold text-gray-700">{staff.experience} <span className="text-gray-400 font-normal text-xs">Years</span></span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* State */}
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {staff.state || <span className="text-gray-400">-</span>}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/nonteacherspublic/${staff._id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-all"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>

                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* EMPTY STATE */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <Filter className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No qualifications found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                  We couldn't find any staff matching your filters. Try removing some filters to see more results.
                </p>
                <button
                  onClick={() => setFilters({ search: '', jobRole: '', experience: '', state: '' })}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-blue-600 transition-all"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div >
  );
}

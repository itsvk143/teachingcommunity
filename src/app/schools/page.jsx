'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, School, Filter, X, BookOpen, GraduationCap } from 'lucide-react';
import { STATE_OPTIONS, CITIES_BY_STATE } from '@/utils/indianCities';

// Constants locally defined or could be imported if centralized
const BOARD_OPTIONS = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Cambridge"];
const MEDIUM_OPTIONS = ["English", "Hindi", "Regional"];
const SCHOOL_TYPES = ["Co-ed", "Boys", "Girls"];

export default function SchoolsList() {
  const [schools, setSchools] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    name: '',
    state: '',
    city: '',
    board: '',
    medium: ''
  });

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch('/api/schools?limit=1000');
        const data = await res.json();
        // Handle both simple array (legacy) and paginated response (new)
        const list = data.schools || (Array.isArray(data) ? data : []);
        setSchools(list);
        setFiltered(list);
      } catch (error) {
        console.error('Failed to fetch schools');
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = schools;

    // 1. Name Search
    if (filters.name) {
      const lowerName = filters.name.toLowerCase();
      result = result.filter(s =>
        (s.name?.toLowerCase().includes(lowerName)) ||
        (s.school_code?.toLowerCase().includes(lowerName))
      );
    }

    // 2. State Filter
    if (filters.state) {
      result = result.filter(s => s.state === filters.state);
    }

    // 3. City Filter
    if (filters.city) {
      result = result.filter(s =>
        s.city === filters.city || s.address_line1?.includes(filters.city)
      );
    }

    // 4. Board Filter (Array check)
    if (filters.board) {
      result = result.filter(s =>
        Array.isArray(s.board)
          ? s.board.includes(filters.board)
          : s.board === filters.board
      );
    }

    // 5. Medium Filter (Array check)
    if (filters.medium) {
      result = result.filter(s =>
        Array.isArray(s.medium)
          ? s.medium.includes(filters.medium)
          : s.medium === filters.medium
      );
    }

    setFiltered(result);
  }, [filters, schools]);

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      // If state changes, reset city
      if (name === 'state') return { ...prev, state: value, city: '' };
      return { ...prev, [name]: value };
    });
  };

  const clearFilters = () => {
    setFilters({ name: '', state: '', city: '', board: '', medium: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Schools</h1>
            <p className="text-gray-500 mt-1">Find the best schools in your area</p>
          </div>
          <Link
            href="/schools/register"
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition shadow-sm text-sm"
          >
            Register School
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-500" /> Filters
            </h2>
            {(filters.name || filters.state || filters.city || filters.board || filters.medium) && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Name */}
            <div className="relative lg:col-span-1">
              <input
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search School Name..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

            {/* State Filter */}
            <div className="relative">
              <select
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm appearance-none cursor-pointer text-gray-700"
              >
                <option value="">All States</option>
                {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>

            {/* City Filter */}
            <div className="relative">
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                disabled={!filters.state}
                className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm appearance-none cursor-pointer text-gray-700 ${!filters.state ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">{filters.state ? 'All Cities' : 'Select State First'}</option>
                {filters.state && CITIES_BY_STATE[filters.state]?.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>

            {/* Board Filter */}
            <div className="relative">
              <select
                name="board"
                value={filters.board}
                onChange={handleFilterChange}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm appearance-none cursor-pointer text-gray-700"
              >
                <option value="">All Boards</option>
                {BOARD_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>

            {/* Medium Filter */}
            <div className="relative">
              <select
                name="medium"
                value={filters.medium}
                onChange={handleFilterChange}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm appearance-none cursor-pointer text-gray-700"
              >
                <option value="">All Mediums</option>
                {MEDIUM_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading schools...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-900 font-bold text-lg">No schools found.</p>
            <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-red-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((school) => (
              <div key={school._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group h-full flex flex-col relative">
                {/* School Type Badge */}
                {school.school_type && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {school.school_type}
                  </div>
                )}

                <div className="flex items-start justify-between mb-4 mt-2">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-red-600 text-2xl font-bold border border-red-100 shadow-sm overflow-hidden p-1">
                    {school.logo_url ? (
                      <img src={school.logo_url} alt={school.name} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <School className="w-8 h-8 opacity-80" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
                    {school.name}
                  </h2>

                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-red-400" />
                    <span className="truncate">{school.city}, {school.state}</span>
                  </div>

                  {school.tagline && (
                    <p className="text-gray-600 text-xs line-clamp-2 mb-4 italic bg-red-50/50 p-2 rounded-lg border border-red-50">
                      "{school.tagline}"
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {school.board?.slice(0, 2).map(b => (
                      <span key={b} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100 uppercase">{b}</span>
                    ))}
                    {school.category && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded border border-green-100 uppercase">{school.category}</span>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 w-full">
                  <Link href={`/schools/${school._id}`} className="block w-full text-center py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition active:scale-95 shadow-sm">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

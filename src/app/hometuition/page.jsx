'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Filter, BookOpen, Clock, Phone, User, GraduationCap } from 'lucide-react';
import { indianCities } from '@/lib/indianCities';

export default function HomeTuitionList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ state: '', city: '', classGrade: '', subject: '' });

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/hometuition');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleStateChange = (e) => {
    setFilters({ ...filters, state: e.target.value, city: '' });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      (post.subject && post.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.classGrade && post.classGrade.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.location && post.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesState = filters.state === '' || (post.state && post.state === filters.state);
    const matchesCity = filters.city === '' || (post.city && post.city === filters.city);
    const matchesClass = filters.classGrade === '' || (post.classGrade && post.classGrade.toLowerCase().includes(filters.classGrade.toLowerCase()));
    const matchesSubject = filters.subject === '' || (post.subject && post.subject.toLowerCase().includes(filters.subject.toLowerCase()));

    return matchesSearch && matchesState && matchesCity && matchesClass && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-xs">Opportunities</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-1">Home Tuitions</h1>
            <p className="text-gray-500 mt-3 text-lg max-w-2xl leading-relaxed">
              Find the perfect home tuition opportunities near you. Connect directly with students and parents.
            </p>
          </div>
          <Link href="/hometuition/new">
            <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition transform hover:-translate-y-1 active:translate-y-0 text-sm">
              + Post a Requirement
            </button>
          </Link>
        </div>

        {/* FILTERS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">

            {/* Search - 4 Cols */}
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search subject, class or area..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters - 8 Cols */}
            <div className="lg:col-span-2">
              <select
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
                value={filters.state}
                onChange={handleStateChange}
              >
                <option value="">All States</option>
                {Object.keys(indianCities).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <select
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer disabled:opacity-50"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                disabled={!filters.state}
              >
                <option value="">All Cities</option>
                {filters.state && indianCities[filters.state]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <input
                name="classGrade"
                placeholder="Class (e.g. 10th)"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={filters.classGrade}
                onChange={handleFilterChange}
              />
            </div>

            <div className="lg:col-span-2">
              <input
                name="subject"
                placeholder="Subject (e.g. Math)"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={filters.subject}
                onChange={handleFilterChange}
              />
            </div>

          </div>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading opportunities...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any tuition needs matching your filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setFilters({ state: '', city: '', classGrade: '', subject: '' }) }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">

                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.mode === 'Online' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                      {post.mode}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={`/hometuition/${post._id}`}>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1" title={post.subject}>
                      {post.subject}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-1">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span>{post.classGrade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="line-clamp-1">{post.location}, {post.city}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-50 mx-6"></div>

                {/* Card Body */}
                <div className="p-6 pt-4 space-y-3 flex-1">
                  {post.budget && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Budget</span>
                      <span className="font-semibold text-gray-900">{post.budget}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Posted By</span>
                    <span className="font-medium text-gray-900">{post.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600 font-medium uppercase">Type: {post.tuitionType}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600 font-medium uppercase">Pref: {post.tutorGenderPreference || 'Any'}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0 mt-auto">
                  <a
                    href={`tel:${post.contact}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-blue-50 text-blue-600 font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 group/btn"
                  >
                    <Phone className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                    <span>Contact Now</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

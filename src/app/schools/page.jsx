'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, School } from 'lucide-react';

export default function SchoolsList() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch('/api/schools?limit=1000');
        const data = await res.json();

        // Handle both simple array (legacy) and paginated response (new)
        // Checks if data.schools exists (new format), else defaults to data if array, else empty
        const list = data.schools || (Array.isArray(data) ? data : []);
        setSchools(list);
      } catch (error) {
        console.error('Failed to fetch schools');
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

  const filteredSchools = schools.filter(school => {
    return searchTerm === '' ||
      (school.name && school.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (school.city && school.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (school.state && school.state.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Partner Schools</h1>
          <p className="text-gray-500 mt-2">Find the best schools in your area</p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by school name, city, or state..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No schools found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div key={school._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold border-2 border-white shadow-sm">
                    {school.logo ? <img src={school.logo} alt={school.name} className="w-full h-full rounded-full object-cover" /> : <School className="w-8 h-8" />}
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {school.name}
                  </h2>

                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{school.city}, {school.state}</span>
                  </div>

                  {school.tagline && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 italic">"{school.tagline}"</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50">
                  <Link href={`/schools/${school._id}`} className="block w-full text-center py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition">
                    View Details
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

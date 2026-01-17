'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IndianRupee, MapPin, Calendar, Clock, BookOpen, User, Search, Map, Users } from 'lucide-react';
import { indianCities } from '@/lib/indianCities';

export default function ParentRequirements() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hometuition?role=Parent');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    const matchTerm =
      (post.subject && post.subject.toLowerCase().includes(term)) ||
      (post.classGrade && post.classGrade.toLowerCase().includes(term)) ||
      (post.location && post.location.toLowerCase().includes(term));

    if (!matchTerm) return false;

    if (selectedState && post.state !== selectedState) return false;
    if (selectedCity && post.city !== selectedCity) return false;
    if (selectedClass && !post.classGrade.toLowerCase().includes(selectedClass.toLowerCase())) return false;
    if (selectedSubject && !post.subject.toLowerCase().includes(selectedSubject.toLowerCase())) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-orange-800 mb-4 flex items-center justify-center gap-3">
            <Users className="w-10 h-10" />
            Parent Requirements
          </h1>
          <p className="text-lg text-gray-600">Home tuition needs posted by parents.</p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Subject, Class, or Location..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">All States</option>
              {Object.keys(indianCities).map(state => <option key={state} value={state}>{state}</option>)}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              disabled={!selectedState}
            >
              <option value="">All Cities</option>
              {selectedState && indianCities[selectedState]?.map(city => <option key={city} value={city}>{city}</option>)}
            </select>

            <input
              type="text"
              placeholder="Filter by Class"
              className="w-full p-2 border rounded-md text-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            />

            <input
              type="text"
              placeholder="Filter by Subject"
              className="w-full p-2 border rounded-md text-sm"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No parent requirements found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-orange-100 overflow-hidden flex flex-col">
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-50 rounded-full">
                      {post.mode}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{post.subject}</h3>
                  <p className="text-sm font-medium text-orange-600 mb-4">{post.classGrade}</p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{post.location}, {post.city}</span>
                    </div>
                    {post.budget && (
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{post.budget}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">Contact: {post.name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 mt-auto">
                  <Link href={`/hometuition/${post._id}`} className="block w-full text-center text-orange-600 font-medium hover:text-orange-800 text-sm">
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

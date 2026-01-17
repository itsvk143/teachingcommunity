'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CoachingDirectory() {
  const { data: session } = useSession();
  const [coachings, setCoachings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/coaching');
        const data = await res.json();
        setCoachings(data);
        setFiltered(data);
      } catch (error) {
        console.error('Failed to fetch coaching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Search logic
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const results = coachings.filter(
      (c) =>
        c.instituteName?.toLowerCase().includes(lowerSearch) ||
        c.name?.toLowerCase().includes(lowerSearch) ||
        c.location?.toLowerCase().includes(lowerSearch) ||
        c.city?.toLowerCase().includes(lowerSearch)
    );
    setFiltered(results);
  }, [search, coachings]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coaching & HR Directory</h1>
            <p className="text-gray-500 mt-1">Connect with institutes and recruiters.</p>
          </div>
          {session?.user && (
            <div className="flex gap-3">
              <Link
                href="/jobs/new"
                className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
              >
                Post a Job
              </Link>
              <Link
                href="/coaching/register"
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Register Institute
              </Link>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full p-4 pl-12 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="w-6 h-6 text-gray-400 absolute left-4 top-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading directory...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((coaching) => {
                const name = coaching.name || coaching.instituteName;
                const owner = coaching.contact_person_name || coaching.ownerName;
                const location = coaching.city || coaching.location;
                const logo = coaching.logo_url || coaching.logoUrl;
                const phone = coaching.phone_primary || coaching.phone;
                const description = coaching.description_short || coaching.description;
                const website = coaching.website_url || coaching.website;

                return (
                  <div
                    key={coaching._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        {coaching.brand_name && (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold mb-1">
                            {coaching.brand_name}
                          </span>
                        )}
                        {coaching.is_verified && (
                          <span className="absolute top-4 right-4 text-green-500" title="Verified">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                          </span>
                        )}

                        <h3 className="text-xl font-bold text-gray-900 mt-1">
                          {name}
                        </h3>
                        <p className="text-sm text-gray-500">{location}</p>
                      </div>
                      {logo && (
                        <img
                          src={logo}
                          alt="Logo"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      )}
                    </div>

                    <p className="mt-4 text-gray-600 line-clamp-3 text-sm">
                      {description || 'No description provided.'}
                    </p>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium text-gray-900">Owner/HR:</span>
                        {owner}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium text-gray-900">Contact:</span>
                        {phone}
                      </div>
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          className="text-blue-600 hover:underline mt-1 block"
                        >
                          Visit Website
                        </a>
                      )}
                      <Link
                        href={`/coaching/${coaching._id}`}
                        className="block w-full text-center mt-4 bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                      >
                        View Details & Reviews
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No coaching institutes found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

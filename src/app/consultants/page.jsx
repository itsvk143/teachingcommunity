'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Search, MapPin, Filter, X, Building, Briefcase } from 'lucide-react';
import ContactReveal from '@/components/ContactReveal';
import { STATE_OPTIONS, CITIES_BY_STATE } from '@/utils/indianCities';

export default function ConsultantDirectory() {
    const { data: session } = useSession();
    const [consultants, setConsultants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const [filters, setFilters] = useState({
        name: '',
        state: '',
        city: ''
    });

    // Fetch data
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/consultants');
                const data = await res.json();
                setConsultants(data);
                setFiltered(data);
            } catch (error) {
                console.error('Failed to fetch consultant data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Filtering Logic
    useEffect(() => {
        let result = consultants;

        // 1. Name Search
        if (filters.name) {
            const lowerName = filters.name.toLowerCase();
            result = result.filter(c =>
                (c.name)?.toLowerCase().includes(lowerName) ||
                (c.brand_name)?.toLowerCase().includes(lowerName)
            );
        }

        // 2. State Filter
        if (filters.state) {
            result = result.filter(c => c.state === filters.state);
        }

        // 3. City Filter
        if (filters.city) {
            result = result.filter(c => c.city === filters.city);
        }

        setFiltered(result);
    }, [filters, consultants]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            if (name === 'state') return { ...prev, state: value, city: '' };
            return { ...prev, [name]: value };
        });
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ name: '', state: '', city: '' });
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Job Consultants Directory</h1>
                        <p className="text-gray-500 mt-1">Connect with trusted hiring consultants and recruitment agencies.</p>
                    </div>
                    {session?.user && (
                        <div className="flex gap-3">
                            <Link
                                href="/vacancies"
                                className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition shadow-sm text-sm whitespace-nowrap"
                            >
                                Post a Job
                            </Link>
                            <Link
                                href="/consultants/register"
                                className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition shadow-sm text-sm whitespace-nowrap"
                            >
                                Register Firm
                            </Link>
                        </div>
                    )}
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-amber-500" /> Filters
                        </h2>
                        {(filters.name || filters.state || filters.city) && (
                            <button onClick={clearFilters} className="text-sm text-red-500 hover:underline flex items-center gap-1">
                                <X className="w-3 h-3" /> Clear All
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Name */}
                        <div className="relative">
                            <input
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                                placeholder="Search Consultant..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm transition"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>

                        {/* State Filter */}
                        <div className="relative">
                            <select
                                name="state"
                                value={filters.state}
                                onChange={handleFilterChange}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm appearance-none cursor-pointer text-gray-700"
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
                                className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm appearance-none cursor-pointer text-gray-700 ${!filters.state ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="">{filters.state ? 'All Cities' : 'Select State First'}</option>
                                {filters.state && CITIES_BY_STATE[filters.state]?.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Results List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600 mb-4"></div>
                        <p className="text-gray-500">Loading directory...</p>
                    </div>
                ) : (() => {
                    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                    const paginatedConsultants = filtered.slice(
                        (currentPage - 1) * ITEMS_PER_PAGE,
                        currentPage * ITEMS_PER_PAGE
                    );

                    const userRole = session?.user?.role;
                    const userEmail = session?.user?.email;
                    const canViewPrivate = userRole === 'admin' || userRole === 'hr' || userRole === 'coaching' || userRole === 'school';

                    return (
                        <div className="flex flex-col space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered.length > 0 ? (
                                    paginatedConsultants.map((consultant) => {
                                        const location = consultant.city ? `${consultant.city}, ${consultant.state}` : 'Location N/A';
                                        const logo = consultant.logo_url;
                                        const phone = consultant.phone;
                                        const description = consultant.description;
                                        const isOwner = userEmail && consultant.email && (userEmail === consultant.email);
                                        const canViewContact = canViewPrivate || isOwner;

                                        return (
                                            <div
                                                key={consultant._id}
                                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:border-amber-300 hover:shadow-lg transition-all duration-300 relative group flex flex-col h-full"
                                            >
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                        {logo ? (
                                                            <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
                                                        ) : (
                                                            <Briefcase className="w-6 h-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 pr-2">
                                                            {consultant.brand_name}
                                                        </h3>
                                                        <p className="text-xs font-medium text-gray-500 mt-1 flex items-center">
                                                            <MapPin className="w-3 h-3 mr-1 text-gray-400" /> {location}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                                    {description || 'Professional Recruitment Services'}
                                                </p>

                                                <div className="flex items-center justify-between bg-blue-50 p-2.5 rounded-lg border border-blue-100 mb-4">
                                                    <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Consultation Fee</span>
                                                    <span className="text-sm font-bold text-blue-900">{consultant.consultation_fee || 'Not specified'}</span>
                                                </div>

                                                <div className="pt-4 border-t border-gray-100 mt-auto space-y-3">
                                                    <div className="text-xs text-gray-500 flex items-center justify-between">
                                                        <span className="font-semibold text-gray-400 uppercase tracking-wide">Contact</span>
                                                        <ContactReveal phone={phone} />
                                                    </div>

                                                    <Link
                                                        href={`/consultants/${consultant._id}`}
                                                        className="block w-full text-center mt-3 bg-gray-900 text-white py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition shadow-sm active:scale-95"
                                                    >
                                                        View Profile
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">No consultants found</h3>
                                        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 text-amber-600 font-medium hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Pagination UI */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm sm:px-6">
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm space-x-2" aria-label="Pagination">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

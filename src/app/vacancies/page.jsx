'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Building2, Clock, Plus, X, Search, Filter } from 'lucide-react';
import { indianCities } from '@/lib/indianCities';

// Card Component
const VacancyCard = ({ job }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {job.companyName.charAt(0).toUpperCase()}
        </div>
        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
          {job.jobType}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{job.jobTitle}</h3>
      {job.subject && <p className="text-sm text-blue-600 font-medium mb-2">{job.subject}</p>}

      <div className="space-y-2 mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Building2 className="w-4 h-4 mr-2" />
          <span className="truncate">{job.companyName}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">
            {job.location}
            {job.city ? `, ${job.city}` : ''}
            {job.state ? `, ${job.state}` : ''}
          </span>
        </div>
        {job.salary && (
          <div className="flex items-center text-gray-700 font-medium">
            ₹ {job.salary}
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {job.description}
      </p>
    </div>

    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
      <Link href={`/vacancies/${job._id}`} className="block w-full">
        <button className="w-full py-2.5 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 transform active:scale-95">
          View Details
        </button>
      </Link>
    </div>
  </div>
);

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewCategory, setViewCategory] = useState('Teaching'); // 'Teaching' | 'Non-Teaching'

  const [form, setForm] = useState({
    jobTitle: '',
    vacancyCategory: 'Teaching',
    subject: '',
    companyName: '',
    location: '',
    city: '',
    state: '',
    jobType: 'Full Time',
    experience: 'Fresher',
    salary: 'Not Disclosed',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });

  const fetchVacancies = async () => {
    try {
      const res = await fetch('/api/vacancies');
      const data = await res.json();
      // Ensure data is array
      setVacancies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch vacancies', error);
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle State Change (Update City Options)
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setForm({ ...form, state: newState, city: '' });
  };

  // Handle Filter State Change
  const handleFilterStateChange = (e) => {
    const newState = e.target.value;
    setFilters({ ...filters, state: newState, city: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      alert('Vacancy submitted for approval');
      setForm({
        jobTitle: '',
        vacancyCategory: 'Teaching',
        subject: '',
        companyName: '',
        location: '',
        city: '',
        state: '',
        jobType: 'Full Time',
        experience: 'Fresher',
        salary: 'Not Disclosed',
        description: '',
        contactEmail: '',
        contactPhone: '',
      });
      setShowForm(false);
      fetchVacancies(); // Refresh list
    } catch (error) {
      alert('Failed to submit vacancy');
    }
  };

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    company: '',
    experience: '',
    salary: '',
    subject: ''
  });

  // Handle Filter Change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filter vacancies
  const filteredVacancies = vacancies.filter(job => {
    // Global Search
    const matchesSearch =
      searchTerm === '' ||
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.city && job.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.state && job.state.toLowerCase().includes(searchTerm.toLowerCase()));

    // Advanced Filters
    const matchesState = filters.state === '' || (job.state && job.state === filters.state);
    const matchesCity = filters.city === '' || (job.city && job.city.toLowerCase().includes(filters.city.toLowerCase()));
    const matchesCompany = filters.company === '' || job.companyName.toLowerCase().includes(filters.company.toLowerCase());
    const matchesSubject = filters.subject === '' || (job.subject && job.subject.toLowerCase().includes(filters.subject.toLowerCase()));
    const matchesExperience = filters.experience === '' || job.experience === filters.experience;
    const matchesSalary = filters.salary === '' || job.salary === filters.salary;

    // Category Filter
    const matchesCategory = job.vacancyCategory ? job.vacancyCategory === viewCategory : (viewCategory === 'Teaching'); // Default to Teaching if undefined

    return matchesCategory && matchesSearch && matchesState && matchesCity && matchesCompany && matchesSubject && matchesExperience && matchesSalary;
  });


  // Generate options
  const salaryOptions = ['Not Disclosed', ...Array.from({ length: 49 }, (_, i) => `${i + 1}-${i + 2} LPA`), '50+ LPA'];
  const experienceOptions = ['Fresher', ...Array.from({ length: 50 }, (_, i) => `${i + 1} Year${i + 1 > 1 ? 's' : ''}`)];
  const filterExperienceOptions = ['', 'Fresher', ...Array.from({ length: 50 }, (_, i) => `${i + 1} Year${i + 1 > 1 ? 's' : ''}`)];
  const filterSalaryOptions = ['', 'Not Disclosed', ...Array.from({ length: 49 }, (_, i) => `${i + 1}-${i + 2} LPA`), '50+ LPA'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Find Your Next {viewCategory} Role</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
          Browse hundreds of active job listings from top coaching institutes and schools across the country.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            className="w-full py-4 pl-12 pr-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Role Switcher Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            <button
              onClick={() => setViewCategory('Teaching')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${viewCategory === 'Teaching' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Teaching Roles
            </button>
            <button
              onClick={() => setViewCategory('Non-Teaching')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${viewCategory === 'Non-Teaching' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Non-Teaching Roles
            </button>
          </div>
        </div>

        {/* Advanced Search Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-semibold text-gray-800 mb-4">Filter By:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* State Filter */}
              <select name="state" value={filters.state} onChange={handleFilterStateChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">All States</option>
                {Object.keys(indianCities).map(state => <option key={state} value={state}>{state}</option>)}
              </select>

              {/* City Filter Dependent */}
              <select name="city" value={filters.city} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" disabled={!filters.state}>
                <option value="">All Cities</option>
                {filters.state && indianCities[filters.state]?.map(city => <option key={city} value={city}>{city}</option>)}
              </select>

              <input name="company" placeholder="Company" value={filters.company} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <input name="subject" placeholder="Subject/Domain" value={filters.subject} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />

              <select name="experience" value={filters.experience} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">Any Experience</option>
                {experienceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <select name="salary" value={filters.salary} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">Any Salary</option>
                {salaryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        )}
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Scanning {filteredVacancies.length} Opportunities
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Close Form' : 'Post a Job'}
          </button>
        </div>

        {/* ===== POST FORM (Collapsible) ===== */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Create New Vacancy</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Category Selection */}
              <div className="col-span-1 md:col-span-2 flex gap-6 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="vacancyCategory"
                    value="Teaching"
                    checked={form.vacancyCategory === 'Teaching'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-700">Teaching Role</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="vacancyCategory"
                    value="Non-Teaching"
                    checked={form.vacancyCategory === 'Non-Teaching'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-700">Non-Teaching Role</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Job Title</label>
                <input name="jobTitle" required onChange={handleChange} value={form.jobTitle} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Subject/Domain</label>
                <input name="subject" onChange={handleChange} value={form.subject} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input name="companyName" required onChange={handleChange} value={form.companyName} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">State</label>
                <select name="state" onChange={handleStateChange} value={form.state} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                  <option value="">Select State</option>
                  {Object.keys(indianCities).map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">City</label>
                <select name="city" required onChange={handleChange} value={form.city} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white" disabled={!form.state}>
                  <option value="">Select City</option>
                  {form.state && indianCities[form.state]?.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Location (Area/Landmark)</label>
                <input name="location" required onChange={handleChange} value={form.location} placeholder="e.g. Kankarbagh" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Job Type</label>
                <select name="jobType" onChange={handleChange} value={form.jobType} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Experience Required</label>
                <select name="experience" onChange={handleChange} value={form.experience} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                  {experienceOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Salary Range</label>
                <select name="salary" onChange={handleChange} value={form.salary} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                  {salaryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                <input name="contactEmail" required onChange={handleChange} value={form.contactEmail} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Contact Phone</label>
                <input name="contactPhone" onChange={handleChange} value={form.contactPhone} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  name="description"
                  required
                  onChange={handleChange}
                  value={form.description}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-1 md:col-span-2 pt-4">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transform transition hover:-translate-y-0.5">
                  Submit Vacancy 🚀
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===== LIST ===== */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredVacancies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVacancies.map((job) => (
              <VacancyCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500">No vacancies found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or post a new job.</p>
          </div>
        )}
      </div>
    </div>
  );
}
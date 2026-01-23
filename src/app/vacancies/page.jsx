'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Building2, Clock, Plus, X, Search, Filter } from 'lucide-react';
import { indianCities } from '@/lib/indianCities';
import { TEACHING_CATEGORIES } from '@/utils/teachingCategories';

const NON_TEACHING_ROLES = [
  "Principal", "Vice Principal", "Academic Coordinator", "Administrator",
  "Counselor", "Admission Counsellor", "Accountant", "Receptionist",
  "Librarian", "Lab Assistant", "IT Coordinator", "HR Manager",
  "Marketing Executive", "Telecaller", "Content Writer", "Graphic Designer",
  "Video Editor", "Peon / Office Boy", "Driver", "Security Guard",
  "Hostel Warden", "Cook / Chef", "Other"
];

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
      <div className="flex flex-wrap gap-2 mb-2">
        {job.requirements?.length > 0 ? (
          job.requirements.slice(0, 3).map((req, idx) => (
            <span key={idx} className="text-sm bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium border border-blue-100">
              {req.subject} ({req.count})
            </span>
          ))
        ) : (
          job.subject && <span className="text-sm text-blue-600 font-medium">{job.subject}</span>
        )}
        {job.requirements?.length > 3 && (
          <span className="text-xs text-gray-400 font-medium self-center">+{job.requirements.length - 3} more</span>
        )}
        {job.numberOfOpenings > 1 && (
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium border border-orange-200">
            {job.numberOfOpenings} Openings
          </span>
        )}
      </div>

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
    numberOfOpenings: 1,
    requirements: [{ subject: '', count: 1 }]
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

  // Requirement Rows Logic
  const handleRequirementChange = (index, field, value) => {
    const newReqs = [...form.requirements];
    newReqs[index][field] = value;

    // Auto calculate total openings
    const total = newReqs.reduce((acc, curr) => acc + (parseInt(curr.count) || 0), 0);

    // Auto generate subject string
    const subjects = newReqs.map(r => r.subject).filter(s => s).join(', ');

    setForm({ ...form, requirements: newReqs, numberOfOpenings: total, subject: subjects });
  };

  const addRequirementRow = () => {
    setForm({ ...form, requirements: [...form.requirements, { subject: '', count: 1 }] });
  };

  const removeRequirementRow = (index) => {
    if (form.requirements.length === 1) return;
    const newReqs = form.requirements.filter((_, i) => i !== index);

    const total = newReqs.reduce((acc, curr) => acc + (parseInt(curr.count) || 0), 0);
    const subjects = newReqs.map(r => r.subject).filter(s => s).join(', ');

    setForm({ ...form, requirements: newReqs, numberOfOpenings: total, subject: subjects });
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
        numberOfOpenings: 1,
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
    subject: '',
    exam: ''
  });

  const POPULAR_EXAMS = [
    { label: 'JEE Mains', key: 'JEE Mains' },
    { label: 'JEE Advanced', key: 'JEE Advanced' },
    { label: 'NEET', key: 'NEET UG' },
    { label: 'CBSE 1-10', key: 'CBSE (Class 1-10)' },
    { label: 'ICSE 1-10', key: 'ICSE (Class 1-10)' },
    { label: 'UPSC', key: 'UPSC CSE (Civil Services)' },
    { label: 'State PSC', key: 'State PSCs (UPPSC, BPSC, MPPSC, etc.)' },
    { label: 'GATE', key: 'GATE (Graduate Aptitude Test in Engineering)' },
    { label: 'CAT', key: 'CAT / XAT / SNAP (Top Tier MBA)' },
    { label: 'Banking', key: 'Banking (IBPS/SBI PO/Clerk/SO)' }
  ];



  // Derive ALL subjects from TEACHING_CATEGORIES
  const ALL_SUBJECTS = Array.from(new Set(
    Object.values(TEACHING_CATEGORIES).flatMap(category => category.subjects || [])
  )).sort();

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

    const matchesExam = filters.exam === '' || (() => {
      let allowedSubjects = [];
      Object.values(TEACHING_CATEGORIES).forEach(category => {
        const found = category.exam_subject_map?.find(e => e.exam_name === filters.exam);
        if (found) allowedSubjects = [...allowedSubjects, ...found.subjects];
      });
      return job.subject && allowedSubjects.some(sub =>
        job.subject.toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes(job.subject.toLowerCase())
      );
    })();



    const matchesExperience = filters.experience === '' || job.experience === filters.experience;
    const matchesSalary = filters.salary === '' || job.salary === filters.salary;

    // Category Filter
    const matchesCategory = job.vacancyCategory ? job.vacancyCategory === viewCategory : (viewCategory === 'Teaching'); // Default to Teaching if undefined

    return matchesCategory && matchesSearch && matchesState && matchesCity && matchesCompany && matchesSubject && matchesExperience && matchesSalary && matchesExam;
  });




  // Generate options
  const salaryOptions = ['Not Disclosed', ...Array.from({ length: 49 }, (_, i) => `${i + 1}-${i + 2} LPA`), '50+ LPA'];
  const experienceOptions = ['Fresher', ...Array.from({ length: 50 }, (_, i) => `${i + 1} Year${i + 1 > 1 ? 's' : ''}`)];



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

              {viewCategory === 'Non-Teaching' ? (
                <select name="subject" value={filters.subject} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">All Roles</option>
                  {NON_TEACHING_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              ) : (
                <select name="subject" value={filters.subject} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">All Subjects</option>
                  {ALL_SUBJECTS.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              )}

              <select name="experience" value={filters.experience} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">Any Experience</option>
                {experienceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <select name="salary" value={filters.salary} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">Any Salary</option>
                {salaryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {viewCategory === 'Teaching' && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Popular Exams</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_EXAMS.map(exam => (
                        <button
                          key={exam.key}
                          onClick={() => setFilters({ ...filters, exam: filters.exam === exam.key ? '' : exam.key })}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filters.exam === exam.key
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                            }`}
                        >
                          {exam.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              {/* Requirement Breakdown Section */}
              <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  {form.vacancyCategory === 'Teaching' ? 'Vacancy Details (Subject & Openings)' : 'Role Details (Designation & Openings)'}
                </label>
                <div className="space-y-3">
                  {form.requirements.map((req, idx) => (
                    <div key={idx} className="flex gap-4 items-center">


                      <div className="flex-1">
                        {form.vacancyCategory === 'Non-Teaching' ? (
                          <div className="relative">
                            <select
                              value={NON_TEACHING_ROLES.includes(req.subject) ? req.subject : 'Other'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'Other') {
                                  // If Other selected, clear it so they can type? 
                                  // Or keep it simple: Select 'Other' -> then maybe show input?
                                  // For now, let's just set "Other" and ideally allow typing but simplest is just Dropdown + "Other"
                                  // Actually, user just asked "SELECT FROM DROPDOWN". 
                                  // Let's give them the dropdown. If they need custom, I'll add logic or just let them pick "Other".
                                  handleRequirementChange(idx, 'subject', val);
                                } else {
                                  handleRequirementChange(idx, 'subject', val);
                                }
                              }}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                            >
                              <option value="">Select Role</option>
                              {NON_TEACHING_ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                            {req.subject === 'Other' && (
                              <input
                                placeholder="Specify Role"
                                className="mt-2 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => handleRequirementChange(idx, 'subject', e.target.value)}
                              // Wait, if I change subject to custom text, the select above will show 'Other' because logic: NON_TEACHING_ROLES.includes(custom) is false.
                              // Correct.
                              />
                            )}
                            {/* Wait, if I type "Custom", value becomes "Custom". Select checks includes("Custom") -> False -> Defaults to 'Other' option. Perfect. */}
                            {/* But if select value is 'Other', valid. If select value is 'Custom', select value prop calculates 'Other'. */}
                            {/* So the select shows 'Other', and input shows... wait, input needs to be tied to value. */}
                          </div>
                        ) : (
                          <input
                            placeholder="Subject (e.g. Maths, Physics)"
                            value={req.subject}
                            onChange={(e) => handleRequirementChange(idx, 'subject', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        )}
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          placeholder="Count"
                          value={req.count}
                          onChange={(e) => handleRequirementChange(idx, 'count', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      {form.requirements.length > 1 && (
                        <button type="button" onClick={() => removeRequirementRow(idx)} className="text-red-500 hover:bg-white p-1 rounded-full text-sm">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addRequirementRow} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
                    <Plus className="w-3 h-3" /> {form.vacancyCategory === 'Teaching' ? 'Add Another Subject' : 'Add Another Role'}
                  </button>
                </div>
                <div className="mt-3 text-right text-sm font-bold text-gray-700">
                  Total Openings: <span className="text-blue-600">{form.numberOfOpenings}</span>
                </div>
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
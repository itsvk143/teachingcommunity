'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TEACHING_CATEGORIES } from '@/utils/teachingCategories';
import MultiSelect from '@/components/ui/MultiSelect';

export default function PostJob() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: 'Full Time',
    experience: '',
    stream: [],
    exam: [],
    salaryMin: '',
    salaryMax: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    googleFormLink: '',
  });

  const STREAMS = Object.keys(TEACHING_CATEGORIES);

  // Derived EXAMS list based on selected Streams array
  const availableExams = form.stream && Array.isArray(form.stream)
    ? form.stream.flatMap(s => TEACHING_CATEGORIES[s]?.exams || [])
    : [];

  const salaryOptions = Array.from({ length: 200 }, (_, i) => `${i + 1} LPA`);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleStreamChange = (selectedStreams) => {
    setForm(prev => ({
      ...prev,
      stream: selectedStreams
    }));
  };

  const handleExamChange = (selectedExams) => {
    setForm(prev => ({ ...prev, exam: selectedExams }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to post job');

      alert('Job posted successfully!');
      router.push('/vacancies'); // Or redirect to a jobs list if one existed
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-center">Loading...</div>;
  }

  const allowedToPost = session?.user && ['coaching', 'school', 'consultant', 'admin', 'hr'].includes(session.user.role);

  if (!allowedToPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Unauthorized: Only Coaching Owners, School Owners, and Job Consultants can post vacancies.</p>
          <button onClick={() => router.back()} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Post a Job Vacancy</h1>
            <p className="text-blue-100 text-sm">Find the best teachers for your institute.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Job Title</label>
                <input
                  name="jobTitle"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Senior Physics Faculty"
                  value={form.jobTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1 relative" style={{ zIndex: 50 }}>
                <label className="text-sm font-medium text-gray-700">Stream / Category</label>
                <MultiSelect
                  options={STREAMS.map(s => ({ value: s, label: TEACHING_CATEGORIES[s].label }))}
                  selected={form.stream}
                  onChange={handleStreamChange}
                  placeholder="Select Stream(s)"
                />
              </div>

              <div className="space-y-1 relative" style={{ zIndex: 40 }}>
                <label className="text-sm font-medium text-gray-700">Exam</label>
                <MultiSelect
                  options={availableExams.map(e => ({ value: e, label: e }))}
                  selected={form.exam}
                  onChange={handleExamChange}
                  placeholder="Select Exam(s)"
                  disabled={form.stream.length === 0}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Institute / Company Name</label>
                <input
                  name="companyName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Alpha Classes"
                  value={form.companyName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Job Type</label>
                <select
                  name="jobType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={form.jobType}
                  onChange={handleChange}
                >
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input
                  name="location"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="City, State"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Experience Required</label>
                <input
                  name="experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 2-5 Years"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>


              <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="text-sm font-bold text-gray-700 mb-4 block">Salary Range</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Minimum Salary</label>
                    <select name="salaryMin" required onChange={handleChange} value={form.salaryMin} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Select Min Salary</option>
                      <option value="Not Disclosed">Not Disclosed</option>
                      <option value="No bar for deserving candidate">No bar for deserving candidate</option>
                      {salaryOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Maximum Salary</label>
                    <select name="salaryMax" required onChange={handleChange} value={form.salaryMax} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Select Max Salary</option>
                      <option value="Not Disclosed">Not Disclosed</option>
                      <option value="No bar for deserving candidate">No bar for deserving candidate</option>
                      {salaryOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Job Description</label>
              <textarea
                name="description"
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  name="contactEmail"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="hr@example.com"
                  value={form.contactEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                  name="contactPhone"
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Mobile Number"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Google Form Link */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Google Form Link (Optional)</label>
                <input
                  name="googleFormLink"
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://forms.google.com/..."
                  value={form.googleFormLink}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500">
                  If provided, applicants will see an option to apply via this form.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { indianCities } from '@/lib/indianCities';
import { MapPin, BookOpen, User, Phone, Save, X } from 'lucide-react';

const PostTuitionContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/hometuition/new');
    }
  }, [status, router]);

  const [form, setForm] = useState({
    name: '',
    contact: '',
    location: '',
    state: '',
    city: '',
    subject: '',
    classGrade: '',
    budget: '',
    description: '',
    mode: 'Offline',
    studentGender: 'Male',
    tuitionType: 'One-to-One',
    tutorGenderPreference: 'Flexible',
    role: 'Parent', // Default
  });

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setForm(prev => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    setForm({ ...form, state: e.target.value, city: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/hometuition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to post requirement');
      }
    } catch (error) {
      console.error("Error posting tuition:", error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Post Tuition Requirement</h1>
          <p className="text-gray-500 mt-2">Find the best tutors for your specific needs.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-100" /> Requirement Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* Role Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 block">I am posting as a:</label>
              <div className="flex gap-4 p-1 bg-gray-50 rounded-xl inline-flex border border-gray-200">
                {['Parent', 'Student'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${form.role === role
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-100'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Class / Grade <span className="text-red-500">*</span></label>
                <input
                  name="classGrade"
                  required
                  placeholder="e.g. Class 10"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                  value={form.classGrade}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Subject(s) <span className="text-red-500">*</span></label>
                <input
                  name="subject"
                  required
                  placeholder="e.g. Maths, Science"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">State</label>
                  <select
                    name="state"
                    onChange={handleStateChange}
                    value={form.state}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition cursor-pointer"
                  >
                    <option value="">Select State</option>
                    {Object.keys(indianCities).map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">City</label>
                  <select
                    name="city"
                    required
                    onChange={handleChange}
                    value={form.city}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition cursor-pointer disabled:opacity-50"
                    disabled={!form.state}
                  >
                    <option value="">Select City</option>
                    {form.state && indianCities[form.state]?.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Area / Landmark <span className="text-red-500">*</span></label>
                  <input
                    name="location"
                    required
                    placeholder="e.g. Near Central Park, Kankarbagh"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" /> Contact Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Contact Person Name <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    name="contact"
                    required
                    type="tel"
                    placeholder="10-digit Mobile Number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                    value={form.contact}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                PREFERENCES & Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Tuition Mode</label>
                  <select
                    name="mode"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition cursor-pointer"
                    value={form.mode}
                    onChange={handleChange}
                  >
                    <option value="Offline">Offline (Home Visit)</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Type</label>
                  <select
                    name="tuitionType"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition cursor-pointer"
                    value={form.tuitionType}
                    onChange={handleChange}
                  >
                    <option value="One-to-One">One-to-One</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Student Gender</label>
                  <select
                    name="studentGender"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition cursor-pointer"
                    value={form.studentGender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Both">Both (Male & Female)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Tutor Preference</label>
                  <select
                    name="tutorGenderPreference"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition cursor-pointer"
                    value={form.tutorGenderPreference}
                    onChange={handleChange}
                  >
                    <option value="Flexible">Any / Flexible</option>
                    <option value="Male">Male Tutor</option>
                    <option value="Female">Female Tutor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Approx. Budget (Optional)</label>
                <input
                  name="budget"
                  placeholder="e.g. ₹3000 - ₹5000 per month"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                  value={form.budget}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Additional Requirements / Notes</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Add any specific details here..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-6 flex gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-1/3 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? 'Posting...' : <><Save className="w-4 h-4" /> Post Requirement</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function PostTuitionNeed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <PostTuitionContent />
    </Suspense>
  );
}

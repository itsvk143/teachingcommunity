'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function StudentRegistration() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/students/register');
    }
  }, [status, router]);

  const [form, setForm] = useState({
    name: '',
    contact: '',
    address: '',
    country: 'India',
    classGrade: '',
    school: '',
    dob: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Student Profile</h2>
        <p className="text-gray-500 mb-8">Tell us about yourself!</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                name="name"
                required
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Contact Number</label>
              <input
                name="contact"
                required
                type="tel"
                placeholder="Mobile Number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={form.contact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              required
              rows={2}
              placeholder="Your Full Address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Class / Grade</label>
              <input
                name="classGrade"
                required
                placeholder="e.g. Class 10"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={form.classGrade}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">School Name</label>
              <input
                name="school"
                required
                placeholder="Your School Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={form.school}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
              <input
                name="dob"
                type="date"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Country <span className="text-red-500">*</span></label>
              <select
                name="country"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                value={form.country}
                onChange={handleChange}
              >
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 shadow transition"
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>

        </form>
      </div >
    </div >
  );
}

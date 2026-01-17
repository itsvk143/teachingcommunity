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
    classGrade: '',
    school: '',
    favoriteSubjects: '',
    about: '',
    about: '',
    friendsDetails: '',
    hobbies: '',
    parentsDetails: '',
    goals: '',
    visionFiveYears: '',
    visionTenYears: '',
    strength: '',
    weakness: '',
    otherDetails: '',
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
          <label className="text-sm font-medium text-gray-700">Location / City</label>
          <input
            name="location"
            placeholder="e.g. New Delhi"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.location}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Languages I am comfortable with</label>
        <input
          name="languages"
          placeholder="e.g. Hindi, English"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={form.languages}
          onChange={handleChange}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 block">Do you like your school/coaching?</label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="schoolSentiment"
                value="Yes"
                checked={form.schoolSentiment === 'Yes'}
                onChange={handleChange}
                className="w-4 h-4 text-teal-600"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="schoolSentiment"
                value="No"
                checked={form.schoolSentiment === 'No'}
                onChange={handleChange}
                className="w-4 h-4 text-teal-600"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            {form.schoolSentiment === 'Yes' ? 'What do you like about it?' : 'Why do you hate it?'}
          </label>
          <textarea
            name="schoolFeedback"
            rows={2}
            placeholder="Please share your thoughts..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.schoolFeedback}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Favorite Subjects</label>
        <input
          name="favoriteSubjects"
          placeholder="e.g. Maths, Science, History"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={form.favoriteSubjects}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">About Me</label>
        <textarea
          name="about"
          rows={3}
          placeholder="Tell us a bit about yourself..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={form.about}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Friends Details</label>
        <textarea
          name="friendsDetails"
          rows={2}
          placeholder="Write something about your friends..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={form.friendsDetails}
          onChange={handleChange}
        />
      </div>

      {/* New Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">My Hobbies</label>
          <input
            name="hobbies"
            placeholder="e.g. Cricket, Reading, Dancing"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.hobbies}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">My Parents Details</label>
          <input
            name="parentsDetails"
            placeholder="e.g. Father's Name, Occupation"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.parentsDetails}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">My Goals</label>
        <textarea
          name="goals"
          rows={2}
          placeholder="What do you want to achieve?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={form.goals}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Where I see myself after 5 years</label>
          <textarea
            name="visionFiveYears"
            rows={2}
            placeholder="Your vision for 5 years..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.visionFiveYears}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Where I see myself after 10 years</label>
          <textarea
            name="visionTenYears"
            rows={2}
            placeholder="Your vision for 10 years..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.visionTenYears}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">My Strengths</label>
          <input
            name="strength"
            placeholder="e.g. Hardworking, Honest"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.strength}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">My Weaknesses</label>
          <input
            name="weakness"
            placeholder="e.g. Public Speaking"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.weakness}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Other Details</label>
        <textarea
          name="otherDetails"
          rows={2}
          placeholder="Anything else you want to add..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={form.otherDetails}
          onChange={handleChange}
        />
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

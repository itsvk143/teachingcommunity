'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Briefcase, User, MapPin, Users, Save, X, Home } from 'lucide-react';
import { indianCities } from '@/lib/indianCities';

export default function ParentRegistration() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/parents/register');
    }
  }, [status, router]);

  const [form, setForm] = useState({
    name: '',
    contact: '',
    address: '',
    currentCity: '',
    currentState: '',
    nativeCity: '',
    nativeState: '',
    employmentType: 'Salaried',
    salariedDetails: 'Private',
    numberOfChildren: 1,
    children: [{ age: '', classGrade: '', school: '', gender: 'Male' }]
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurrentStateChange = (e) => {
    setForm({ ...form, currentState: e.target.value, currentCity: '' });
  };

  const handleNativeStateChange = (e) => {
    setForm({ ...form, nativeState: e.target.value, nativeCity: '' });
  };

  const handleChildCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    const currentChildren = [...form.children];

    if (count > currentChildren.length) {
      const added = Array(count - currentChildren.length).fill({ age: '', classGrade: '', school: '', gender: 'Male' });
      setForm({ ...form, numberOfChildren: count, children: [...currentChildren, ...added] });
    } else {
      setForm({ ...form, numberOfChildren: count, children: currentChildren.slice(0, count) });
    }
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = form.children.map((child, i) => {
      if (i === index) {
        return { ...child, [field]: value };
      }
      return child;
    });
    setForm({ ...form, children: updatedChildren });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/parents', {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12 font-sans">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Create Parent Profile</h2>
          <p className="text-orange-100 opacity-90">Please fill in your details to help us find the right tutors for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* SECTION 1: Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <User className="w-5 h-5 text-orange-500" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Contact Number</label>
                <input
                  name="contact"
                  required
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="e.g. 9876543210 (10 digits)"
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  value={form.contact}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                    if (val.length <= 10) setForm({ ...form, contact: val });
                  }}
                  title="Ten digit mobile number without 0 or +91"
                />
              </div>
            </div>
          </div>

          {/* SECTION 1.5: Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <MapPin className="w-5 h-5 text-orange-500" /> Location Details
            </h3>

            {/* Current Address */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Current Residence</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">State</label>
                  <select
                    name="currentState"
                    value={form.currentState}
                    onChange={handleCurrentStateChange}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
                  >
                    <option value="">Select State</option>
                    {Object.keys(indianCities).map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">City</label>
                  <select
                    name="currentCity"
                    value={form.currentCity}
                    onChange={handleChange}
                    disabled={!form.currentState}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition bg-white disabled:bg-gray-100"
                  >
                    <option value="">Select City</option>
                    {form.currentState && indianCities[form.currentState]?.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Full Address</label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="House No, Building, Street, Area"
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Native Address */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Home className="w-4 h-4" /> Native / Permanent Residence
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Native State</label>
                  <select
                    name="nativeState"
                    value={form.nativeState}
                    onChange={handleNativeStateChange}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
                  >
                    <option value="">Select State</option>
                    {Object.keys(indianCities).map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Native City</label>
                  <select
                    name="nativeCity"
                    value={form.nativeCity}
                    onChange={handleChange}
                    disabled={!form.nativeState}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition bg-white disabled:bg-gray-100"
                  >
                    <option value="">Select City</option>
                    {form.nativeState && indianCities[form.nativeState]?.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Employment */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <Briefcase className="w-5 h-5 text-orange-500" /> Employment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Occupation Type</label>
                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
                >
                  <option value="Salaried">Salaried</option>
                  <option value="Self Employed">Self Employed / Business</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Student">Student (Parent)</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {form.employmentType === 'Salaried' && (
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Sector</label>
                  <select
                    name="salariedDetails"
                    value={form.salariedDetails}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
                  >
                    <option value="Private">Private Sector</option>
                    <option value="Government">Government / Public Sector</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Children Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" /> Children Details
              </h3>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">No. of Children:</label>
                <select
                  name="numberOfChildren"
                  value={form.numberOfChildren}
                  onChange={handleChildCountChange}
                  className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white font-semibold"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {form.children.map((child, index) => (
                <div key={index} className="bg-orange-50/50 p-5 rounded-xl border border-orange-100 relative">
                  <span className="absolute top-0 right-0 bg-orange-200 text-orange-800 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                    Child {index + 1}
                  </span>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Age</label>
                      <input
                        type="number"
                        required
                        placeholder="Yrs"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 outline-none bg-white"
                        value={child.age}
                        onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Gender</label>
                      <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 outline-none bg-white"
                        value={child.gender}
                        onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                      >
                        <option value="Male">Boy</option>
                        <option value="Female">Girl</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5th"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 outline-none bg-white"
                        value={child.classGrade}
                        onChange={(e) => handleChildChange(index, 'classGrade', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">School</label>
                      <input
                        type="text"
                        required
                        placeholder="School Name"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 outline-none bg-white"
                        value={child.school}
                        onChange={(e) => handleChildChange(index, 'school', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-1/3 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg transform active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              {loading ? 'Creating...' : <><Save className="w-5 h-5" /> Create Profile</>}
            </button>
          </div>

        </form>
      </div >
    </div >
  );
}

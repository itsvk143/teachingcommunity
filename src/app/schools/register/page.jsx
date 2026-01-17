'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle, AlertCircle, ArrowRight, ArrowLeft,
  Building2, GraduationCap, MapPin, Phone, Mail, Globe,
  Users, BookOpen, Trophy, School
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { indianCities } from '@/lib/indianCities';

const BOARD_OPTIONS = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Cambridge"];
const MEDIUM_OPTIONS = ["English", "Hindi", "Regional"];
const SCHOOL_TYPES = ["Co-ed", "Boys", "Girls"];
const STREAM_OPTIONS = ["Science (PCM)", "Science (PCB)", "Commerce", "Arts/Humanities", "Vocational"];

const FormField = ({ label, name, type = "text", value, onChange, required = false, placeholder = "", options = null, rows = null, maxLength = null, className = "", icon: Icon, disabled = false }) => {
  const baseInputClasses = "w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <div className={`relative group ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {options ? (
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`${baseInputClasses} ${!Icon ? 'pl-3' : ''} appearance-none cursor-pointer`}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((opt) => (
              <option key={opt.value || opt} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        ) : rows ? (
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            rows={rows}
            disabled={disabled}
            className={`${baseInputClasses} ${!Icon ? 'pl-3' : ''}`}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            maxLength={maxLength}
            disabled={disabled}
            className={`${baseInputClasses} ${!Icon ? 'pl-3' : ''}`}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default function RegisterSchool() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/schools/register');
    }
  }, [status, router]);

  const [form, setForm] = useState({
    name: '', principal_name: '', email: '', phone_primary: '', phone_secondary: '',
    website_url: '', founded_year: '',
    address_line1: '', address_line2: '', city: '', state: '', pincode: '', google_maps_url: '',
    board: [], medium: [], school_type: 'Co-ed', class_range: '', streams_offered: [],
    student_count: '', teacher_count: '', student_teacher_ratio: '',
    fee_range_min: '', fee_range_max: '', admission_process: '',

    // Facilities (Booleans)
    smart_classes: false, library: false, labs: false, sports_ground: false,
    swimming_pool: false, auditorium: false, transport_available: false,
    cctv: false, hostel_support: false, cafeteria: false, ac_classrooms: false,

    description_short: '', description_long: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone_primary' || name === 'phone_secondary') {
      const val = value.replace(/\D/g, '');
      if (val.length <= 10) {
        setForm(prev => ({ ...prev, [name]: val }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleMultiSelect = (field, value) => {
    setForm(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      founded_year: Number(form.founded_year) || undefined,
      student_count: Number(form.student_count) || undefined,
      teacher_count: Number(form.teacher_count) || undefined,
      fee_range_min: Number(form.fee_range_min) || undefined,
      fee_range_max: Number(form.fee_range_max) || undefined,
    };

    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register school');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Basic Info", icon: Building2 },
    { title: "Academics", icon: GraduationCap },
    { title: "Infrastructure", icon: Trophy }
  ];

  const totalSteps = steps.length;
  const progress = (step / totalSteps) * 100;

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Register Your School</h1>
          <p className="mt-2 text-gray-500">Create a comprehensive profile to attract parents and students</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col items-center ${step > i ? 'text-blue-600' : step === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step > i + 1 ? 'bg-blue-600 border-blue-600 text-white' :
                    step === i + 1 ? 'bg-white border-blue-600 text-blue-600' :
                      'bg-white border-gray-300 text-gray-400'
                  }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold mt-2">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 mb-0 rounded-r text-red-700 text-sm flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">

            {/* STEP 1: BASIC INFO & LOCATION */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" /> Identity & Location
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField label="School Name" name="name" value={form.name} onChange={handleChange} required icon={School} placeholder="e.g. St. Xaviers High School" />
                  </div>
                  <FormField label="Principal Name" name="principal_name" value={form.principal_name} onChange={handleChange} icon={Users} />
                  <FormField label="Founded Year" name="founded_year" type="number" value={form.founded_year} onChange={handleChange} icon={CheckCircle} placeholder="YYYY" />

                  <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required icon={Mail} />
                  <FormField label="Primary Phone" name="phone_primary" type="tel" value={form.phone_primary} onChange={handleChange} required icon={Phone} maxLength={10} />

                  <div className="md:col-span-2">
                    <FormField label="Website URL" name="website_url" type="url" value={form.website_url} onChange={handleChange} icon={Globe} placeholder="https://" />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Address Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <FormField label="Address Line 1" name="address_line1" value={form.address_line1} onChange={handleChange} icon={MapPin} />
                    </div>

                    <FormField
                      label="State"
                      name="state"
                      value={form.state}
                      onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value, city: '' }))}
                      required
                      icon={MapPin}
                      options={Object.keys(indianCities)}
                      placeholder="Select State"
                    />

                    <FormField
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      disabled={!form.state}
                      icon={MapPin}
                      options={form.state ? indianCities[form.state] : []}
                      placeholder="Select City"
                    />

                    <FormField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} icon={MapPin} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ACADEMIC INFO */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" /> Academic Profile
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">School Type</label>
                    <div className="flex flex-wrap gap-4">
                      {SCHOOL_TYPES.map(type => (
                        <label key={type} className={`flex items-center space-x-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${form.school_type === type ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50 border-gray-200'
                          }`}>
                          <input type="radio" name="school_type" value={type} checked={form.school_type === type} onChange={handleChange} className="text-blue-600 focus:ring-blue-500" />
                          <span className="font-medium">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Boards Affiliated</label>
                      <div className="flex flex-wrap gap-3">
                        {BOARD_OPTIONS.map(opt => (
                          <label key={opt} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${form.board.includes(opt) ? 'bg-green-50 border-green-500 text-green-700' : 'hover:bg-gray-50 border-gray-200'
                            }`}>
                            <input type="checkbox" checked={form.board.includes(opt)} onChange={() => handleMultiSelect('board', opt)} className="rounded text-green-600 focus:ring-green-500" />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Medium</label>
                      <div className="flex flex-wrap gap-3">
                        {MEDIUM_OPTIONS.map(opt => (
                          <label key={opt} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${form.medium.includes(opt) ? 'bg-purple-50 border-purple-500 text-purple-700' : 'hover:bg-gray-50 border-gray-200'
                            }`}>
                            <input type="checkbox" checked={form.medium.includes(opt)} onChange={() => handleMultiSelect('medium', opt)} className="rounded text-purple-600 focus:ring-purple-500" />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Class Range" name="class_range" value={form.class_range} onChange={handleChange} placeholder="e.g. Nursery to 12th" icon={BookOpen} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Streams Offered (11th & 12th)</label>
                    <div className="flex flex-wrap gap-3">
                      {STREAM_OPTIONS.map(opt => (
                        <label key={opt} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${form.streams_offered.includes(opt) ? 'bg-orange-50 border-orange-500 text-orange-700' : 'hover:bg-gray-50 border-gray-200'
                          }`}>
                          <input type="checkbox" checked={form.streams_offered.includes(opt)} onChange={() => handleMultiSelect('streams_offered', opt)} className="rounded text-orange-600 focus:ring-orange-500" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Admissions & Fees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Min Annual Fee (₹)" name="fee_range_min" type="number" value={form.fee_range_min} onChange={handleChange} icon={CheckCircle} />
                      <FormField label="Max Annual Fee (₹)" name="fee_range_max" type="number" value={form.fee_range_max} onChange={handleChange} icon={CheckCircle} />
                      <div className="md:col-span-2">
                        <FormField label="Admission Process" name="admission_process" value={form.admission_process} onChange={handleChange} rows={3} placeholder="Describe eligibility, entrance tests..." />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: INFRASTRUCTURE & STATS */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-500" /> Infrastructure & Stats
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Total Students" name="student_count" type="number" value={form.student_count} onChange={handleChange} icon={Users} />
                  <FormField label="Total Teachers" name="teacher_count" type="number" value={form.teacher_count} onChange={handleChange} icon={Users} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Key Facilities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[
                      { key: 'smart_classes', label: 'Smart Classes' },
                      { key: 'library', label: 'Library' },
                      { key: 'labs', label: 'Science Labs' },
                      { key: 'sports_ground', label: 'Sports Ground' },
                      { key: 'swimming_pool', label: 'Swimming Pool' },
                      { key: 'auditorium', label: 'Auditorium' },
                      { key: 'transport_available', label: 'Transport' },
                      { key: 'cctv', label: 'CCTV' },
                      { key: 'hostel_support', label: 'Hostel' },
                      { key: 'cafeteria', label: 'Cafeteria' },
                      { key: 'ac_classrooms', label: 'AC Rooms' }
                    ].map(({ key, label }) => (
                      <label key={key} className={`flex items-center space-x-3 p-3 border rounded-xl cursor-pointer transition-all ${form[key] ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${form[key] ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                          }`}>
                          {form[key] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} className="hidden" />
                        <span className={`text-sm font-medium ${form[key] ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <FormField label="About School (Long Description)" name="description_long" value={form.description_long} onChange={handleChange} rows={5} placeholder="Tell us about your school's history, vision, and achievements..." />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Register School'}
                  {!loading && <CheckCircle className="w-5 h-5 ml-2" />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

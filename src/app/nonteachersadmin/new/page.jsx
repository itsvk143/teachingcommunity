'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  User, Briefcase, GraduationCap, FileText,
  ChevronRight, ChevronLeft, CheckCircle,
  MapPin, Calendar, Globe, Award, List
} from 'lucide-react';

// Constants
const STATE_OPTIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];
const DOB_VISIBILITY_OPTIONS = [
  { label: 'Visible to Everyone', value: 'everyone' },
  { label: 'Show to HR, Coaching & School Owners', value: 'hr_only' },
  { label: 'Mask Year of Birth (dd/mm/XXXX)', value: 'mask_year' }
];
const JOB_ROLE_OPTIONS = [
  'MANAGEMENT',
  'OPERATION',
  'SALES & MARKETING',
  'HR',
  'ACCOUNTANT',
  'LEGAL SUPPORT',
  'OTHER'
];

const CONTACT_VISIBILITY_OPTIONS = [
  { label: 'Visible to Everyone', value: 'everyone' },
  { label: 'Show to HR, Coaching & School Owners', value: 'hr_only' }
];

const DESIGNATION_OPTIONS = ['LECTURER', 'HOD', 'BRANCH HEAD', 'CITY HEAD', 'STATE HEAD', 'CLUSTER HEAD'];

const AVATAR_OPTIONS = [
  '/logo.png',
  '/avatars/avatar_1.svg',
  '/avatars/avatar_2.svg',
  '/avatars/avatar_3.svg',
  '/avatars/avatar_4.svg',
];

// Helper Components
const FormField = ({ label, name, type = "text", value, onChange, required = false, placeholder = "", options = null, rows = null, maxLength = null, className = "", icon: Icon }) => {
  const baseInputClasses = "w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400";

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
            className={`${baseInputClasses} ${!Icon ? 'pl-3' : ''}`}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default function NewNonTeacher() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', contactVisibility: 'everyone', city: '', state: '', dob: '', dobVisibility: 'everyone', gender: '', designation: 'LECTURER',
    maritalStatus: '', nationality: 'Indian', religion: '', photoUrl: '/logo.png',

    // Arrays & CSVs
    jobRole: '', otherJobRole: '', languages: '',
    experience: '', ctc: '', careerObjective: '', currentlyWorkingIn: '',
    currentInstitute: '', currentEmployeeCode: '', // New fields

    educationalQualification: [],
    workExperience: [],

    technicalSkills: '', keySkills: '', certifications: '',
    resumeLink: '',
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' }
  });

  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || ''
      }));
    }
  }, [session]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const val = value.replace(/\D/g, '');
      if (val.length <= 10) setForm(prev => ({ ...prev, [name]: val }));
    } else if (name.includes('.')) {
      const [parent, key] = name.split('.');
      setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const addEducation = () => {
    setForm(prev => ({
      ...prev,
      educationalQualification: [...prev.educationalQualification, { qualification: '', boardUniv: '', year: '', percentage: '' }]
    }));
  };

  const removeEducation = (index) => {
    setForm(prev => ({
      ...prev,
      educationalQualification: prev.educationalQualification.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...form.educationalQualification];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, educationalQualification: updated }));
  };

  const addExperience = () => {
    setForm(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { organization: '', designation: '', duration: '', responsibilities: '', employeeCode: '' }]
    }));
  };

  const removeExperience = (index) => {
    setForm(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...form.workExperience];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, workExperience: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validations
    if (form.phone?.length !== 10) {
      setError('Mobile number must be exactly 10 digits.');
      setIsSubmitting(false);
      return;
    }

    const finalJobRole = form.jobRole === 'OTHER' ? form.otherJobRole : form.jobRole;

    const payload = {
      ...form,
      jobRole: [finalJobRole].filter(Boolean), // Send as array of 1
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      technicalSkills: form.technicalSkills.split(',').map(s => s.trim()).filter(Boolean),
      keySkills: form.keySkills.split(',').map(s => s.trim()).filter(Boolean),
      certifications: form.certifications.split(',').map(s => s.trim()).filter(Boolean),
      isVerified: true
    };

    try {
      const res = await fetch('/api/non-teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Creation failed');

      const redirectPath = session?.user?.role === 'admin' ? '/nonteachersadmin' : '/dashboard';
      router.push(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Refactored for Simplified 'New' Flow - Only Mandatory Fields */
  const steps = [
    { title: "Personal Details", icon: User },
    { title: "Job Profile", icon: Briefcase }
  ];

  const totalSteps = steps.length;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Non-Teaching Profile</h1>
          <p className="mt-2 text-gray-500">Join our administrative and support staff community</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col items-center ${step > i ? 'text-blue-600' : step === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step > i + 1 ? 'bg-blue-600 border-blue-600 text-white' :
                  step === i + 1 ? 'bg-white border-blue-600 text-blue-600' :
                    'bg-white border-gray-300 text-gray-400'
                  }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold mt-2 hidden sm:block">{s.title}</span>
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
              <span className="font-bold mr-2">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} required icon={User} placeholder="e.g. John Doe" />
                  <FormField label="Mobile Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required maxLength={10} icon={User} placeholder="10-digit mobile" />
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required icon={User} placeholder="john@example.com" />
                  <FormField label="Contact Visibility" name="contactVisibility" value={form.contactVisibility} onChange={handleChange} required options={CONTACT_VISIBILITY_OPTIONS} icon={User} />

                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700 ml-1">
                        Profile Photo <span className="text-red-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCustomUrl(!showCustomUrl)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        {showCustomUrl ? 'Choose from Default Avatars' : 'Use Custom URL'}
                      </button>
                    </div>

                    {showCustomUrl ? (
                      <FormField
                        label="Photo URL"
                        name="photoUrl"
                        value={form.photoUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                        icon={User}
                      />
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {AVATAR_OPTIONS.map((avatar, idx) => (
                          <div
                            key={idx}
                            onClick={() => setForm(prev => ({ ...prev, photoUrl: avatar }))}
                            className={`relative cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition-all ${form.photoUrl === avatar
                              ? 'border-blue-600 ring-4 ring-blue-100 scale-105'
                              : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                              }`}
                          >
                            <img
                              src={avatar}
                              alt={`Avatar ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {form.photoUrl === avatar && (
                              <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                                <CheckCircle className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Job Profile & Resume */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Job Profile</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Job Role" name="jobRole" value={form.jobRole} onChange={handleChange} required options={JOB_ROLE_OPTIONS} icon={Briefcase} />
                    {form.jobRole === 'OTHER' && (
                      <FormField label="Specific Job Role" name="otherJobRole" value={form.otherJobRole} onChange={handleChange} required placeholder="e.g. Accountant" />
                    )}
                  </div>



                  <div className="md:col-span-2">
                    <FormField label="Designation" name="designation" value={form.designation} onChange={handleChange} required options={DESIGNATION_OPTIONS} icon={Briefcase} />
                  </div>

                  {/* Moved Resume Link Here - Optional */}
                  <div className="md:col-span-2">
                    <FormField
                      label="Resume Link (Optional)"
                      name="resumeLink"
                      value={form.resumeLink}
                      onChange={handleChange}
                      icon={FileText}
                      placeholder="Google Drive Link etc."
                    />
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 mt-6 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                  <p>Aditional details (Experience, Education, Skills, Address, etc.) can be added from the <strong>Edit Profile</strong> page after registration.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
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
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Profile'}
                  {!isSubmitting && <CheckCircle className="w-5 h-5 ml-2" />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div >
    </div >
  );
}

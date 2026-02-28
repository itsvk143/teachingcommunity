'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  User, BookOpen, Briefcase, FileText,
  ChevronRight, ChevronLeft, CheckCircle,
  Upload, Calendar, MapPin, IndianRupee, School, Layers
} from 'lucide-react';
import { TEACHING_CATEGORIES, ALL_EXAMS } from '@/utils/teachingCategories';
import { STATE_OPTIONS, CITIES_BY_STATE } from '@/utils/indianCities';
import { EDUCATION_CONFIG } from '@/utils/educationConfig';

// Constants
const COLLEGE_OPTIONS = ['IIT', 'NIT', 'Other', 'NA'];
const GENDER = ['FEMALE', 'MALE', 'Other'];
const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];
const UNDERGRADUATE_DEGREES = ['B.Tech', 'BSc', 'MBBS', 'Other'];
const POSTGRADUATE_DEGREES = ['M.Tech', 'MSc', 'Masters', 'Other', 'NA'];
const WORK_PLACE_OPTIONS = ['School', 'Coaching', 'SIP', 'Online Coaching', 'Offline Coaching', 'Other'];
const DESIGNATION_OPTIONS = ['LECTURER', 'HOD', 'BRANCH HEAD', 'CITY HEAD', 'STATE HEAD', 'CLUSTER HEAD'];
// STATE_OPTIONS removed from here as it is imported
const PREFERED_STATE_OPTIONS = [
  'PAN India', ...STATE_OPTIONS
];
const DOB_VISIBILITY_OPTIONS = [
  { label: 'Visible to Everyone', value: 'everyone' },
  { label: 'Show to HR, Coaching & School Owners', value: 'hr_only' },
  { label: 'Mask Year of Birth (dd/mm/XXXX)', value: 'mask_year' }
];

const CONTACT_VISIBILITY_OPTIONS = [
  { label: 'Visible to Everyone', value: 'everyone' },
  { label: 'Show to HR, Coaching & School Owners', value: 'hr_only' }
];

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

const MultiSelect = ({ label, options, selected, onChange, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue) => {
    const newSelected = selected.includes(optionValue)
      ? selected.filter(item => item !== optionValue)
      : [...selected, optionValue];
    onChange(newSelected);
  };

  // Helper to get label
  const getLabel = (val) => {
    // If options are objects {label, value}
    if (options.length > 0 && typeof options[0] === 'object') {
      const found = options.find(o => o.value === val);
      return found ? found.label : val;
    }
    return val;
  };

  return (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div
          className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500/20 min-h-[44px] flex flex-wrap gap-2 items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selected.map(item => (
              <span key={item} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100 flex items-center gap-1">
                {getLabel(item)}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleOption(item); }}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map(option => {
              const value = typeof option === 'object' ? option.value : option;
              const label = typeof option === 'object' ? option.label : option;
              return (
                <div
                  key={value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between ${selected.includes(value) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  onClick={() => toggleOption(value)}
                >
                  {label}
                  {selected.includes(value) && <CheckCircle className="w-4 h-4" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default function NewTeacher() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', whatsapp: '', contactVisibility: 'everyone', gender: '', maritalStatus: '', designation: 'LECTURER', dob: '', dobVisibility: 'everyone', age: '', photoUrl: '/logo.png',
    maxQualification: '', maxQualificationCollege: '', maxQualificationCollegeSpecific: '', graduationQualification: '', graduationCollege: '', education: '',
    class10: { boardUniv: '', year: '', percentage: '', medium: '', schoolName: '' },
    class12: { boardUniv: '', year: '', percentage: '', medium: '', schoolName: '' },
    qualifications: {
      ug: { degree: '', specialization: '', college: '', year: '' },
      pg: { degree: '', specialization: '', college: '', year: '' },
      doctorate: { degree: '', specialization: '', college: '', year: '' },
      professional: [], // Array of objects
    },

    categories: [], subject: [], experience: '', currentlyWorkingIn: '', otherWorkPlace: '', currentInstitute: '', previousInstitutes: '',
    currentEmployeeCode: '', previousEmployeeCodes: '', // Optional
    ctc: '', preferedState: '', state: '', nativeState: '', city: '', exams: [],
    examAchievements: [],
    resumeLink: '', teachingVideoLink: '', about: 'I am a dedicated, student-centered educator focused on creating an engaging, inclusive, and fun classroom environment. As a patient mentor, I blend passion with modern, creative, and active learning strategies to help students reach their full potential.',
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' }
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || ''
      }));
    }
  }, [session]);

  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age.toString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      const age = calculateAge(value);
      setFormData(prev => ({ ...prev, dob: value, age }));
    } else if (name === 'phone' || name === 'whatsapp') {
      const val = value.replace(/\D/g, '');
      if (val.length <= 10) setFormData(prev => ({ ...prev, [name]: val }));
    } else if (name.includes('.')) {
      const [parent, key] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }));
    } else if (name === 'categories') {
      // When categories change, we might want to keep subjects/exams IF they still exist in the new available list, or just clear them to be safe.
      // For UX, clearing ensures no "stale" data from a removed category.
      setFormData(prev => ({ ...prev, categories: value, subject: [], exams: [] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQualificationChange = (level, field, value) => {
    setFormData(prev => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        [level]: { ...prev.qualifications[level], [field]: value }
      }
    }));
  };

  const addProfessionalQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        professional: [...prev.qualifications.professional, { degree: '', specialization: '', college: '', year: '' }]
      }
    }));
  };

  const removeProfessionalQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        professional: prev.qualifications.professional.filter((_, i) => i !== index)
      }
    }));
  };

  const handleProfessionalChange = (index, field, value) => {
    const updated = [...formData.qualifications.professional];
    updated[index][field] = value;
    setFormData(prev => ({
      ...prev,
      qualifications: { ...prev.qualifications, professional: updated }
    }));
  };



  const handleExamAchievementChange = (index, field, value) => {
    const updated = [...formData.examAchievements];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, examAchievements: updated }));
  };

  const addExamAchievement = () => {
    setFormData(prev => ({
      ...prev,
      examAchievements: [...prev.examAchievements, { exam: '', year: '', result: '' }]
    }));
  };

  const removeExamAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      examAchievements: prev.examAchievements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Final Validations
    if (formData.phone?.length !== 10 || formData.whatsapp?.length !== 10) {
      setError('Mobile numbers must be exactly 10 digits.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      categories: formData.category ? [formData.category] : [], // Map single category to array
      exams: formData.exams, // Already an array
      currentlyWorkingIn: formData.currentlyWorkingIn === 'Other' ? formData.otherWorkPlace : formData.currentlyWorkingIn,
      educationalQualification: [
        ...(formData.class10.year ? [{ ...formData.class10, qualification: 'Class 10' }] : []),
        ...(formData.class12.year ? [{ ...formData.class12, qualification: 'Class 12' }] : [])
      ]
    };
    delete payload.otherWorkPlace;
    delete payload.class10;
    delete payload.class12;

    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Creation failed');

      const redirectPath = session?.user?.role === 'admin' ? '/teachersadmin' : '/dashboard';
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
    { title: "Education", icon: BookOpen },
    { title: "Professional", icon: Briefcase }
  ];

  const totalSteps = steps.length;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans" >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Teacher Profile</h1>
          <p className="mt-2 text-gray-500">Share your expertise and join our educator community</p>
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
              <span className="font-bold mr-2">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} required icon={User} placeholder="e.g. John Doe" />
                  <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required icon={User} placeholder="john@example.com" />
                  <FormField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required maxLength={10} icon={User} placeholder="10-digit mobile" />
                  <FormField label="WhatsApp" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} required maxLength={10} icon={User} placeholder="10-digit WhatsApp" />
                  <FormField label="Contact Visibility" name="contactVisibility" value={formData.contactVisibility} onChange={handleChange} required options={CONTACT_VISIBILITY_OPTIONS} icon={User} />
                  <FormField label="Gender" name="gender" value={formData.gender} onChange={handleChange} required options={GENDER} icon={User} />
                  <FormField label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required options={MARITAL_STATUS_OPTIONS} icon={User} />
                  <FormField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required icon={Calendar} />
                  <FormField label="DOB Visibility" name="dobVisibility" value={formData.dobVisibility} onChange={handleChange} required options={DOB_VISIBILITY_OPTIONS} icon={Calendar} />
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
                        value={formData.photoUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                        icon={Upload}
                      />
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {AVATAR_OPTIONS.map((avatar, idx) => (
                          <div
                            key={idx}
                            onClick={() => setFormData(prev => ({ ...prev, photoUrl: avatar }))}
                            className={`relative cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition-all ${formData.photoUrl === avatar
                              ? 'border-blue-600 ring-4 ring-blue-100 scale-105'
                              : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                              }`}
                          >
                            <img
                              src={avatar}
                              alt={`Avatar ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {formData.photoUrl === avatar && (
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

            {/* Step 2: Education (Restricted to UG) */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* UG (Compulsory) */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">UG</span>
                    Graduation (Compulsory)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree *</label>
                      <select
                        value={formData.qualifications.ug.degree}
                        onChange={(e) => handleQualificationChange('ug', 'degree', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                      >
                        <option value="">Select Degree</option>
                        {EDUCATION_CONFIG.UG.degrees.map(d => <option key={d.degree} value={d.degree}>{d.label}</option>)}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                      {(() => {
                        const selectedDegree = EDUCATION_CONFIG.UG.degrees.find(d => d.degree === formData.qualifications.ug.degree);
                        if (selectedDegree && selectedDegree.specializations && selectedDegree.specializations.length > 0) {
                          return (
                            <select
                              value={formData.qualifications.ug.specialization}
                              onChange={(e) => handleQualificationChange('ug', 'specialization', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                            >
                              <option value="">Select Specialization</option>
                              {selectedDegree.specializations.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          );
                        } else {
                          return <input
                            type="text"
                            value={formData.qualifications.ug.specialization}
                            onChange={(e) => handleQualificationChange('ug', 'specialization', e.target.value)}
                            placeholder="Specialization (Optional)"
                            className="w-full p-2.5 border border-gray-200 rounded-lg outline-none"
                          />;
                        }
                      })()}
                    </div>

                    <FormField label="College / University" name="ug_college" value={formData.qualifications.ug.college} onChange={(e) => handleQualificationChange('ug', 'college', e.target.value)} placeholder="University Name" icon={School} />
                    <FormField label="Year of Passing" name="ug_year" value={formData.qualifications.ug.year} onChange={(e) => handleQualificationChange('ug', 'year', e.target.value)} placeholder="YYYY" />
                  </div>
                </div>

                {/* PG, Doctorate, Professional, Schooling hidden for "New" flow */}
                <div className="text-center text-sm text-gray-500 mt-4 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                  <p>Additional qualifications (PG, PhD, Professional, Schooling) can be added from the <strong>Edit Profile</strong> page after registration.</p>
                </div>
              </div>
            )}

            {/* Step 3: Professional (Simplified) */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Professional Details</h2>

                {/* Category Selection */}
                <div className="mb-6">
                  <FormField
                    label="Teaching Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    options={Object.entries(TEACHING_CATEGORIES).map(([key, val]) => ({ label: val.label, value: key }))}
                    icon={Layers}
                  />

                  <FormField
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    options={DESIGNATION_OPTIONS}
                    icon={Briefcase}
                  />

                  {formData.category && (
                    <p className="text-sm text-gray-500 mt-2 ml-1">
                      {TEACHING_CATEGORIES[formData.category]?.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dynamic Subjects & Exams */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(() => {
                      const currentCat = formData.category ? TEACHING_CATEGORIES[formData.category] : null;
                      const hasMap = currentCat?.exam_subject_map;

                      let availableExams = [];
                      let availableSubjects = [];
                      let subjectPlaceholder = formData.category ? "Select Subjects" : "Select Category First";

                      if (hasMap) {
                        availableExams = currentCat.exam_subject_map.map(e => e.exam_name);

                        if (formData.exams && formData.exams.length > 0) {
                          const selectedMapItems = currentCat.exam_subject_map.filter(item => formData.exams.includes(item.exam_name));
                          const subjectSet = new Set();
                          selectedMapItems.forEach(item => item.subjects.forEach(s => subjectSet.add(s)));
                          availableSubjects = Array.from(subjectSet).sort();
                        } else {
                          subjectPlaceholder = "Select Exams First";
                          availableSubjects = [];
                        }
                      } else {
                        availableExams = currentCat?.exams || [];
                        availableSubjects = currentCat?.subjects || [];
                      }

                      return (
                        <>
                          <MultiSelect
                            label="Exams Taught"
                            options={availableExams}
                            selected={formData.exams}
                            onChange={(newExams) => {
                              let newSubjects = formData.subject;
                              // If using map logic, filter out subjects that are no longer valid for the new set of exams
                              if (hasMap) {
                                const validSubjects = new Set();
                                const selectedMapItems = currentCat.exam_subject_map.filter(item => newExams.includes(item.exam_name));
                                selectedMapItems.forEach(item => item.subjects.forEach(s => validSubjects.add(s)));
                                newSubjects = formData.subject.filter(s => validSubjects.has(s));
                              }
                              setFormData({ ...formData, exams: newExams, subject: newSubjects });
                            }}
                            placeholder={formData.category ? "Select Exams" : "Select Category First"}
                            icon={BookOpen}
                          />

                          <MultiSelect
                            label="Subjects"
                            options={availableSubjects}
                            selected={formData.subject}
                            onChange={(newSub) => setFormData({ ...formData, subject: newSub })}
                            placeholder={subjectPlaceholder}
                            icon={BookOpen}
                          />
                        </>
                      );
                    })()}
                  </div>

                  <FormField label="Experience (Yrs)" name="experience" type="number" value={formData.experience} onChange={handleChange} required placeholder="e.g. 5" icon={Briefcase} />
                  <FormField label="Preferred State" name="preferedState" value={formData.preferedState} onChange={handleChange} required options={PREFERED_STATE_OPTIONS} icon={MapPin} />

                  <FormField
                    label="Current State"
                    name="state"
                    value={formData.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setFormData(prev => ({ ...prev, state: newState, city: '' }));
                    }}
                    required
                    options={STATE_OPTIONS}
                    icon={MapPin}
                  />
                  <FormField
                    label="Current City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder={formData.state ? "Select City" : "Select State First"}
                    options={formData.state ? CITIES_BY_STATE[formData.state] || [] : []}
                    icon={MapPin}
                  />

                  <FormField label="Native State" name="nativeState" value={formData.nativeState} onChange={handleChange} required options={STATE_OPTIONS} icon={MapPin} />
                  <FormField label="Resume Link" name="resumeLink" value={formData.resumeLink} onChange={handleChange} icon={FileText} placeholder="Google Drive / Dropbox link (Optional)" />

                  <div className="md:col-span-2">
                    <FormField label="About You" name="about" value={formData.about} onChange={handleChange} rows={4} placeholder="Tell us about yourself..." />
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 mt-6 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                  <p>Additional details (Employment History, Social Links, etc.) can be added from the <strong>Edit Profile</strong> page after registration.</p>
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
                  onClick={() => {
                    // Simple optional step validation could go here
                    setStep(s => s + 1);
                  }}
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
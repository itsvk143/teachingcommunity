'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CheckCircle, MapPin, BookOpen, AlertCircle, ArrowRight, ArrowLeft,
  Building, User, Phone, Mail, Globe, Trophy, Users, Star,
  LayoutGrid, BookCheck, CheckSquare, Plus, Trash2, Save, Pencil
} from 'lucide-react';

// ... existing code ...

const handleAddResult = () => {
  if (!form.temp_res_year || !form.temp_res_name || !form.temp_res_rank) {
    alert("Please fill in Year, Name, and Rank/Score to add a result.");
    return;
  }

  setForm(f => ({
    ...f,
    top_results: [...(f.top_results || []), { year: Number(f.temp_res_year), name: f.temp_res_name, rank_or_score: f.temp_res_rank, exam: f.temp_res_exam, student_enrollment_id: f.temp_res_enrollment }],
    temp_res_name: '', temp_res_rank: '', temp_res_enrollment: ''
  }));
};

const handleEditResult = (res, idx) => {
  setForm(f => ({
    ...f,
    temp_res_year: res.year,
    temp_res_name: res.name,
    temp_res_rank: res.rank_or_score,
    temp_res_exam: res.exam,
    temp_res_enrollment: res.student_enrollment_id,
    top_results: f.top_results.filter((_, i) => i !== idx)
  }));
};
import React from 'react';

import { COACHING_CATEGORIES } from '@/utils/coachingCategories';
import { INDIAN_LOCATIONS, STATES } from '@/utils/locations';
import TagInput from '@/components/TagInput';
import CoachingLogoSelect from '@/components/CoachingLogoSelect';

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

export default function EditCoaching({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [unwrappedParams, setUnwrappedParams] = useState(null)

  const [form, setForm] = useState({
    name: '', brand_name: '', contact_person_name: '', email: '', phone_primary: '', website_url: '',
    contact_visibility: 'everyone',
    logo_url: '/coachinglogo/logo.png',
    address_line1: '', city: '', state: '', pincode: '', google_maps_url: '',
    exam_types: '', courses_offered: '', streams: '',
    exam_types: '', courses_offered: '', streams: '',
    categories: [],
    course_categories: {},
    batch_timing: [], course_fees: [], temp_course_name: '', temp_course_fee: '',
    top_results: [], temp_res_year: '', temp_res_name: '', temp_res_rank: '', temp_res_exam: '', temp_res_enrollment: '',
    description_short: 'A premier coaching institute fostering academic excellence through personalized mentorship, expert faculty, innovative teaching, and result-oriented strategies to unlock student potential.',
    description_long: 'Our expert faculty provides structured, top-tier mentorship for competitive exams and academic studies. We offer a personalized learning approach, ensuring low student-teacher ratios for focused, individual attention. Our comprehensive, research-backed curriculum includes regular practice tests, detailed study materials, and doubt-solving sessions to boost confidence. Beyond academics, we foster a supportive, disciplined environment that nurtures holistic growth and critical thinking. At our core, we are committed to excellence, aiming to empower every student to achieve their highest educational aspirations.',
    fee_range_min: '', fee_range_max: '',
    faculty_count: '',
    // Faculty Management
    temp_fac_name: '', temp_fac_subject: '', temp_fac_exp: '', temp_fac_photo: '', temp_fac_id: '',
    student_count: '', non_academic_staff_count: '', subject_wise_faculty_input: '',
    ac_classrooms: false, smart_classes: false, library: false, wifi: false, study_room: false, hostel_support: false,
  });

  const handleTeacherLookup = async () => {
    if (!form.temp_fac_id) return alert("Please enter a Teacher ID");
    try {
      setLoading(true);
      const res = await fetch(`/api/teachers/lookup?id=${form.temp_fac_id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setForm(prev => ({
        ...prev,
        temp_fac_name: data.data.name || '',
        temp_fac_subject: data.data.subject || '',
        temp_fac_exp: data.data.experience || '',
        temp_fac_photo: data.data.photo_url || '',
        temp_fac_id: data.data.unique_id || data.data._id || prev.temp_fac_id, // Use unique_id (T1) if available
        temp_fac_ref: data.data._id // Store real ID for potential linking
      }));
    } catch (err) {
      alert("Teacher not found or invalid ID: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = () => {
    if (!form.temp_fac_name) return alert("Faculty Name is required");
    setForm(prev => ({
      ...prev,
      top_faculties: [...(prev.top_faculties || []), {
        name: prev.temp_fac_name,
        subject: prev.temp_fac_subject,
        experience: prev.temp_fac_exp,
        photo_url: prev.temp_fac_photo,
        teacher_id: prev.temp_fac_id, // Store the ID
        profile_ref: prev.temp_fac_ref // Store the MongoDB ID reference
      }],
      temp_fac_name: '', temp_fac_subject: '', temp_fac_exp: '', temp_fac_photo: '', temp_fac_id: ''
    }));
  };

  useEffect(() => {
    Promise.resolve(params).then(setUnwrappedParams);
  }, [params]);

  useEffect(() => {
    if (unwrappedParams?.id) fetchCoachingData(unwrappedParams.id);
  }, [unwrappedParams]);

  const fetchCoachingData = async (id) => {
    try {
      const res = await fetch(`/api/coaching/${id}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();

      const subjectWiseInput = data.subject_wise_faculty
        ?.map(item => `${item.subject}: ${item.count}`)
        .join(', ');

      setForm(prev => ({
        ...prev,
        ...data,
        name: data.name || '',
        brand_name: data.brand_name || '',
        contact_person_name: data.contact_person_name || '',
        email: data.email || '',
        logo_url: data.logo_url || '/coachinglogo/logo.png',
        phone_primary: data.phone_primary || '',
        contact_visibility: data.contact_visibility || 'everyone',
        website_url: data.website_url || '',
        address_line1: data.address_line1 || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        google_maps_url: data.google_maps_url || '',
        description_short: data.description_short ?? 'A premier coaching institute fostering academic excellence through personalized mentorship, expert faculty, innovative teaching, and result-oriented strategies to unlock student potential.',
        description_long: data.description_long ?? 'Our expert faculty provides structured, top-tier mentorship for competitive exams and academic studies. We offer a personalized learning approach, ensuring low student-teacher ratios for focused, individual attention. Our comprehensive, research-backed curriculum includes regular practice tests, detailed study materials, and doubt-solving sessions to boost confidence. Beyond academics, we foster a supportive, disciplined environment that nurtures holistic growth and critical thinking. At our core, we are committed to excellence, aiming to empower every student to achieve their highest educational aspirations.',
        exam_types: Array.isArray(data.exam_types) ? data.exam_types : [],
        courses_offered: Array.isArray(data.courses_offered) ? data.courses_offered : [],
        streams: Array.isArray(data.streams) ? data.streams : [],
        categories: data.categories || [],
        course_categories: data.course_categories || {},
        batch_timing: data.batch_timing || [],
        course_fees: data.course_fees || [],
        top_results: data.top_results || [],
        subject_wise_faculty_input: subjectWiseInput || '',
        fee_range_min: data.fee_range_min || '',
        fee_range_max: data.fee_range_max || '',
        faculty_count: data.faculty_count || '',
        student_count: data.student_count || '',
        non_academic_staff_count: data.non_academic_staff_count || '',
        ac_classrooms: data.ac_classrooms || false,
        smart_classes: data.smart_classes || false,
        library: data.library || false,
        wifi: data.wifi || false,
        study_room: data.study_room || false,
        hostel_support: data.hostel_support || false,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone' || name === 'phone_primary') {
      const val = value.replace(/\D/g, '');
      if (val.length <= 10) setForm(prev => ({ ...prev, [name]: val }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleCategoryChange = (topCategory, subItem) => {
    setForm(prev => {
      const currentCats = { ...prev.course_categories };
      const categoryList = currentCats[topCategory] || [];
      let updatedList = categoryList.includes(subItem)
        ? categoryList.filter(item => item !== subItem)
        : [...categoryList, subItem];

      if (updatedList.length === 0) delete currentCats[topCategory];
      else currentCats[topCategory] = updatedList;

      return { ...prev, course_categories: currentCats };
    });
  };

  const handleSelectAll = (topCategory, allItems) => {
    setForm(prev => {
      const currentCats = { ...prev.course_categories };
      const currentSelected = currentCats[topCategory] || [];
      const flatItems = [];
      Object.values(allItems).forEach(subList => flatItems.push(...subList));

      const isAllSelected = flatItems.every(item => currentSelected.includes(item));
      if (isAllSelected) delete currentCats[topCategory];
      else currentCats[topCategory] = flatItems;

      return { ...prev, course_categories: currentCats };
    });
  };

  const nextStep = (e) => { e?.preventDefault(); setStep(s => s + 1); };
  const prevStep = (e) => { e?.preventDefault(); setStep(s => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!unwrappedParams?.id) return;

    // Prevent saving if there are unsaved result details
    if (form.temp_res_year || form.temp_res_name || form.temp_res_rank) {
      alert("You have unsaved details in 'Add Student Result'. Please clicked 'Add Result' to save them to the list, or clear the inputs.");
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      ...form,
      logo_url: form.logo_url,
      exam_types: form.exam_types,
      courses_offered: form.courses_offered,
      streams: form.streams,
      fee_range_min: Number(form.fee_range_min) || undefined,
      fee_range_max: Number(form.fee_range_max) || undefined,
      faculty_count: Number(form.faculty_count) || undefined,
      student_count: Number(form.student_count) || undefined,
      non_academic_staff_count: Number(form.non_academic_staff_count) || undefined,
      subject_wise_faculty: form.subject_wise_faculty_input
        ? form.subject_wise_faculty_input.split(',').map(s => {
          const parts = s.split(':');
          if (parts.length < 2) return null;
          const subject = parts[0].trim();
          const count = Number(parts[1].trim());
          return { subject, count: count || 0 };
        }).filter(item => item && item.subject && item.count > 0)
        : [],
    };

    try {
      const res = await fetch(`/api/coaching/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update');
      }

      router.push(`/coaching/${unwrappedParams.id}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddResult = () => {
    if (form.temp_res_year && form.temp_res_name && form.temp_res_rank) {
      setForm(f => ({
        ...f,
        top_results: [...(f.top_results || []), { year: Number(f.temp_res_year), name: f.temp_res_name, rank_or_score: f.temp_res_rank, exam: f.temp_res_exam, student_enrollment_id: f.temp_res_enrollment }],
        temp_res_name: '', temp_res_rank: '', temp_res_enrollment: '' // Keep year and exam populated for convenience? Or clear all? original code cleared specific ones.
      }));
    }
  };

  // Prevent form submission on Enter key in Result inputs
  const handleResultKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddResult();
    }
  };

  const steps = [
    { title: "Basic Info", icon: Building },
    { title: "Courses", icon: BookOpen },
    { title: "Facilities", icon: LayoutGrid },
    { title: "Faculty", icon: Users },
    { title: "Results", icon: Trophy }
  ];
  const progress = (step / steps.length) * 100;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Institute Profile</h1>
          <p className="mt-2 text-gray-500">Update your institute's information</p>
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

          <form
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            onSubmit={handleSubmit}
            className="p-8"
          >

            {/* STEP 1: BASIC INFO */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-500" /> Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField label="Institute Name" name="name" value={form.name} onChange={handleChange} required icon={Building} />
                  </div>
                  <FormField label="Brand Name" name="brand_name" value={form.brand_name} onChange={handleChange} icon={Star} />
                  <FormField label="Contact Person / Owner" name="contact_person_name" value={form.contact_person_name} onChange={handleChange} required icon={User} />

                  <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required icon={Mail} disabled />
                  <FormField label="Phone Number" name="phone_primary" type="tel" value={form.phone_primary} onChange={handleChange} required icon={Phone} maxLength={10} />

                  <div className="md:col-span-2">
                    <CoachingLogoSelect
                      selectedLogoUrl={form.logo_url}
                      onChange={(url) => setForm({ ...form, logo_url: url })}
                    />
                  </div>

                  <FormField
                    label="Contact Number Visibility"
                    name="contact_visibility"
                    value={form.contact_visibility}
                    onChange={handleChange}
                    required
                    icon={Phone}
                    options={[
                      { value: 'everyone', label: 'Visible to Everyone' },
                      { value: 'hr_only', label: 'Show to HR Only' }
                    ]}
                  />

                  <div className="md:col-span-2">
                    <FormField label="Website URL" name="website_url" type="url" value={form.website_url} onChange={handleChange} icon={Globe} placeholder="https://" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION & COURSES */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" /> Location & Courses
                </h3>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField label="Address Line 1" name="address_line1" value={form.address_line1} onChange={handleChange} icon={MapPin} />
                  </div>
                  <FormField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={(e) => {
                      handleChange(e);
                      setForm(prev => ({ ...prev, city: '' }));
                    }}
                    required
                    icon={MapPin}
                    options={STATES.map(s => ({ value: s, label: s }))}
                    placeholder="Select State"
                  />

                  <FormField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    icon={MapPin}
                    disabled={!form.state}
                    options={form.state && INDIAN_LOCATIONS[form.state] ? INDIAN_LOCATIONS[form.state].map(c => ({ value: c, label: c })) : []}
                    placeholder={form.state ? "Select City" : "Select State First"}
                  />
                </div>

                {/* Mode */}
                <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                  <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Mode of Coaching</label>
                  <div className="flex gap-6">
                    {['Online', 'Offline', 'Hybrid'].map((m) => (
                      <label key={m} className={`flex items-center space-x-3 px-4 py-2 rounded-lg border cursor-pointer transition-all bg-white ${form.mode?.includes(m) ? 'border-purple-500 ring-1 ring-purple-500 text-purple-700' : 'border-gray-200 hover:border-purple-300'
                        }`}>
                        <input
                          type="checkbox"
                          checked={form.mode?.includes(m) || false}
                          onChange={(e) => {
                            setForm(curr => ({
                              ...curr,
                              mode: e.target.checked ? [...(curr.mode || []), m] : (curr.mode || []).filter(x => x !== m)
                            }));
                          }}
                          className="w-4 h-4 text-purple-600 rounded bg-gray-100 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="font-medium text-sm">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Structured Course Selection */}
                <div className="space-y-4">
                  <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                    <BookCheck className="w-5 h-5 text-blue-600" /> Select Coaching Categories
                  </h4>
                  <div className="grid grid-cols-1 gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(COACHING_CATEGORIES).map(([catKey, catData]) => {
                      const isCatSelected = form.categories?.some(c => c.key === catKey);
                      const selectedCatData = form.categories?.find(c => c.key === catKey) || { exams: [], subjects: [] };

                      return (
                        <div key={catKey} className={`p-5 rounded-xl shadow-sm border transition-all ${isCatSelected ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}>

                          {/* Category Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                  checked={isCatSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      // Add category
                                      setForm(prev => ({
                                        ...prev,
                                        categories: [...(prev.categories || []), { key: catKey, exams: [], subjects: [] }]
                                      }));
                                    } else {
                                      // Remove category
                                      setForm(prev => ({
                                        ...prev,
                                        categories: prev.categories.filter(c => c.key !== catKey)
                                      }));
                                    }
                                  }}
                                />
                                <span className="font-bold text-gray-800 text-lg">{catData.label}</span>
                              </label>
                              <p className="text-xs text-gray-500 mt-1 ml-7">{catData.description}</p>
                            </div>
                          </div>

                          {/* Expanded Selection Area */}
                          {isCatSelected && (
                            <div className="mt-4 ml-7 space-y-6 animate-in fade-in slide-in-from-top-2">

                              {/* Exams & Courses Section */}
                              <div className="space-y-4">
                                <h6 className="text-sm font-bold text-blue-700 uppercase flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                  Select Exams & Courses
                                </h6>

                                {catData.exams.map((examObj) => {
                                  const examName = examObj.exam || examObj;
                                  const availableCourses = examObj.courses || [];

                                  const selectedExamObj = selectedCatData.exams.find(e => e.name === examName);
                                  const isExamSelected = !!selectedExamObj;

                                  return (
                                    <div key={examName} className={`border rounded-lg p-3 transition-colors ${isExamSelected ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                                      {/* Exam Checkbox */}
                                      <label className="flex items-center gap-2 cursor-pointer mb-2">
                                        <input
                                          type="checkbox"
                                          className="w-4 h-4 text-blue-600 rounded focus:ring-0 border-gray-300"
                                          checked={isExamSelected}
                                          onChange={(e) => {
                                            setForm(prev => ({
                                              ...prev,
                                              categories: prev.categories.map(c => {
                                                if (c.key === catKey) {
                                                  let newExams = [...c.exams];
                                                  if (e.target.checked) {
                                                    // Add Exam with empty courses initially
                                                    newExams.push({ name: examName, courses: [] });
                                                  } else {
                                                    // Remove Exam
                                                    newExams = newExams.filter(x => x.name !== examName);
                                                  }
                                                  return { ...c, exams: newExams };
                                                }
                                                return c;
                                              })
                                            }));
                                          }}
                                        />
                                        <span className={`font-semibold text-sm ${isExamSelected ? 'text-blue-800' : 'text-gray-600'}`}>{examName}</span>
                                      </label>

                                      {/* Custom Input for "Other" */}
                                      {isExamSelected && examName === 'Other' && (
                                        <div className="ml-6 mb-3 animate-in fade-in slide-in-from-top-1">
                                          <input
                                            type="text"
                                            placeholder="Specify Exam Name (e.g. Olympiad Level 2)"
                                            className="w-full p-2 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                            value={selectedExamObj.custom_name || ''}
                                            onChange={(e) => {
                                              setForm(prev => ({
                                                ...prev,
                                                categories: prev.categories.map(c => {
                                                  if (c.key === catKey) {
                                                    const newExams = c.exams.map(ex => {
                                                      if (ex.name === examName) {
                                                        return { ...ex, custom_name: e.target.value };
                                                      }
                                                      return ex;
                                                    });
                                                    return { ...c, exams: newExams };
                                                  }
                                                  return c;
                                                })
                                              }));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      )}

                                      {/* Courses Grid (Only show if Exam Selected) */}
                                      {isExamSelected && (
                                        <div className="ml-6 mt-2">
                                          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Select Courses (Optional)</p>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                                            {[...availableCourses, 'Other'].map(courseName => {
                                              // Check if selected (handle both string and object for robustness)
                                              const selectedCourseIdx = selectedExamObj.courses.findIndex(c =>
                                                (typeof c === 'string' ? c : c.name) === courseName
                                              );
                                              const isCourseSelected = selectedCourseIdx !== -1;
                                              const selectedCourseData = isCourseSelected ? selectedExamObj.courses[selectedCourseIdx] : null;

                                              return (
                                                <div key={courseName} className="col-span-1">
                                                  <label className={`flex items-start gap-2 p-1.5 rounded border cursor-pointer text-xs transition-all ${isCourseSelected ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}>
                                                    <input
                                                      type="checkbox"
                                                      className="mt-0.5 rounded text-blue-500 focus:ring-0 border-gray-300 w-3 h-3"
                                                      checked={isCourseSelected}
                                                      onChange={(e) => {
                                                        setForm(prev => ({
                                                          ...prev,
                                                          categories: prev.categories.map(c => {
                                                            if (c.key === catKey) {
                                                              const newExams = c.exams.map(ex => {
                                                                if (ex.name === examName) {
                                                                  let newCourses = [...ex.courses];
                                                                  if (e.target.checked) {
                                                                    // Add New Course Object
                                                                    newCourses.push({ name: courseName, custom_name: '' });
                                                                  } else {
                                                                    // Remove
                                                                    newCourses = newCourses.filter(cx => (typeof cx === 'string' ? cx : cx.name) !== courseName);
                                                                  }
                                                                  return { ...ex, courses: newCourses };
                                                                }
                                                                return ex;
                                                              });
                                                              return { ...c, exams: newExams };
                                                            }
                                                            return c;
                                                          })
                                                        }));
                                                      }}
                                                    />
                                                    <span className="leading-tight">{courseName}</span>
                                                  </label>

                                                  {/* Custom Input for Other Course */}
                                                  {isCourseSelected && courseName === 'Other' && (
                                                    <input
                                                      type="text"
                                                      placeholder="Specify Course Name"
                                                      className="w-full mt-1 p-1.5 text-[10px] border border-blue-200 rounded focus:ring-1 focus:ring-blue-100 outline-none animate-in fade-in"
                                                      value={selectedCourseData?.custom_name || ''}
                                                      onChange={(e) => {
                                                        setForm(prev => ({
                                                          ...prev,
                                                          categories: prev.categories.map(c => {
                                                            if (c.key === catKey) {
                                                              const newExams = c.exams.map(ex => {
                                                                if (ex.name === examName) {
                                                                  const newCourses = ex.courses.map((cx, idx) => {
                                                                    if (idx === selectedCourseIdx) {
                                                                      return { ...cx, custom_name: e.target.value };
                                                                    }
                                                                    return cx;
                                                                  });
                                                                  return { ...ex, courses: newCourses };
                                                                }
                                                                return ex;
                                                              });
                                                              return { ...c, exams: newExams };
                                                            }
                                                            return c;
                                                          })
                                                        }));
                                                      }}
                                                      onClick={(e) => e.stopPropagation()}
                                                    />
                                                  )}
                                                </div>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Subjects Section */}
                              <div className="bg-white p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="text-sm font-bold text-green-700 uppercase flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                    Subjects Offered
                                  </h6>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const allSub = catData.subjects;
                                      const currentSub = selectedCatData.subjects;
                                      const isAll = allSub.every(s => currentSub.includes(s));

                                      setForm(prev => ({
                                        ...prev,
                                        categories: prev.categories.map(c => {
                                          if (c.key === catKey) {
                                            return { ...c, subjects: isAll ? [] : [...allSub] };
                                          }
                                          return c;
                                        })
                                      }));
                                    }}
                                    className="text-[10px] bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-bold hover:bg-green-100 transition"
                                  >
                                    Select All
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {catData.subjects.map(subj => (
                                    <label key={subj} className={`flex items-start gap-2 p-1.5 rounded-lg border cursor-pointer text-xs transition-all ${selectedCatData.subjects.includes(subj) ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}>
                                      <input
                                        type="checkbox"
                                        className="mt-0.5 rounded text-green-600 focus:ring-0 border-gray-300 w-3 h-3"
                                        checked={selectedCatData.subjects.includes(subj)}
                                        onChange={(e) => {
                                          setForm(prev => ({
                                            ...prev,
                                            categories: prev.categories.map(c => {
                                              if (c.key === catKey) {
                                                const newSub = e.target.checked
                                                  ? [...c.subjects, subj]
                                                  : c.subjects.filter(x => x !== subj);
                                                return { ...c, subjects: newSub };
                                              }
                                              return c;
                                            })
                                          }));
                                        }}
                                      />
                                      <span className="leading-tight">{subj}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="pt-4 p-5 bg-yellow-50 rounded-xl border border-yellow-200 space-y-4">
                  <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-wide">Additional Details (Manual)</h4>
                  <TagInput
                    label="Exam Types"
                    value={form.exam_types}
                    onChange={(tags) => setForm(f => ({ ...f, exam_types: tags }))}
                    placeholder="NEET, JEE, UPSC..."
                  />
                  <TagInput
                    label="Courses Offered"
                    value={form.courses_offered}
                    onChange={(tags) => setForm(f => ({ ...f, courses_offered: tags }))}
                    placeholder="2 Year Program, Crash Course..."
                  />
                  <TagInput
                    label="Other Streams"
                    value={form.streams}
                    onChange={(tags) => setForm(f => ({ ...f, streams: tags }))}
                    placeholder="PCM, PCB, etc."
                  />
                </div>
              </div>
            )}

            {/* STEP 3: DETAILS & FACILITIES */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-blue-500" /> Details & Facilities
                </h3>

                <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                  <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Batch Availability</label>
                  <div className="flex gap-4">
                    {['Weekdays Batches', 'Weekend Batches'].map((b) => (
                      <label key={b} className="flex items-center space-x-3 px-4 py-2 bg-white rounded-lg border border-blue-200 text-blue-700 cursor-pointer hover:bg-blue-50">
                        <input
                          type="checkbox"
                          checked={form.batch_timing?.includes(b) || false}
                          onChange={(e) => {
                            setForm(curr => ({
                              ...curr,
                              batch_timing: e.target.checked ? [...(curr.batch_timing || []), b] : (curr.batch_timing || []).filter(x => x !== b)
                            }))
                          }}
                          className="rounded text-blue-600"
                        />
                        <span className="font-medium text-sm">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField label="Short Description (1-2 lines)" name="description_short" value={form.description_short} onChange={handleChange} />
                  <FormField label="Detailed Description" name="description_long" value={form.description_long} onChange={handleChange} rows={4} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Number of Teachers" name="faculty_count" type="number" value={form.faculty_count} onChange={handleChange} placeholder="e.g. 15" icon={User} />
                    <FormField label="Total Students" name="student_count" type="number" value={form.student_count} onChange={handleChange} placeholder="e.g. 500" icon={Users} />
                  </div>
                  <FormField label="Non-Academic Staff" name="non_academic_staff_count" type="number" value={form.non_academic_staff_count} onChange={handleChange} placeholder="e.g. 20" icon={Users} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Key Facilities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'ac_classrooms', label: 'AC Classrooms' }, { key: 'smart_classes', label: 'Smart Classes' },
                      { key: 'library', label: 'Library' }, { key: 'wifi', label: 'Wi-Fi' },
                      { key: 'study_room', label: 'Study Room' }, { key: 'hostel_support', label: 'Hostel' }
                    ].map(({ key, label }) => (
                      <label key={key} className={`flex items-center space-x-3 p-3 border rounded-xl cursor-pointer transition-all ${form[key] ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${form[key] ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                          {form[key] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" name={key} checked={form[key] || false} onChange={handleChange} className="hidden" />
                        <span className={`text-sm font-medium ${form[key] ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: FACULTY */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" /> Manage Faculty
                </h3>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                  <h4 className="text-sm font-bold text-blue-800 mb-4 uppercase tracking-wide">Add New Faculty Member</h4>

                  {/* ID Lookup */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Enter Teacher ID to Auto-fill"
                      value={form.temp_fac_id}
                      onChange={(e) => setForm(f => ({ ...f, temp_fac_id: e.target.value }))}
                      className="flex-1 p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleTeacherLookup}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-bold disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Fetching...' : 'Fetch Details'}
                    </button>
                  </div>

                  {/* Manual / Auto-filled Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <input type="text" placeholder="Name *" value={form.temp_fac_name} onChange={(e) => setForm(f => ({ ...f, temp_fac_name: e.target.value }))} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="Subject" value={form.temp_fac_subject} onChange={(e) => setForm(f => ({ ...f, temp_fac_subject: e.target.value }))} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="Experience (e.g. 5 Years)" value={form.temp_fac_exp} onChange={(e) => setForm(f => ({ ...f, temp_fac_exp: e.target.value }))} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                  </div>

                  <button type="button" onClick={handleAddFaculty} className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 text-sm font-bold flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" /> Add Faculty to List
                  </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {form.top_faculties?.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm relative group">
                      {fac.photo_url ? (
                        <img src={fac.photo_url} alt={fac.name} className="w-12 h-12 rounded-full object-cover border" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{fac.name}</h5>
                        <p className="text-xs text-blue-600 font-medium">{fac.subject}</p>
                        {fac.teacher_id && <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {fac.teacher_id}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, top_faculties: f.top_faculties.filter((_, i) => i !== idx) }))}
                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!form.top_faculties || form.top_faculties.length === 0) && (
                    <div className="col-span-full text-center py-8 text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No faculty members added yet. Add manually or search by ID.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: RESULTS */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-500" /> Results & Achievements
                </h3>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <h4 className="text-sm font-bold text-green-800 mb-4 uppercase tracking-wide">Add Student Result</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                    <input type="number" placeholder="Year" name="temp_res_year" value={form.temp_res_year} onChange={handleChange} onKeyDown={handleResultKeyDown} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="Name" name="temp_res_name" value={form.temp_res_name} onChange={handleChange} onKeyDown={handleResultKeyDown} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="Rank/Score" name="temp_res_rank" value={form.temp_res_rank} onChange={handleChange} onKeyDown={handleResultKeyDown} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="Exam" name="temp_res_exam" value={form.temp_res_exam} onChange={handleChange} onKeyDown={handleResultKeyDown} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="ID" name="temp_res_enrollment" value={form.temp_res_enrollment} onChange={handleChange} onKeyDown={handleResultKeyDown} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                  </div>
                  <button type="button" onClick={handleAddResult} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-bold flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Result
                  </button>
                </div>

                <div className="space-y-3">
                  {form.top_results?.map((res, idx) => (
                    <div key={idx} className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex gap-4 items-center flex-wrap text-sm">
                        <span className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">{res.year}</span>
                        <span className="font-semibold text-gray-900">{res.name}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-purple-600 font-medium">{res.exam}</span>
                        <span className="text-gray-400">|</span>
                        <span className="font-bold text-green-600">Rank: {res.rank_or_score}</span>
                        <span className="text-gray-500 text-xs">ID: {res.student_enrollment_id}</span>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEditResult(res, idx)} className="text-blue-400 hover:text-blue-600 p-1" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => setForm(f => ({ ...f, top_results: f.top_results.filter((_, i) => i !== idx) }))} className="text-red-400 hover:text-red-600 p-1" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {form.top_results?.length === 0 && (
                    <p className="text-center text-gray-400 text-sm italic py-4">No results added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
              ) : (
                <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700 transition-colors">
                  Cancel
                </button>
              )}

              {step < steps.length ? (
                <button key="next-btn" type="button" onClick={nextStep} className="flex items-center px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button key="submit-btn" type="submit" disabled={saving} className="flex items-center px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                  {saving ? 'Saving...' : 'Update Details'}
                  {!saving && <Save className="w-5 h-5 ml-2" />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

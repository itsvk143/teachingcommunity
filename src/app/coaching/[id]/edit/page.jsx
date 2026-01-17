'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CheckCircle, MapPin, BookOpen, AlertCircle, ArrowRight, ArrowLeft,
  Building, User, Phone, Mail, Globe, Trophy, Users, Star,
  LayoutGrid, BookCheck, CheckSquare, Plus, Trash2, Save
} from 'lucide-react';
import React from 'react';

const COURSE_CATEGORIES = {
  "School Tuition (Academic Coaching)": {
    "Classes": ["Class 6th", "Class 7th", "Class 8th", "Class 9th", "Class 10th (Board Special)", "Class 11th", "Class 12th (Board Special)"],
    "Subjects Available": ["Mathematics", "Science (Physics/Chemistry/Biology)", "Physics", "Chemistry", "Biology", "English", "Social Science", "Computer Science / IT"]
  },
  "Foundation Courses": {
    "Courses": ["Foundation Course (Class 6–8)", "NTSE Foundation", "Olympiad Foundation", "Pre-Foundation for JEE/NEET (Class 8–10)"]
  },
  "Board Exam Preparation": {
    "Boards": ["CBSE Board", "ICSE Board", "State Board"],
    "Special": ["Class 10 Board Booster", "Class 12 Board Booster", "Sample Paper + PYQ Practice", "Pre-board Test Series"]
  },
  "Competitive Exam Coaching": {
    "Engineering": ["JEE Main", "JEE Advanced", "JEE (11th + 12th Full Course)", "JEE Dropper Course"],
    "Medical": ["NEET (UG)", "NEET (11th + 12th Full Course)", "NEET Dropper Course", "AIIMS level practice (NEET-based)"]
  },
  "Olympiad Coaching": {
    "Exams": ["NSO (Science Olympiad)", "IMO (Math Olympiad)", "NSEJS", "NSEP / NSEC / NSEA", "KVPY (if applicable)", "IOQM (Math Olympiad)"]
  },
  "Test Series / DPP Courses": {
    "Types": ["Weekly Test Series", "Monthly Grand Test", "Chapter-wise Tests", "Full Syllabus Mock Tests", "DPP (Daily Practice Problems)", "PYQ Test Series"]
  },
  "Crash Courses": {
    "Courses": ["JEE Crash Course", "NEET Crash Course", "Board Exam Crash Course", "Last 45 Days Revision Batch", "Last 30 Days Booster Batch"]
  },
  "Special Support Programs": {
    "Programs": ["Doubt Clearing Sessions", "Revision Batch", "Backlog Completion Batch", "Personal Mentorship Program", "Performance Tracking + Parent Updates"]
  }
};

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
    address_line1: '', city: '', state: '', pincode: '', google_maps_url: '',
    exam_types: '', courses_offered: '', streams: '',
    course_categories: {},
    batch_timing: [], course_fees: [], temp_course_name: '', temp_course_fee: '',
    top_results: [], temp_res_year: '', temp_res_name: '', temp_res_rank: '', temp_res_exam: '', temp_res_enrollment: '',
    description_short: '', description_long: '', fee_range_min: '', fee_range_max: '',
    student_count: '', non_academic_staff_count: '', subject_wise_faculty_input: '',
    ac_classrooms: false, smart_classes: false, library: false, wifi: false, study_room: false, hostel_support: false,
  });

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
        phone_primary: data.phone_primary || '',
        website_url: data.website_url || '',
        address_line1: data.address_line1 || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        google_maps_url: data.google_maps_url || '',
        description_short: data.description_short || '',
        description_long: data.description_long || '',
        exam_types: data.exam_types?.join(', ') || '',
        courses_offered: data.courses_offered?.join(', ') || '',
        course_categories: data.course_categories || {},
        batch_timing: data.batch_timing || [],
        course_fees: data.course_fees || [],
        top_results: data.top_results || [],
        streams: data.streams?.join(', ') || '',
        subject_wise_faculty_input: subjectWiseInput || '',
        fee_range_min: data.fee_range_min || '',
        fee_range_max: data.fee_range_max || '',
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

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!unwrappedParams?.id) return;

    setSaving(true);
    setError('');

    const payload = {
      ...form,
      exam_types: form.exam_types.split(',').map(s => s.trim()).filter(Boolean),
      courses_offered: form.courses_offered.split(',').map(s => s.trim()).filter(Boolean),
      streams: form.streams.split(',').map(s => s.trim()).filter(Boolean),
      fee_range_min: Number(form.fee_range_min) || undefined,
      fee_range_max: Number(form.fee_range_max) || undefined,
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

  const steps = [
    { title: "Basic Info", icon: Building },
    { title: "Courses", icon: BookOpen },
    { title: "Facilities", icon: LayoutGrid },
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

          <form onSubmit={handleSubmit} className="p-8">

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
                  <FormField label="City" name="city" value={form.city} onChange={handleChange} required icon={MapPin} />
                  <FormField label="State" name="state" value={form.state} onChange={handleChange} required icon={MapPin} />
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

                {/* Course Selection */}
                <div className="space-y-4">
                  <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                    <BookCheck className="w-5 h-5 text-blue-600" /> Courses & Programs
                  </h4>
                  <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(COURSE_CATEGORIES).map(([category, subData], idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                          <h5 className="font-semibold text-blue-800">{category}</h5>
                          <button
                            type="button"
                            onClick={() => handleSelectAll(category, subData)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition"
                          >
                            Select All
                          </button>
                        </div>
                        {Object.entries(subData).map(([subKey, items]) => (
                          <div key={subKey} className="mb-4 last:mb-0">
                            {(subKey !== 'Courses' && subKey !== 'Programs' && subKey !== 'Types' && subKey !== 'Exams' && subKey !== 'Boards') && (
                              <h6 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${subKey === 'Classes' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                {subKey}
                              </h6>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {items.map(item => {
                                const uniqueVal = `${item}`;
                                const isChecked = form.course_categories?.[category]?.includes(uniqueVal) || false;
                                return (
                                  <label key={uniqueVal} className={`flex items-start gap-2 p-2 rounded border cursor-pointer text-sm transition-all ${isChecked ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                                    }`}>
                                    <input
                                      type="checkbox"
                                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 bg-white"
                                      checked={isChecked}
                                      onChange={() => handleCategoryChange(category, uniqueVal)}
                                    />
                                    <span className="leading-tight text-xs">{item}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="pt-4 p-5 bg-yellow-50 rounded-xl border border-yellow-200 space-y-4">
                  <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-wide">Additional Details (Manual)</h4>
                  <FormField label="Other Streams" name="streams" value={form.streams} onChange={handleChange} placeholder="PCM, PCB, etc." />
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
                  <FormField label="Total Students" name="student_count" type="number" value={form.student_count} onChange={handleChange} placeholder="e.g. 500" icon={Users} />
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

            {/* STEP 4: RESULTS */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-500" /> Results & Achievements
                </h3>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <h4 className="text-sm font-bold text-green-800 mb-4 uppercase tracking-wide">Add Student Result</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                    <input type="number" placeholder="Year" name="temp_res_year" value={form.temp_res_year} onChange={handleChange} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="Name" name="temp_res_name" value={form.temp_res_name} onChange={handleChange} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="Rank/Score" name="temp_res_rank" value={form.temp_res_rank} onChange={handleChange} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="Exam" name="temp_res_exam" value={form.temp_res_exam} onChange={handleChange} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                    <input type="text" placeholder="ID" name="temp_res_enrollment" value={form.temp_res_enrollment} onChange={handleChange} className="p-2.5 rounded-lg border border-gray-300 text-sm" />
                  </div>
                  <button type="button" onClick={() => {
                    if (form.temp_res_year && form.temp_res_name && form.temp_res_rank) {
                      setForm(f => ({
                        ...f,
                        top_results: [...(f.top_results || []), { year: Number(f.temp_res_year), name: f.temp_res_name, rank_or_score: f.temp_res_rank, exam: f.temp_res_exam, student_enrollment_id: f.temp_res_enrollment }],
                        temp_res_name: '', temp_res_rank: '', temp_res_enrollment: ''
                      }));
                    }
                  }} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-bold flex items-center">
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
                      <button type="button" onClick={() => setForm(f => ({ ...f, top_results: f.top_results.filter((_, i) => i !== idx) }))} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                <button type="button" onClick={nextStep} className="flex items-center px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button type="submit" disabled={saving} className="flex items-center px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed">
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

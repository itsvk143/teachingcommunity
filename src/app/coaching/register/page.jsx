'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CheckCircle, MapPin, BookOpen, AlertCircle, ArrowRight, ArrowLeft,
  Building, User, Phone, Mail, Globe, Trophy, Users, Star,
  LayoutGrid, BookCheck, CheckSquare, Plus, Trash2
} from 'lucide-react';

import { COACHING_CATEGORIES } from '@/utils/coachingCategories';
import { INDIAN_LOCATIONS, STATES } from '@/utils/locations';
import TagInput from '@/components/TagInput';

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

export default function RegisterCoaching() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: '', brand_name: '', contact_person_name: '', email: '', phone: '', phone_primary: '', website_url: '',
    address_line1: '', city: '', state: '', pincode: '', google_maps_url: '',
    contact_visibility: 'masked', // Default to masked
    mode: [],

    // Explicitly removed duplicate keys provided in instruction context, keeping clean state
    exam_types: [], courses_offered: [], streams: [],

    categories: [], // Structured data

    batch_timing: [], course_fees: [], temp_course_name: '', temp_course_fee: '',

    top_results: [], temp_res_year: '', temp_res_name: '', temp_res_rank: '', temp_res_exam: '', temp_res_enrollment: '',

    description_short: '', description_long: '', fee_range_min: '', fee_range_max: '',
    faculty_count: '',
    student_count: '', non_academic_staff_count: '', subject_wise_faculty_input: '',

    ac_classrooms: false, smart_classes: false, library: false, wifi: false, study_room: false, hostel_support: false,
  });

  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({
        ...prev,
        contact_person_name: prev.contact_person_name || session.user.name || '',
        email: prev.email || session.user.email || ''
      }));
    }
  }, [session]);

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
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      instituteName: form.name,
      ownerName: form.contact_person_name,
      phone: form.phone_primary || form.phone,
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
          const [subject, count] = s.split(':').map(part => part.trim());
          return { subject, count: Number(count) || 0 };
        }).filter(item => item.subject && item.count > 0)
        : [],
    };

    try {
      const res = await fetch('/api/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Register Institute</h1>
          <p className="mt-2 text-gray-500">Create a comprehensive profile to attract students</p>
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
                    <FormField label="Institute Name" name="name" value={form.name} onChange={handleChange} required icon={Building} placeholder="e.g. Aakash Institute" />
                  </div>
                  <FormField label="Brand Name" name="brand_name" value={form.brand_name} onChange={handleChange} icon={Star} placeholder="e.g. Aakash" />
                  <FormField label="Contact Person / Owner" name="contact_person_name" value={form.contact_person_name} onChange={handleChange} required icon={User} />

                  <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required icon={Mail} />
                  <FormField label="Phone Number" name="phone_primary" type="tel" value={form.phone_primary} onChange={handleChange} required icon={Phone} maxLength={10} />

                  <FormField
                    label="Contact Number Visibility"
                    name="contact_visibility"
                    value={form.contact_visibility}
                    onChange={handleChange}
                    required
                    icon={Phone}
                    options={[
                      { value: 'visible', label: 'Visible to Public' },
                      { value: 'masked', label: 'Masked (Click to View)' },
                      { value: 'hidden', label: 'Hidden (Private)' }
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
                  <div className="md:col-span-2">
                    <FormField label="Google Maps URL" name="google_maps_url" type="url" value={form.google_maps_url} onChange={handleChange} icon={Globe} />
                  </div>
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
                          checked={form.mode?.includes(m)}
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
                                  const examName = examObj.exam || examObj; // Handle object or string (backward compact safety)
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
                                              // Check if selected (handle both string and object for robustness, primarily object now)
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
                    placeholder="PCM, PCB, Commerce..."
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
                          checked={form.batch_timing?.includes(b)}
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

                {/* Course Fees Table */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <label className="block text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" /> Course Fees Structure
                  </label>

                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <input type="text" placeholder="Course Name (e.g. 12th PCM)" name="temp_course_name" value={form.temp_course_name} onChange={handleChange} className="flex-1 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    <input type="text" placeholder="Fee (e.g. ₹45,000/yr)" name="temp_course_fee" value={form.temp_course_fee} onChange={handleChange} className="flex-1 p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    <button type="button" onClick={() => {
                      if (form.temp_course_name && form.temp_course_fee) {
                        setForm(f => ({ ...f, course_fees: [...(f.course_fees || []), { course_name: f.temp_course_name, fee: f.temp_course_fee }], temp_course_name: '', temp_course_fee: '' }));
                      }
                    }} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </button>
                  </div>

                  {form.course_fees?.length > 0 && (
                    <div className="space-y-2">
                      {form.course_fees.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex gap-4">
                            <span className="font-semibold text-gray-800">{item.course_name}</span>
                            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-sm">{item.fee}</span>
                          </div>
                          <button type="button" onClick={() => setForm(f => ({ ...f, course_fees: f.course_fees.filter((_, i) => i !== idx) }))} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                        <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} className="hidden" />
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
                <button type="submit" disabled={loading} className="flex items-center px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Submitting...' : 'Register Institute'}
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  CheckCircle, AlertCircle, ArrowRight, ArrowLeft,
  Building2, GraduationCap, MapPin, Phone, Mail, Globe,
  Users, BookOpen, Trophy, School, Shield, Image, Loader2
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { indianCities } from '@/lib/indianCities';

// --- CONSTANTS ---
const BOARD_OPTIONS = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Cambridge"];
const MEDIUM_OPTIONS = ["English", "Hindi", "Regional"];
const SCHOOL_TYPES = ["Co-ed", "Boys", "Girls"];
const STREAM_OPTIONS = ["Science (PCM)", "Science (PCB)", "Commerce", "Arts/Humanities", "Vocational"];
const CATEGORY_OPTIONS = ["Private", "Government", "Semi-Government", "Aided"];

const FACILITIES_LIST = [
  { key: 'smart_classes', label: 'Smart Classes' },
  { key: 'library', label: 'Library' },
  { key: 'science_labs', label: 'Science Labs' },
  { key: 'computer_lab', label: 'Computer Lab' },
  { key: 'playground', label: 'Playground' },
  { key: 'indoor_games', label: 'Indoor Games' },
  { key: 'swimming_pool', label: 'Swimming Pool' },
  { key: 'auditorium', label: 'Auditorium' },
  { key: 'transport_facility', label: 'Transport Facility' },
  { key: 'hostel_facility', label: 'Hostel' },
  { key: 'cctv', label: 'CCTV Surveillance' },
  { key: 'ac_classrooms', label: 'AC Classrooms' },
  { key: 'cafeteria', label: 'Cafeteria' },
  { key: 'medical_room', label: 'Medical Room' },
  { key: 'accessibility_ramp', label: 'Ramps/Lifts' },
];

const SAFETY_LIST = [
  { key: 'security_guard', label: 'Security Guard' },
  { key: 'fire_safety', label: 'Fire Safety' },
  { key: 'first_aid', label: 'First Aid' },
  { key: 'female_staff', label: 'Female Staff' },
  { key: 'bus_attendant', label: 'Bus Attendant' },
];

// --- HELPER COMPONENT ---
const FormField = ({ label, name, type = "text", value, onChange, required = false, placeholder = "", options = null, rows = null, maxLength = null, className = "", icon: Icon, disabled = false, readOnly = false }) => {
  const baseClasses = `w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`;

  return (
    <div className={`relative group ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
          {Icon && <Icon className="w-4 h-4" />}
        </div>
        {options ? (
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled || readOnly}
            className={`${baseClasses} appearance-none cursor-pointer pl-10`}
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
            readOnly={readOnly}
            className={`${baseClasses} pl-10`}
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
            readOnly={readOnly}
            className={`${baseClasses} pl-10`}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default function EditSchool() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // --- INITIAL STATE ---
  const [form, setForm] = useState({
    name: '', tagline: '', school_type: 'Co-ed', school_code: '',
    founded_year: '', registration_number: '', category: 'Private', gender_type: 'Co-ed',
    board: [], medium: [],

    phone_primary: '', phone_secondary: '', whatsapp: '', email: '', website_url: '',
    address_line1: '', city: '', district: '', state: '', pincode: '',
    landmark: '', area_type: 'Urban', google_maps_url: '',

    fb_link: '', insta_link: '', yt_link: '', linkedin_link: '', twitter_link: '',

    description_short: '', description_long: '', principal_message: '',
    vision: '', mission: '',
    principal_name: '', principal_qualification: '', principal_photo_url: '',
    director_name: '', contact_person_name: '', contact_person_role: '',
    office_timing: '', total_teaching_staff: '', total_non_teaching_staff: '',

    class_range: '', streams_offered: [], academic_session: '',
    student_count: '', student_teacher_ratio: '', examination_pattern: '',
    admission_open: false, admission_start_date: '', admission_end_date: '',
    eligibility_criteria: '', admission_process: '', online_form_link: '',
    admission_fee: '', monthly_fee: '', annual_charges: '', transport_fee: '',
    scholarships: '', refund_policy_text: '',

    campus_area: '', classroom_count: '', bus_count: '',

    smart_classes: false, library: false, science_labs: false, computer_lab: false,
    playground: false, indoor_games: false, cctv: false, drinking_water: false,
    washrooms: false, medical_room: false, accessibility_ramp: false,
    auditorium: false, hostel_facility: false, transport_facility: false,
    ac_classrooms: false, cafeteria: false,

    security_guard: false, fire_safety: false, first_aid: false,
    female_staff: false, bus_attendant: false,
    student_pickup_policy: '', visitor_entry_policy: '',

    logo_url: '', cover_image_url: '', brochure_pdf_url: '', prospectus_link: '',
    gallery_images_str: '', video_gallery_str: '',

    academic_achievements: '', board_results: '', sports_achievements: '',
    awards_str: '', toppers_list_str: '', alumni_achievements: '',

    terms_conditions: '', privacy_policy: '', anti_bullying_policy: '',
    code_of_conduct: '', mandatory_disclosure: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated') fetchSchoolData();
  }, [status, params.id]);

  const fetchSchoolData = async () => {
    try {
      const res = await fetch(`/api/schools/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch school data');
      const data = await res.json();

      // Transform incoming data to form state
      setForm(prev => ({
        ...prev,
        ...data,
        board: data.board || [],
        medium: data.medium || [],
        streams_offered: data.streams_offered || [],

        // Flatten social links
        fb_link: data.social_links?.facebook || '',
        insta_link: data.social_links?.instagram || '',
        yt_link: data.social_links?.youtube || '',
        linkedin_link: data.social_links?.linkedin || '',
        twitter_link: data.social_links?.twitter || '',

        // Facilities (ensure boolean)
        smart_classes: !!data.smart_classes, library: !!data.library, science_labs: !!data.science_labs,
        computer_lab: !!data.computer_lab, playground: !!data.playground, indoor_games: !!data.indoor_games,
        cctv: !!data.cctv, drinking_water: !!data.drinking_water, washrooms: !!data.washrooms,
        medical_room: !!data.medical_room, accessibility_ramp: !!data.accessibility_ramp,
        auditorium: !!data.auditorium, hostel_facility: !!data.hostel_facility, transport_facility: !!data.transport_facility,
        ac_classrooms: !!data.ac_classrooms, cafeteria: !!data.cafeteria,

        // Safety (ensure boolean)
        security_guard: !!data.security_guard, fire_safety: !!data.fire_safety, first_aid: !!data.first_aid,
        female_staff: !!data.female_staff, bus_attendant: !!data.bus_attendant,

        // Dates (format to YYYY-MM-DD for input type="date")
        admission_start_date: data.admission_start_date ? new Date(data.admission_start_date).toISOString().split('T')[0] : '',
        admission_end_date: data.admission_end_date ? new Date(data.admission_end_date).toISOString().split('T')[0] : '',

        // Arrays to Strings
        gallery_images_str: data.gallery_images ? data.gallery_images.join(', ') : '',
        video_gallery_str: data.video_gallery ? data.video_gallery.join(', ') : '',
        awards_str: data.awards ? data.awards.join(', ') : '',
        toppers_list_str: data.toppers_list ? data.toppers_list.join(', ') : '',
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (['phone_primary', 'phone_secondary', 'whatsapp'].includes(name)) {
      const val = value.replace(/\D/g, '');
      if (val.length <= 10) setForm(prev => ({ ...prev, [name]: val }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleMultiSelect = (field, value) => {
    setForm(prev => {
      const current = prev[field] || [];
      return current.includes(value)
        ? { ...prev, [field]: current.filter(item => item !== value) }
        : { ...prev, [field]: [...current, value] };
    });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...form,
      social_links: {
        facebook: form.fb_link, instagram: form.insta_link, youtube: form.yt_link,
        linkedin: form.linkedin_link, twitter: form.twitter_link
      },
      gallery_images: form.gallery_images_str ? form.gallery_images_str.split(',').map(s => s.trim()) : [],
      video_gallery: form.video_gallery_str ? form.video_gallery_str.split(',').map(s => s.trim()) : [],
      awards: form.awards_str ? form.awards_str.split(',').map(s => s.trim()) : [],
      toppers_list: form.toppers_list_str ? form.toppers_list_str.split(',').map(s => s.trim()) : [],

      founded_year: Number(form.founded_year) || undefined,
      student_count: Number(form.student_count) || undefined,
      teacher_count: Number(form.total_teaching_staff) || undefined,
      classroom_count: Number(form.classroom_count) || undefined,
      bus_count: Number(form.bus_count) || undefined,
      admission_fee: Number(form.admission_fee) || undefined,
      monthly_fee: Number(form.monthly_fee) || undefined,
      annual_charges: Number(form.annual_charges) || undefined,
      transport_fee: Number(form.transport_fee) || undefined,
    };

    // Remove immutable/system fields
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.unique_id;

    try {
      const res = await fetch(`/api/schools/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update school');
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { title: "Identity", icon: School },
    { title: "Management", icon: Users },
    { title: "Academics", icon: GraduationCap },
    { title: "Facilities", icon: Building2 },
    { title: "Gallery & Policies", icon: Image }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Edit School Profile</h1>
          <p className="mt-2 text-gray-500">Update your school information</p>
        </div>

        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex justify-between relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10" />
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col items-center bg-gray-50 px-2 ${step > i ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step === i + 1 ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' : step > i ? 'bg-white border-blue-600 text-blue-600' : 'bg-white border-gray-300'}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold mt-2 hidden sm:block">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 mb-0 rounded text-red-700 flex items-center"><AlertCircle className="w-5 h-5 mr-2" />{error}</div>}

          <div className="p-8">

            {/* STEP 1: IDENTITY & LOCATION */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center gap-2"><School className="text-blue-500" /> Basic Identity & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField label="School Name" name="name" value={form.name} onChange={handleChange} required icon={School} />
                  </div>
                  <FormField label="Tagline / Motto" name="tagline" value={form.tagline} onChange={handleChange} icon={Trophy} />
                  <FormField label="Founded Year" name="founded_year" type="number" value={form.founded_year} onChange={handleChange} icon={CheckCircle} />
                  <FormField label="School Code / Affiliation No" name="school_code" value={form.school_code} onChange={handleChange} icon={Shield} />
                  <FormField label="Registration/UDISE No" name="registration_number" value={form.registration_number} onChange={handleChange} icon={Shield} />
                  <FormField label="Category" name="category" value={form.category} onChange={handleChange} options={CATEGORY_OPTIONS} />
                  <FormField label="School Type" name="school_type" value={form.school_type} onChange={handleChange} options={SCHOOL_TYPES} />
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Board Affiliation</label>
                    <div className="flex flex-wrap gap-3">
                      {BOARD_OPTIONS.map(opt => (
                        <label key={opt} className={`px-3 py-1.5 rounded-lg border cursor-pointer text-sm ${form.board.includes(opt) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50'}`}>
                          <input type="checkbox" checked={form.board.includes(opt)} onChange={() => handleMultiSelect('board', opt)} className="mr-2" />{opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div className="md:col-span-2"><h4 className="font-bold text-gray-700 mb-2">Contact Details</h4></div>
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required icon={Mail} readOnly />
                  <FormField label="Website" name="website_url" value={form.website_url} onChange={handleChange} icon={Globe} />
                  <FormField label="Primary Phone" name="phone_primary" value={form.phone_primary} onChange={handleChange} required icon={Phone} maxLength={10} />
                  <FormField label="Secondary Phone" name="phone_secondary" value={form.phone_secondary} onChange={handleChange} icon={Phone} maxLength={10} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div className="md:col-span-2"><h4 className="font-bold text-gray-700 mb-2">Address</h4></div>
                  <div className="md:col-span-2">
                    <FormField label="Address Line 1" name="address_line1" value={form.address_line1} onChange={handleChange} icon={MapPin} />
                  </div>
                  <FormField label="State" name="state" value={form.state} onChange={(e) => setForm(p => ({ ...p, state: e.target.value, city: '' }))} required options={Object.keys(indianCities)} placeholder="Select State" />
                  <FormField label="City" name="city" value={form.city} onChange={handleChange} required options={form.state ? indianCities[form.state] : []} placeholder="Select City" />
                  <FormField label="District" name="district" value={form.district} onChange={handleChange} />
                  <FormField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
                  <FormField label="Google Maps Link" name="google_maps_url" value={form.google_maps_url} onChange={handleChange} icon={MapPin} />
                </div>
              </div>
            )}

            {/* STEP 2: MANAGEMENT & ABOUT */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center gap-2"><Users className="text-blue-500" /> Management & Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Principal Name" name="principal_name" value={form.principal_name} onChange={handleChange} icon={Users} />
                  <FormField label="Manager/Director Name" name="director_name" value={form.director_name} onChange={handleChange} icon={Users} />
                  <FormField label="Principal Qualification" name="principal_qualification" value={form.principal_qualification} onChange={handleChange} icon={GraduationCap} />
                  <FormField label="Principal Photo URL" name="principal_photo_url" value={form.principal_photo_url} onChange={handleChange} icon={Image} />
                  <FormField label="Contact Person Name" name="contact_person_name" value={form.contact_person_name} onChange={handleChange} icon={Users} />
                  <FormField label="Office Timing" name="office_timing" value={form.office_timing} onChange={handleChange} />
                </div>
                <div className="space-y-4 pt-6">
                  <FormField label="About School (Short Intro)" name="description_short" value={form.description_short} onChange={handleChange} rows={2} />
                  <FormField label="Detailed Description" name="description_long" value={form.description_long} onChange={handleChange} rows={4} />
                  <FormField label="Principal's Message" name="principal_message" value={form.principal_message} onChange={handleChange} rows={3} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Vision" name="vision" value={form.vision} onChange={handleChange} rows={3} />
                    <FormField label="Mission" name="mission" value={form.mission} onChange={handleChange} rows={3} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ACADEMICS & ADMISSIONS */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center gap-2"><GraduationCap className="text-blue-500" /> Academics & Admissions</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Class Range" name="class_range" value={form.class_range} onChange={handleChange} />
                    <FormField label="Academic Session" name="academic_session" value={form.academic_session} onChange={handleChange} />
                    <FormField label="Student Count" name="student_count" type="number" value={form.student_count} onChange={handleChange} />
                    <FormField label="Teacher:Student Ratio" name="student_teacher_ratio" value={form.student_teacher_ratio} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Streams (11th/12th)</label>
                    <div className="flex flex-wrap gap-3">
                      {STREAM_OPTIONS.map(opt => (
                        <label key={opt} className={`px-3 py-1.5 rounded-lg border cursor-pointer text-sm ${form.streams_offered.includes(opt) ? 'bg-purple-50 border-purple-500 text-purple-700' : 'hover:bg-gray-50'}`}>
                          <input type="checkbox" checked={form.streams_offered.includes(opt)} onChange={() => handleMultiSelect('streams_offered', opt)} className="mr-2" />{opt}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4">Admission Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-2 md:col-span-2">
                        <input type="checkbox" name="admission_open" checked={form.admission_open} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                        <span className="font-bold text-gray-800">Admission Open?</span>
                      </div>
                      <FormField label="Start Date" name="admission_start_date" type="date" value={form.admission_start_date} onChange={handleChange} />
                      <FormField label="End Date" name="admission_end_date" type="date" value={form.admission_end_date} onChange={handleChange} />
                      <FormField label="Admission Fee (₹)" name="admission_fee" type="number" value={form.admission_fee} onChange={handleChange} />
                      <FormField label="Monthly Fee (₹)" name="monthly_fee" type="number" value={form.monthly_fee} onChange={handleChange} />
                      <FormField label="Annual Charges (₹)" name="annual_charges" type="number" value={form.annual_charges} onChange={handleChange} />
                      <div className="md:col-span-2">
                        <FormField label="Eligibility Criteria" name="eligibility_criteria" value={form.eligibility_criteria} onChange={handleChange} rows={2} />
                      </div>
                      <div className="md:col-span-2">
                        <FormField label="Online Admission Form Link" name="online_form_link" value={form.online_form_link} onChange={handleChange} placeholder="https://..." />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: INFRASTRUCTURE & SAFETY */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center gap-2"><Building2 className="text-blue-500" /> Infrastructure & Facilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <FormField label="Campus Area" name="campus_area" value={form.campus_area} onChange={handleChange} />
                  <FormField label="Total Classrooms" name="classroom_count" type="number" value={form.classroom_count} onChange={handleChange} />
                  <FormField label="No. of Buses" name="bus_count" type="number" value={form.bus_count} onChange={handleChange} />
                </div>
                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-3">Facilities Available</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {FACILITIES_LIST.map(({ key, label }) => (
                      <label key={key} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${form[key] ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                        <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded mr-2" />
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">Safety & Security</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {SAFETY_LIST.map(({ key, label }) => (
                      <label key={key} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${form[key] ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'}`}>
                        <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} className="w-4 h-4 text-green-600 rounded mr-2" />
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Student Pickup Policy" name="student_pickup_policy" value={form.student_pickup_policy} onChange={handleChange} />
                    <FormField label="Visitor Entry Policy" name="visitor_entry_policy" value={form.visitor_entry_policy} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: GALLERY & EXTRAS */}
            {step === 5 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center gap-2"><Image className="text-blue-500" /> Gallery & Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="School Logo URL" name="logo_url" value={form.logo_url} onChange={handleChange} icon={Image} />
                  <FormField label="Cover Image URL" name="cover_image_url" value={form.cover_image_url} onChange={handleChange} icon={Image} />
                  <div className="md:col-span-2">
                    <FormField label="Gallery Images (Comma separated URLs)" name="gallery_images_str" value={form.gallery_images_str} onChange={handleChange} rows={3} />
                  </div>
                  <div className="md:col-span-2">
                    <FormField label="Video Links (Comma separated)" name="video_gallery_str" value={form.video_gallery_str} onChange={handleChange} rows={2} />
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-700 mb-4">Achievements & Socials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Academic Achievements" name="academic_achievements" value={form.academic_achievements} onChange={handleChange} />
                    <FormField label="Board Results (e.g. 100% Pass)" name="board_results" value={form.board_results} onChange={handleChange} />
                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                      <FormField label="Facebook" name="fb_link" value={form.fb_link} onChange={handleChange} placeholder="URL" />
                      <FormField label="Instagram" name="insta_link" value={form.insta_link} onChange={handleChange} placeholder="URL" />
                      <FormField label="YouTube" name="yt_link" value={form.yt_link} onChange={handleChange} placeholder="URL" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-700 mb-4">Legal & Policies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Terms & Conditions" name="terms_conditions" value={form.terms_conditions} onChange={handleChange} rows={2} />
                    <FormField label="Privacy Policy" name="privacy_policy" value={form.privacy_policy} onChange={handleChange} rows={2} />
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER ACTIONS */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
              ) : (
                <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-700">Cancel</button>
              )}

              {step < steps.length ? (
                <button type="button" onClick={nextStep} className="flex items-center px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button type="submit" disabled={submitting} className="flex items-center px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md disabled:opacity-70">
                  {submitting ? 'Updating...' : 'Update School'} {submitting ? '' : <CheckCircle className="w-5 h-5 ml-2" />}
                </button>
              )}
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

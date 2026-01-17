'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  User, BookOpen, Briefcase, FileText,
  ChevronRight, ChevronLeft, CheckCircle,
  Upload, Calendar, MapPin, DollarSign
} from 'lucide-react';

// Constants
const COLLEGE_OPTIONS = ['IIT', 'NIT', 'Other', 'NA'];
const GENDER = ['FEMALE', 'MALE', 'Other'];
const UNDERGRADUATE_DEGREES = ['B.Tech', 'BSc', 'MBBS', 'Other'];
const POSTGRADUATE_DEGREES = ['M.Tech', 'MSc', 'PG', 'Other', 'NA'];
const SUBJECT_OPTIONS = ['Physics', 'Chemistry', 'Maths', 'Botany', 'Zoology'];
const WORK_PLACE_OPTIONS = ['School', 'Coaching', 'SIP', 'Online Coaching', 'Offline Coaching', 'Other'];
const STATE_OPTIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];
const PREFERED_STATE_OPTIONS = [
  'PAN India', ...STATE_OPTIONS
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

export default function NewTeacher() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', whatsapp: '', gender: '', dob: '', age: '', photoUrl: '',
    maxQualification: '', maxQualificationCollege: '', graduationQualification: '', graduationCollege: '', education: '',
    class10: { boardUniv: '', year: '', percentage: '', medium: '' },
    class12: { boardUniv: '', year: '', percentage: '', medium: '' },
    subject: '', experience: '', currentlyWorkingIn: '', otherWorkPlace: '', currentInstitute: '', previousInstitutes: '',
    ctc: '', preferedState: '', state: '', nativeState: '',
    resumeLink: '', teachingVideoLink: '', about: '',
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' }
  });

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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

  const steps = [
    { title: "Personal Details", icon: User },
    { title: "Education", icon: BookOpen },
    { title: "Professional", icon: Briefcase },
    { title: "Additional", icon: FileText }
  ];

  const totalSteps = steps.length;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
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
                  <FormField label="Gender" name="gender" value={formData.gender} onChange={handleChange} required options={GENDER} icon={User} />
                  <FormField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required icon={Calendar} />
                  <div className="md:col-span-2">
                    <FormField label="Photo URL" name="photoUrl" value={formData.photoUrl} onChange={handleChange} required icon={Upload} placeholder="https://..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Highest Qualification</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Degree (PG)" name="maxQualification" value={formData.maxQualification} onChange={handleChange} required options={POSTGRADUATE_DEGREES} icon={BookOpen} />
                    <FormField label="College/Univ" name="maxQualificationCollege" value={formData.maxQualificationCollege} onChange={handleChange} required options={COLLEGE_OPTIONS} icon={BookOpen} />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Graduation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Degree (UG)" name="graduationQualification" value={formData.graduationQualification} onChange={handleChange} required options={UNDERGRADUATE_DEGREES} icon={BookOpen} />
                    <FormField label="College/Univ" name="graduationCollege" value={formData.graduationCollege} onChange={handleChange} required options={COLLEGE_OPTIONS} icon={BookOpen} />
                    <div className="md:col-span-2">
                      <FormField label="College Name (Specific)" name="education" value={formData.education} onChange={handleChange} required placeholder="e.g. SRM University" icon={BookOpen} />
                    </div>
                  </div>
                </div>

                {/* Optional Schooling */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Schooling (Optional)</h3>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Class 12th</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <FormField label="Board" name="class12.boardUniv" value={formData.class12.boardUniv} onChange={handleChange} placeholder="CBSE" />
                      <FormField label="Year" name="class12.year" value={formData.class12.year} onChange={handleChange} placeholder="2018" />
                      <FormField label="%" name="class12.percentage" value={formData.class12.percentage} onChange={handleChange} placeholder="92%" />
                      <FormField label="Medium" name="class12.medium" value={formData.class12.medium} onChange={handleChange} placeholder="Eng" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Professional */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Professional Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Teaching Subject" name="subject" value={formData.subject} onChange={handleChange} required options={SUBJECT_OPTIONS} icon={BookOpen} />
                  <FormField label="Experience (Yrs)" name="experience" value={formData.experience} onChange={handleChange} required placeholder="e.g. 5" icon={Briefcase} />
                  <FormField label="Currently Working In" name="currentlyWorkingIn" value={formData.currentlyWorkingIn} onChange={handleChange} required options={WORK_PLACE_OPTIONS} icon={Briefcase} />

                  {formData.currentlyWorkingIn === 'Other' && (
                    <FormField label="Specific Workplace" name="otherWorkPlace" value={formData.otherWorkPlace} onChange={handleChange} required placeholder="Freelance / Private" />
                  )}

                  <FormField label="Current CTC" name="ctc" value={formData.ctc} onChange={handleChange} placeholder="e.g. 12 LPA" icon={DollarSign} />
                  <FormField label="Preferred State" name="preferedState" value={formData.preferedState} onChange={handleChange} required options={PREFERED_STATE_OPTIONS} icon={MapPin} />
                </div>

                <div className="space-y-4 pt-2">
                  <FormField label="Current Institute Name" name="currentInstitute" value={formData.currentInstitute} onChange={handleChange} required placeholder="Current workplace name" icon={Briefcase} />
                  <FormField label="Previous Institutes" name="previousInstitutes" value={formData.previousInstitutes} onChange={handleChange} required placeholder="Comma separated list" icon={Briefcase} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <FormField label="Current State" name="state" value={formData.state} onChange={handleChange} required options={STATE_OPTIONS} icon={MapPin} />
                  <FormField label="Native State" name="nativeState" value={formData.nativeState} onChange={handleChange} required options={STATE_OPTIONS} icon={MapPin} />
                </div>
              </div>
            )}

            {/* Step 4: Additional */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Final Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Resume Link" name="resumeLink" value={formData.resumeLink} onChange={handleChange} required icon={FileText} placeholder="Google Drive / Dropbox link" />
                  <FormField label="Demo Video Link" name="teachingVideoLink" value={formData.teachingVideoLink} onChange={handleChange} icon={Upload} placeholder="YouTube / Drive link (Optional)" />
                </div>

                <FormField label="About You" name="about" value={formData.about} onChange={handleChange} required rows={4} placeholder="Your teaching philosophy, approach, and background..." />

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Social Links (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="LinkedIn" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} placeholder="Profile URL" />
                    <FormField label="Facebook" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange} placeholder="Profile URL" />
                    <FormField label="Twitter" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange} placeholder="Profile URL" />
                    <FormField label="Instagram" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange} placeholder="Profile URL" />
                  </div>
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
      </div>
    </div>
  );
}
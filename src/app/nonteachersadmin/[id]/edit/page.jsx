'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  User, Briefcase, GraduationCap, FileText,
  ChevronRight, ChevronLeft, CheckCircle,
  MapPin, Calendar, Globe, Award, List, Loader2, AlertCircle
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
  { label: 'Show to HR Only', value: 'hr_only' },
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

export default function EditNonTeacher() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '', state: '', dob: '', dobVisibility: 'everyone', gender: '',
    maritalStatus: '', nationality: '', religion: '', photoUrl: '',

    // Arrays & CSVs
    jobRole: '', otherJobRole: '', languages: '',
    experience: '', ctc: '', careerObjective: '', currentlyWorkingIn: '',
    currentInstitute: '', currentEmployeeCode: '', // New

    educationalQualification: [],
    workExperience: [],

    technicalSkills: '', keySkills: '', certifications: '',
    resumeLink: '',
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' }
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`/api/non-teachers/${id}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        // Normalization
        const normalizeArray = (arr) => Array.isArray(arr) ? arr.join(', ') : (arr || '');

        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          city: data.city || '',
          state: data.state || '',
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
          dobVisibility: data.dobVisibility || 'everyone',
          photoUrl: data.photoUrl || '',
          gender: data.gender || '',
          maritalStatus: data.maritalStatus || '',
          nationality: data.nationality || 'Indian',
          religion: data.religion || '',


          // Job Role Logic
          jobRole: (data.jobRole && JOB_ROLE_OPTIONS.includes(data.jobRole[0])) ? data.jobRole[0] : (data.jobRole && data.jobRole.length > 0 ? 'OTHER' : ''),
          otherJobRole: (data.jobRole && !JOB_ROLE_OPTIONS.includes(data.jobRole[0])) ? data.jobRole[0] : '',

          languages: normalizeArray(data.languages),
          technicalSkills: normalizeArray(data.technicalSkills),
          keySkills: normalizeArray(data.keySkills),
          certifications: normalizeArray(data.certifications),

          experience: data.experience || '',
          ctc: data.ctc || '',
          careerObjective: data.careerObjective || '',
          currentlyWorkingIn: data.currentlyWorkingIn || '',
          currentInstitute: data.currentInstitute || '',
          currentEmployeeCode: data.currentEmployeeCode || '',

          educationalQualification: data.educationalQualification || [],
          workExperience: data.workExperience || [],

          resumeLink: data.resumeLink || '',
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            twitter: data.socialLinks?.twitter || '',
            linkedin: data.socialLinks?.linkedin || '',
            instagram: data.socialLinks?.instagram || ''
          }
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id]);

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

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (step < steps.length) {
      setStep(s => s + 1);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (step > 1) {
      setStep(s => s - 1);
    }
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
      jobRole: [finalJobRole].filter(Boolean),
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      technicalSkills: form.technicalSkills.split(',').map(s => s.trim()).filter(Boolean),
      keySkills: form.keySkills.split(',').map(s => s.trim()).filter(Boolean),
      certifications: form.certifications.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`/api/non-teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Update failed');

      const redirectPath = session?.user?.role === 'admin' ? '/nonteachersadmin' : '/dashboard';
      router.push(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: "Personal Details", icon: User },
    { title: "Job Profile", icon: Briefcase },
    { title: "Experience", icon: List },
    { title: "Education", icon: GraduationCap },
    { title: "Skills & Extras", icon: Award }
  ];

  const totalSteps = steps.length;
  const progress = (step / totalSteps) * 100;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Non-Teaching Profile</h1>
          <p className="mt-2 text-gray-500">Update your professional details</p>
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
                  <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} required icon={User} />
                  <FormField label="Mobile Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required maxLength={10} icon={User} />
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required icon={User} />

                  <div className="md:col-span-2">
                    <FormField label="Photo URL (Optional)" name="photoUrl" value={form.photoUrl} onChange={handleChange} icon={User} placeholder="Paste Google Drive Link here..." />
                    <p className="text-xs text-gray-400 mt-1 ml-1">You can paste a Google Drive link (Anyone with link)</p>
                  </div>

                  <FormField label="City" name="city" value={form.city} onChange={handleChange} icon={MapPin} />
                  <FormField label="State" name="state" value={form.state} onChange={handleChange} options={STATE_OPTIONS} icon={MapPin} />

                  <FormField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} icon={Calendar} />
                  <FormField label="DOB Visibility" name="dobVisibility" value={form.dobVisibility} onChange={handleChange} options={DOB_VISIBILITY_OPTIONS} icon={Calendar} />
                  <FormField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={GENDER_OPTIONS} icon={User} />

                  <FormField label="Marital Status" name="maritalStatus" value={form.maritalStatus} onChange={handleChange} options={MARITAL_STATUS_OPTIONS} icon={User} />
                  <FormField label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} icon={Globe} />
                  <FormField label="Religion" name="religion" value={form.religion} onChange={handleChange} placeholder="e.g. Hindu" icon={Globe} />
                </div>
              </div>
            )}

            {/* Step 2: Job Profile */}
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
                  <FormField label="Career Objective" name="careerObjective" value={form.careerObjective} onChange={handleChange} rows={4} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Total Experience (Years)" name="experience" value={form.experience} onChange={handleChange} icon={Briefcase} />
                    <FormField label="Current CTC" name="ctc" value={form.ctc} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Current Institute" name="currentInstitute" value={form.currentInstitute} onChange={handleChange} icon={Briefcase} />
                    <FormField label="Employee Code (Current)" name="currentEmployeeCode" value={form.currentEmployeeCode} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Work Experience */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center border-b pb-3 mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
                  <button type="button" onClick={addExperience} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    + Add Experience
                  </button>
                </div>

                <div className="space-y-4">
                  {form.workExperience.map((exp, idx) => (
                    <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <FormField label="Organization" value={exp.organization} onChange={(e) => updateExperience(idx, 'organization', e.target.value)} placeholder="Company Name" className="bg-white" />
                        <FormField label="Designation" value={exp.designation} onChange={(e) => updateExperience(idx, 'designation', e.target.value)} placeholder="Title" className="bg-white" />
                        <FormField label="Duration" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} placeholder="e.g. 2020-2022" className="bg-white" />
                        <FormField label="Responsibilities" value={exp.responsibilities} onChange={(e) => updateExperience(idx, 'responsibilities', e.target.value)} placeholder="Key roles" className="bg-white" />
                        <FormField label="Employee Code (Optional)" value={exp.employeeCode} onChange={(e) => updateExperience(idx, 'employeeCode', e.target.value)} placeholder="EMP..." className="bg-white" />
                      </div>
                      <button type="button" onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition">
                        Remove
                      </button>
                    </div>
                  ))}
                  {form.workExperience.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                      No work experience added yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Education */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center border-b pb-3 mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Education Details</h2>
                  <button type="button" onClick={addEducation} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    + Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {form.educationalQualification.map((edu, idx) => (
                    <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField label="Qualification" value={edu.qualification} onChange={(e) => updateEducation(idx, 'qualification', e.target.value)} placeholder="e.g. B.Com" className="bg-white" />
                        <FormField label="Board/Univ" value={edu.boardUniv} onChange={(e) => updateEducation(idx, 'boardUniv', e.target.value)} placeholder="University" className="bg-white" />
                        <FormField label="Year" value={edu.year} onChange={(e) => updateEducation(idx, 'year', e.target.value)} placeholder="YYYY" className="bg-white" />
                        <FormField label="Percentage/CGPA" value={edu.percentage} onChange={(e) => updateEducation(idx, 'percentage', e.target.value)} placeholder="Score" className="bg-white" />
                      </div>
                      <button type="button" onClick={() => removeEducation(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition">
                        Remove
                      </button>
                    </div>
                  ))}
                  {form.educationalQualification.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                      No education details added yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Skills & Additional */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Skills & Additional Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Key Soft Skills" name="keySkills" value={form.keySkills} onChange={handleChange} rows={3} placeholder="Leadership, Communication..." />
                  <FormField label="Technical Skills" name="technicalSkills" value={form.technicalSkills} onChange={handleChange} rows={3} placeholder="MS Office, Tally..." />
                  <FormField label="Certifications" name="certifications" value={form.certifications} onChange={handleChange} rows={2} placeholder="Any courses..." />
                  <FormField label="Languages Known" name="languages" value={form.languages} onChange={handleChange} rows={2} placeholder="English, Hindi..." />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Resume & Social Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <FormField label="Resume Link" name="resumeLink" value={form.resumeLink} onChange={handleChange} required icon={FileText} />
                    </div>
                    <FormField label="LinkedIn" name="socialLinks.linkedin" value={form.socialLinks.linkedin} onChange={handleChange} />
                    <FormField label="Facebook" name="socialLinks.facebook" value={form.socialLinks.facebook} onChange={handleChange} />
                    <FormField label="Twitter" name="socialLinks.twitter" value={form.socialLinks.twitter} onChange={handleChange} />
                    <FormField label="Instagram" name="socialLinks.instagram" value={form.socialLinks.instagram} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
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
                  onClick={handleNext}
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
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
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

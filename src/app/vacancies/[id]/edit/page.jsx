'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, Building2, Plus, X, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { indianCities } from '@/lib/indianCities';
import { TEACHING_CATEGORIES } from '@/utils/teachingCategories';
import MultiSelect from '@/components/ui/MultiSelect';

const NON_TEACHING_ROLES = [
    "Principal", "Vice Principal", "Academic Coordinator", "Administrator",
    "Counselor", "Admission Counsellor", "Accountant", "Receptionist",
    "Librarian", "Lab Assistant", "IT Coordinator", "HR Manager",
    "Marketing Executive", "Telecaller", "Content Writer", "Graphic Designer",
    "Video Editor", "Peon / Office Boy", "Driver", "Security Guard",
    "Hostel Warden", "Cook / Chef", "Other"
];

export default function EditVacancyPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const { data: session, status } = useSession();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        jobTitle: '',
        vacancyCategory: 'Teaching',
        subject: '',
        companyName: '',
        location: '',
        country: 'India',
        city: '',
        state: '',
        jobType: 'Full Time',
        experience: 'Fresher',
        stream: [],
        exam: [],
        salaryMin: '',
        salaryMax: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        numberOfOpenings: 1,
        requirements: [{ subject: '', count: 1 }],
        selectionProcess: {
            writtenTest: 'Offline',
            teacherDemo: 'Offline',
            studentDemo: 'Not Required',
            interview: 'Not Required',
        }
    });

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const res = await fetch(`/api/vacancies/${id}`);
                if (!res.ok) throw new Error('Failed to fetch vacancy details');
                const data = await res.json();

                // Map data to form state
                setForm({
                    jobTitle: data.jobTitle || '',
                    vacancyCategory: data.vacancyCategory || 'Teaching',
                    subject: data.subject || '',
                    companyName: data.companyName || '',
                    location: data.location || '',
                    country: data.country || 'India',
                    city: data.city || '',
                    state: data.state || '',
                    jobType: data.jobType || 'Full Time',
                    experience: data.experience || 'Fresher',
                    stream: data.stream || [],
                    exam: data.exam || [],
                    salaryMin: data.salaryMin || '',
                    salaryMax: data.salaryMax || '',
                    description: data.description || '',
                    contactEmail: data.contactEmail || '',
                    contactPhone: data.contactPhone || '',
                    numberOfOpenings: data.numberOfOpenings || 1,
                    requirements: (data.requirements && data.requirements.length > 0) ? data.requirements : [{ subject: '', count: 1 }],
                    selectionProcess: data.selectionProcess || {
                        writtenTest: 'Offline',
                        teacherDemo: 'Offline',
                        studentDemo: 'Not Required',
                        interview: 'Not Required',
                    }
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVacancy();
    }, [id]);

    const STREAMS = Object.keys(TEACHING_CATEGORIES);

    const availableExams = form.stream && Array.isArray(form.stream)
        ? form.stream.flatMap(s => TEACHING_CATEGORIES[s]?.exams || [])
        : [];

    const availableSubjects = (() => {
        let subjects = [];
        if (form.exam && form.exam.length > 0) {
            form.exam.forEach(selectedExam => {
                Object.values(TEACHING_CATEGORIES).forEach(category => {
                    const found = category.exam_subject_map?.find(e => e.exam_name === selectedExam);
                    if (found) subjects.push(...found.subjects);
                });
            });
        } else if (form.stream && form.stream.length > 0) {
            form.stream.forEach(s => {
                if (TEACHING_CATEGORIES[s]?.subjects) {
                    subjects.push(...TEACHING_CATEGORIES[s].subjects);
                }
            });
        }
        return [...new Set(subjects)].sort();
    })();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSelectionChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            selectionProcess: {
                ...form.selectionProcess,
                [name]: value
            }
        });
    };

    const handleStreamChange = (selectedStreams) => {
        setForm(prev => ({
            ...prev,
            stream: selectedStreams,
        }));
    };

    const handleExamChange = (selectedExams) => {
        setForm(prev => ({ ...prev, exam: selectedExams }));
    };

    const handleRequirementChange = (index, field, value) => {
        const newReqs = [...form.requirements];
        newReqs[index][field] = value;
        const total = newReqs.reduce((acc, curr) => acc + (parseInt(curr.count) || 0), 0);
        const subjects = newReqs.map(r => r.subject).filter(s => s).join(', ');
        setForm({ ...form, requirements: newReqs, numberOfOpenings: total, subject: subjects });
    };

    const addRequirementRow = () => {
        setForm({ ...form, requirements: [...form.requirements, { subject: '', count: 1 }] });
    };

    const removeRequirementRow = (index) => {
        if (form.requirements.length === 1) return;
        const newReqs = form.requirements.filter((_, i) => i !== index);
        const total = newReqs.reduce((acc, curr) => acc + (parseInt(curr.count) || 0), 0);
        const subjects = newReqs.map(r => r.subject).filter(s => s).join(', ');
        setForm({ ...form, requirements: newReqs, numberOfOpenings: total, subject: subjects });
    };

    const handleStateChange = (e) => {
        const newState = e.target.value;
        setForm({ ...form, state: newState, city: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch(`/api/vacancies/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to update vacancy');
            }

            alert('Vacancy updated successfully!');
            router.push('/admin/vacancies');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (status === 'unauthenticated' || (session?.user?.role !== 'admin' && session?.user?.role !== 'hr')) {
        return <div className="p-8 text-red-600 font-bold text-center">Unauthorized Access</div>;
    }

    const lpaSalaryOptions = Array.from({ length: 200 }, (_, i) => `${i + 1} LPA`);
    const perClassSalaryOptions = Array.from({ length: 200 }, (_, i) => `${(i + 1) * 100}`);
    const formSalaryOptions = form.jobType === 'Per Class' ? perClassSalaryOptions : lpaSalaryOptions;
    const experienceOptions = ['Fresher', ...Array.from({ length: 50 }, (_, i) => `${i + 1} Year${i + 1 > 1 ? 's' : ''}`)];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
                </button>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-12">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Edit Vacancy</h3>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Category Selection */}
                        <div className="col-span-1 md:col-span-2 flex gap-6 mb-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="vacancyCategory"
                                    value="Teaching"
                                    checked={form.vacancyCategory === 'Teaching'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Teaching Role</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="vacancyCategory"
                                    value="Non-Teaching"
                                    checked={form.vacancyCategory === 'Non-Teaching'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Non-Teaching Role</span>
                            </label>
                        </div>

                        <div className="space-y-1 col-span-1 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Job Title</label>
                            <input name="jobTitle" required onChange={handleChange} value={form.jobTitle} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>

                        {form.vacancyCategory === 'Teaching' && (
                            <>
                                <div className="space-y-1 relative" style={{ zIndex: 50 }}>
                                    <label className="text-sm font-bold text-gray-700">Stream / Category</label>
                                    <MultiSelect
                                        options={STREAMS.map(s => ({ value: s, label: TEACHING_CATEGORIES[s].label }))}
                                        selected={form.stream}
                                        onChange={handleStreamChange}
                                        placeholder="Select Stream(s)"
                                    />
                                </div>
                                <div className="space-y-1 relative" style={{ zIndex: 40 }}>
                                    <label className="text-sm font-bold text-gray-700">Exam</label>
                                    <MultiSelect
                                        options={availableExams.map(e => ({ value: e, label: e }))}
                                        selected={form.exam}
                                        onChange={handleExamChange}
                                        placeholder="Select Exam(s)"
                                        disabled={form.stream.length === 0}
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-span-1 md:col-span-2 bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <label className="text-base font-bold text-gray-800 mb-4 block">
                                {form.vacancyCategory === 'Teaching' ? 'Vacancy Details (Subject & Openings)' : 'Role Details (Designation & Openings)'}
                            </label>
                            <div className="space-y-4">
                                {form.requirements.map((req, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            {form.vacancyCategory === 'Non-Teaching' ? (
                                                <div className="space-y-2">
                                                    <select
                                                        value={NON_TEACHING_ROLES.includes(req.subject) ? req.subject : (req.subject ? 'Other' : '')}
                                                        onChange={(e) => handleRequirementChange(idx, 'subject', e.target.value)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                                                    >
                                                        <option value="">Select Role</option>
                                                        {NON_TEACHING_ROLES.map(role => (
                                                            <option key={role} value={role}>{role}</option>
                                                        ))}
                                                        <option value="Other">Other (Specify)</option>
                                                    </select>
                                                    {(req.subject === 'Other' || (!NON_TEACHING_ROLES.includes(req.subject) && req.subject !== '')) && (
                                                        <input
                                                            placeholder="Specify Role"
                                                            value={req.subject === 'Other' ? '' : req.subject}
                                                            onChange={(e) => handleRequirementChange(idx, 'subject', e.target.value)}
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <select
                                                        value={availableSubjects.includes(req.subject) ? req.subject : (req.subject ? 'Other' : '')}
                                                        onChange={(e) => handleRequirementChange(idx, 'subject', e.target.value)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                                                    >
                                                        <option value="">Select Subject</option>
                                                        {availableSubjects.map(sub => (
                                                            <option key={sub} value={sub}>{sub}</option>
                                                        ))}
                                                        <option value="Other">Other (Specify)</option>
                                                    </select>
                                                    {(req.subject === 'Other' || (!availableSubjects.includes(req.subject) && req.subject !== '')) && (
                                                        <input
                                                            placeholder="Specify Subject"
                                                            value={req.subject === 'Other' ? '' : req.subject}
                                                            onChange={(e) => handleRequirementChange(idx, 'subject', e.target.value)}
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Count"
                                                value={req.count}
                                                onChange={(e) => handleRequirementChange(idx, 'count', parseInt(e.target.value) || 1)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                            />
                                        </div>
                                        {form.requirements.length > 1 && (
                                            <button type="button" onClick={() => removeRequirementRow(idx)} className="mt-2 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addRequirementRow} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    {form.vacancyCategory === 'Teaching' ? 'Add Another Subject' : 'Add Another Role'}
                                </button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-blue-100 flex justify-end">
                                <span className="text-gray-700 font-bold">Total Openings: <span className="text-blue-600 text-lg ml-1">{form.numberOfOpenings}</span></span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Company Name</label>
                            <input name="companyName" required onChange={handleChange} value={form.companyName} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Country</label>
                            <select name="country" required onChange={handleChange} value={form.country} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white font-medium">
                                <option value="India">India</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">State</label>
                            <select
                                name="state"
                                required={form.country === 'India'}
                                onChange={handleStateChange}
                                value={form.state}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white font-medium"
                            >
                                <option value="">Select State</option>
                                {Object.keys(indianCities).map(state => <option key={state} value={state}>{state}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">City</label>
                            <select
                                name="city"
                                required={form.country === 'India'}
                                onChange={handleChange}
                                value={form.city}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white font-medium"
                                disabled={form.country === 'India' && !form.state}
                            >
                                <option value="">Select City</option>
                                {form.state && indianCities[form.state]?.map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1 col-span-1 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Location (Area/Landmark)</label>
                            <input name="location" required onChange={handleChange} value={form.location} placeholder="e.g. Kankarbagh" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Job Type</label>
                            <select name="jobType" onChange={handleChange} value={form.jobType} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                                <option>Full Time</option>
                                <option>Part Time</option>
                                <option>Contract</option>
                                <option>Per Class</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Experience Required</label>
                            <select name="experience" onChange={handleChange} value={form.experience} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                                {experienceOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <label className="text-base font-bold text-gray-800 mb-4 block">Salary Range</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700">Minimum Salary</label>
                                    <select name="salaryMin" required onChange={handleChange} value={form.salaryMin} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                                        <option value="">Select Min Salary</option>
                                        <option value="Not Disclosed">Not Disclosed</option>
                                        <option value="No bar for deserving candidate">No bar for deserving candidate</option>
                                        {formSalaryOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700">Maximum Salary</label>
                                    <select name="salaryMax" required onChange={handleChange} value={form.salaryMax} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                                        <option value="">Select Max Salary</option>
                                        <option value="Not Disclosed">Not Disclosed</option>
                                        {formSalaryOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Contact Email</label>
                            <input name="contactEmail" required onChange={handleChange} value={form.contactEmail} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Contact Phone</label>
                            <input name="contactPhone" onChange={handleChange} value={form.contactPhone} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>

                        {form.vacancyCategory !== 'Non-Teaching' && (
                            <div className="col-span-1 md:col-span-2 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                <label className="text-base font-bold text-gray-800 mb-4 block">Selection Process Overview</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Written Test</label>
                                        <select name="writtenTest" value={form.selectionProcess.writtenTest} onChange={handleSelectionChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                                            <option value="">Select Option</option>
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                            <option value="Not Required">Not Required</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Teacher Demo</label>
                                        <select name="teacherDemo" value={form.selectionProcess.teacherDemo} onChange={handleSelectionChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                                            <option value="">Select Option</option>
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                            <option value="Not Required">Not Required</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Student Demo</label>
                                        <select name="studentDemo" value={form.selectionProcess.studentDemo} onChange={handleSelectionChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                                            <option value="">Select Option</option>
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                            <option value="Not Required">Not Required</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Final Interview</label>
                                        <select name="interview" value={form.selectionProcess.interview} onChange={handleSelectionChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                                            <option value="">Select Option</option>
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                            <option value="Not Required">Not Required</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-sm font-bold text-gray-700">Job Description</label>
                            <textarea
                                name="description"
                                required
                                onChange={handleChange}
                                value={form.description}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 pt-6">
                            <button
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 disabled:from-blue-400 disabled:to-indigo-400 text-white font-bold py-4 rounded-xl hover:shadow-xl transform transition hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Updating Vacancy...
                                    </>
                                ) : (
                                    <>
                                        Update Vacancy Listing 🚀
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

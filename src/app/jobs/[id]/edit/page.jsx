'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TEACHING_CATEGORIES } from '@/utils/teachingCategories';
import MultiSelect from '@/components/ui/MultiSelect';

export default function EditJob() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        jobTitle: '',
        companyName: '',
        location: '',
        jobType: 'Full Time',
        experience: '',
        stream: [],
        exam: [],
        salaryMin: '',
        salaryMax: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        googleFormLink: '',
    });

    const STREAMS = Object.keys(TEACHING_CATEGORIES);

    // Derived EXAMS list based on selected Streams array
    const availableExams = form.stream && Array.isArray(form.stream)
        ? form.stream.flatMap(s => TEACHING_CATEGORIES[s]?.exams || [])
        : [];

    const salaryOptions = Array.from({ length: 200 }, (_, i) => `${i + 1} LPA`);

    useEffect(() => {
        async function fetchVacancy() {
            try {
                const res = await fetch(`/api/vacancies/${id}`);
                if (!res.ok) throw new Error('Failed to fetch vacancy details');
                const data = await res.json();

                setForm({
                    jobTitle: data.jobTitle || '',
                    companyName: data.companyName || '',
                    location: data.location || '',
                    jobType: data.jobType || 'Full Time',
                    experience: data.experience || '',
                    stream: Array.isArray(data.stream) ? data.stream : (data.stream ? [data.stream] : []),
                    exam: Array.isArray(data.exam) ? data.exam : (data.exam ? [data.exam] : []),
                    salaryMin: data.salaryMin || '',
                    salaryMax: data.salaryMax || '',
                    description: data.description || '',
                    contactEmail: data.contactEmail || '',
                    contactPhone: data.contactPhone || '',
                    googleFormLink: data.googleFormLink || '',
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchVacancy();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleStreamChange = (selectedStreams) => {
        setForm(prev => ({
            ...prev,
            stream: selectedStreams
        }));
    };

    const handleExamChange = (selectedExams) => {
        setForm(prev => ({ ...prev, exam: selectedExams }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`/api/vacancies/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to update job');

            alert('Job updated successfully!');
            router.back();
        } catch (error) {
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Edit Job Vacancy</h1>
                        <p className="text-blue-100 text-sm">Update vacancy details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Job Title</label>
                                <input
                                    name="jobTitle"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Senior Physics Faculty"
                                    value={form.jobTitle}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1 relative" style={{ zIndex: 50 }}>
                                <label className="text-sm font-medium text-gray-700">Stream / Category</label>
                                <MultiSelect
                                    options={STREAMS.map(s => ({ value: s, label: TEACHING_CATEGORIES[s].label }))}
                                    selected={form.stream}
                                    onChange={handleStreamChange}
                                    placeholder="Select Stream(s)"
                                />
                            </div>

                            <div className="space-y-1 relative" style={{ zIndex: 40 }}>
                                <label className="text-sm font-medium text-gray-700">Exam</label>
                                <MultiSelect
                                    options={availableExams.map(e => ({ value: e, label: e }))}
                                    selected={form.exam}
                                    onChange={handleExamChange}
                                    placeholder="Select Exam(s)"
                                    disabled={form.stream.length === 0}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Institute / Company Name</label>
                                <input
                                    name="companyName"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Alpha Classes"
                                    value={form.companyName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Job Type</label>
                                <select
                                    name="jobType"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={form.jobType}
                                    onChange={handleChange}
                                >
                                    <option>Full Time</option>
                                    <option>Part Time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Location</label>
                                <input
                                    name="location"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="City, State"
                                    value={form.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Experience Required</label>
                                <input
                                    name="experience"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. 2-5 Years"
                                    value={form.experience}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="text-sm font-bold text-gray-700 mb-4 block">Salary Range</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Minimum Salary</label>
                                        <select name="salaryMin" required onChange={handleChange} value={form.salaryMin} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                            <option value="">Select Min Salary</option>
                                            <option value="Not Disclosed">Not Disclosed</option>
                                            <option value="No bar for deserving candidate">No bar for deserving candidate</option>
                                            {salaryOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Maximum Salary</label>
                                        <select name="salaryMax" required onChange={handleChange} value={form.salaryMax} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                            <option value="">Select Max Salary</option>
                                            <option value="Not Disclosed">Not Disclosed</option>
                                            <option value="No bar for deserving candidate">No bar for deserving candidate</option>
                                            {salaryOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Job Description</label>
                            <textarea
                                name="description"
                                required
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Describe the role, responsibilities, and requirements..."
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                                <input
                                    name="contactEmail"
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="hr@example.com"
                                    value={form.contactEmail}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Contact Phone</label>
                                <input
                                    name="contactPhone"
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Mobile Number"
                                    value={form.contactPhone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Google Form Link */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Google Form Link (Optional)</label>
                                <input
                                    name="googleFormLink"
                                    type="url"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://forms.google.com/..."
                                    value={form.googleFormLink}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-gray-500">
                                    If provided, applicants will see an option to apply via this form.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm"
                            >
                                {submitting ? 'Updating...' : 'Update Job'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

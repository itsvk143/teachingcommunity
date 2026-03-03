'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    CheckCircle, MapPin, AlertCircle, Building, User, Phone, Mail, Globe, LayoutGrid
} from 'lucide-react';

import { INDIAN_LOCATIONS, STATES } from '@/utils/locations';
import ConsultantAvatarSelect from '@/components/ConsultantAvatarSelect';

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

export default function RegisterConsultant() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        brand_name: '',
        email: '',
        phone: '',
        website_url: '',
        address_line1: '',
        address_line2: '',
        country: 'India',
        city: '',
        state: '',
        pincode: '',
        description: '',
        logo_url: '/consultantavatar/logo.png', // Default avatar
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'phone') {
            const val = value.replace(/\D/g, '');
            if (val.length <= 10) setForm(prev => ({ ...prev, [name]: val }));
        } else {
            setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/consultants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to register as consultant');
            }

            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Register as a Job Consultant</h1>
                    <p className="mt-2 text-gray-500">Create your consulting profile to post vacancies and connect with teaching professionals</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 mb-0 rounded-r text-red-700 text-sm flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                                <Building className="w-5 h-5 text-blue-500" /> Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <FormField label="Consulting Firm / Brand Name" name="brand_name" value={form.brand_name} onChange={handleChange} required icon={Building} placeholder="e.g. EduStaff Consulting" />
                                </div>
                                <FormField label="Contact Person Name" name="name" value={form.name} onChange={handleChange} required icon={User} />
                                <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required icon={Mail} />
                                <FormField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required icon={Phone} maxLength={10} />
                                <FormField label="Website URL" name="website_url" type="url" value={form.website_url} onChange={handleChange} icon={Globe} placeholder="https://" />

                                <div className="md:col-span-2">
                                    <FormField label="Short BIO / Firm Description" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Tell us about the recruitment services your firm provides..." />
                                </div>
                                <div className="md:col-span-2">
                                    <FormField label="Consultation Fee (Optional)" name="consultation_fee" value={form.consultation_fee} onChange={handleChange} placeholder="e.g., ₹500 per session / Free Initial Consultation" />
                                </div>

                                <div className="md:col-span-2">
                                    <ConsultantAvatarSelect
                                        selectedAvatarUrl={form.logo_url}
                                        onChange={(url) => setForm({ ...form, logo_url: url })}
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Choose a default avatar or provide a custom image URL for your profile.</p>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" /> Operating Location
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <FormField label="Address Line 1" name="address_line1" value={form.address_line1} onChange={handleChange} icon={MapPin} />
                                </div>
                                <div className="md:col-span-2">
                                    <FormField label="Address Line 2" name="address_line2" value={form.address_line2} onChange={handleChange} icon={MapPin} />
                                </div>
                                <FormField
                                    label="Country"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    required
                                    icon={Globe}
                                    options={[{ value: 'India', label: 'India' }, { value: 'Other', label: 'Other' }]}
                                    placeholder="Select Country"
                                />

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

                                <FormField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} icon={MapPin} maxLength={6} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                            >
                                Complete Registration <CheckCircle className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

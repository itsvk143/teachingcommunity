'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, GraduationCap, Download } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function VacancyApplicantsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const { data: session } = useSession();

    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vacancyTitle, setVacancyTitle] = useState('');

    useEffect(() => {
        async function fetchApplicants() {
            try {
                const res = await fetch(`/api/vacancies/${id}/applicants`);
                if (res.ok) {
                    const data = await res.json();
                    setApplicants(data);
                }
            } catch (error) {
                console.error('Failed to fetch applicants', error);
            } finally {
                setLoading(false);
            }
        }

        // Also fetch vacancy details just for the title
        async function fetchVacancy() {
            try {
                const res = await fetch(`/api/vacancies/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setVacancyTitle(data.jobTitle);
                }
            } catch (error) {/* ignore */ }
        }

        if (id && session?.user) {
            fetchApplicants();
            fetchVacancy();
        }
    }, [id, session]);

    if (loading) {
        return <div className="p-10 text-center">Loading applicants...</div>;
    }

    if (!session?.user) {
        return <div className="p-10 text-center text-red-500">Please log in to view applicants.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Vacancy Applicants</h1>
                    {vacancyTitle && <p className="text-blue-600 font-medium">{vacancyTitle}</p>}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Info</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applied At</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {applicants.length > 0 ? (
                                applicants.map((app) => {
                                    const user = app.userId || {};
                                    const profile = app.profile || {};

                                    // Consolidate data
                                    const name = profile.name || user.name || 'Unknown';
                                    const email = user.email || 'N/A';
                                    const phone = profile.phone || 'N/A';
                                    const location = profile.city ? `${profile.city}, ${profile.state}` : (profile.state || 'N/A');
                                    const role = user.role || 'User';

                                    return (
                                        <tr key={app._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                            {name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        {profile._id ? (
                                                            <Link href={`/teacherspublic/${profile._id}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline">
                                                                {name}
                                                            </Link>
                                                        ) : (
                                                            <div className="text-sm font-medium text-gray-900">{name}</div>
                                                        )}
                                                        <div className="text-xs text-gray-500 capitalize">{role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1 text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3 h-3" /> {email}
                                                    </div>
                                                    {phone !== 'N/A' && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-3 h-3" /> {phone}
                                                        </div>
                                                    )}
                                                    {location !== 'N/A' && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-3 h-3" /> {location}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {profile.currentlyWorkingIn && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Briefcase className="w-3 h-3 text-gray-400" />
                                                            <span className="truncate max-w-xs">{profile.currentlyWorkingIn}</span>
                                                        </div>
                                                    )}
                                                    {profile.maxQualification && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <GraduationCap className="w-3 h-3 text-gray-400" />
                                                            <span className="truncate max-w-xs">{profile.maxQualification}</span>
                                                        </div>
                                                    )}
                                                    {!profile.currentlyWorkingIn && !profile.maxQualification && (
                                                        <span className="text-gray-400 italic">No professional info</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {profile.resumeLink ? (
                                                    <a
                                                        href={profile.resumeLink}
                                                        target="_blank"
                                                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 hover:underline computed"
                                                    >
                                                        <Download className="w-4 h-4" /> Resume
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No Resume Link</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No applicants yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import { Building, MapPin, Phone, Mail, Globe, Link as LinkIcon, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ConsultantProfileView({ consultant, canEdit = false }) {
    if (!consultant) return null;

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">

            {/* Header Info */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm relative">
                        {consultant.logo_url ? (
                            <img src={consultant.logo_url} alt={consultant.brand_name || 'Consultant'} className="w-full h-full object-cover" />
                        ) : (
                            <Building className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                            {consultant.brand_name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wide">
                                Consultant
                            </span>
                            <p className="text-sm text-gray-600 font-medium">
                                {consultant.name} (Owner/Contact)
                            </p>
                        </div>
                    </div>
                </div>

                {canEdit && (
                    <Link
                        href={`/consultants/${consultant._id}/edit`}
                        className="hidden sm:flex px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm items-center gap-2"
                    >
                        <Edit className="w-4 h-4" /> Edit Profile
                    </Link>
                )}
            </div>

            {/* Contact & Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Info */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Details</h3>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="font-medium">{consultant.phone || 'Not provided'}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="font-medium">{consultant.email}</span>
                    </div>

                    {consultant.website_url && (
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                <Globe className="w-4 h-4 text-amber-600" />
                            </div>
                            <a href={consultant.website_url} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium truncate">
                                {consultant.website_url.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                </div>

                {/* Location Info */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Operating Location
                    </h3>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
                        {consultant.address_line1 && `${consultant.address_line1}, `}
                        {consultant.address_line2 && `${consultant.address_line2}, `}
                        <br />
                        {consultant.city && `${consultant.city}, `}
                        {consultant.state} {consultant.pincode}
                    </p>
                </div>
            </div>

            {/* Description */}
            {consultant.description && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About Firm</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {consultant.description}
                    </p>
                </div>
            )}

            {/* Mobile Edit Button */}
            {canEdit && (
                <Link
                    href={`/consultants/${consultant._id}/edit`}
                    className="sm:hidden w-full flex justify-center items-center gap-2 py-3 mt-4 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm"
                >
                    <Edit className="w-4 h-4" /> Edit Profile
                </Link>
            )}

        </div>
    );
}

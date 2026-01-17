import Link from 'next/link';
import {
  MapPin, Phone, Mail, Globe, Calendar, Users,
  Home, BookOpen, CheckCircle, Edit, Flag, Award,
  School, Trophy, LayoutGrid, DollarSign
} from 'lucide-react';

export default function SchoolProfileView({ school }) {
  if (!school) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      {/* Header / Cover */}
      <div className="h-40 bg-gradient-to-r from-blue-700 to-indigo-600 relative">
        <div className="absolute top-4 right-4 z-10">
          <Link href={`/schools/${school._id}/edit`}>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm flex items-center transition-all border border-white/20">
              <Edit className="w-4 h-4 mr-2" /> Edit Profile
            </button>
          </Link>
        </div>

        {/* Abstract Shapes/Pattern for visual interest */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-60 h-60 rounded-full bg-white blur-3xl"></div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
          {/* Logo Container */}
          <div className="w-28 h-28 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-center border border-gray-100 flex-shrink-0 relative z-10">
            {school.logo_url ? (
              <img src={school.logo_url} alt="Logo" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <School className="w-12 h-12 text-blue-600" />
            )}
          </div>

          {/* Title & Badges */}
          <div className="flex-1 pt-2 md:pt-0 md:pb-2">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">{school.name}</h2>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-gray-600">
              {school.city && (
                <span className="flex items-center text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> {school.city}, {school.state}
                </span>
              )}
              {school.founded_year && (
                <span className="flex items-center text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> Est. {school.founded_year}
                </span>
              )}
              {school.student_count && (
                <span className="flex items-center text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                  <Users className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> {school.student_count} Students
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Academics */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 transition-hover">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Board</p>
                <p className="font-semibold text-gray-900 truncate" title={school.board?.join(', ')}>{school.board?.join(', ') || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 transition-hover">
                <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Medium</p>
                <p className="font-semibold text-gray-900 truncate" title={school.medium?.join(', ')}>{school.medium?.join(', ') || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 transition-hover">
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Class Range</p>
                <p className="font-semibold text-gray-900 truncate">{school.class_range || '-'}</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-100 transition-hover">
                <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Type</p>
                <p className="font-semibold text-gray-900 truncate">{school.school_type || 'Co-ed'}</p>
              </div>
            </div>

            {/* About Section */}
            {(school.description_short || school.description_long) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> About School
                </h3>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-gray-700 leading-relaxed text-sm">
                  {school.description_long || school.description_short || "No description provided."}
                </div>
              </div>
            )}

            {/* Facilities Grid */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> Key Facilities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'smart_classes', label: 'Smart Classes', icon: '💻' },
                  { key: 'library', label: 'Library', icon: '📚' },
                  { key: 'labs', label: 'Laboratories', icon: '🔬' },
                  { key: 'sports_ground', label: 'Sports Ground', icon: '⚽' },
                  { key: 'swimming_pool', label: 'Swimming Pool', icon: '🏊' },
                  { key: 'auditorium', label: 'Auditorium', icon: '🎭' },
                  { key: 'transport_available', label: 'Transport', icon: '🚌' },
                  { key: 'cctv', label: 'CCTV Security', icon: '📷' },
                  { key: 'hostel_support', label: 'Hostel', icon: '🛏️' },
                  { key: 'cafeteria', label: 'Cafeteria', icon: '🍎' },
                  { key: 'ac_classrooms', label: 'AC Classrooms', icon: '❄️' }
                ].filter(f => school[f.key]).map((f) => (
                  <div key={f.key} className="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-lg mr-3">{f.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{f.label}</span>
                  </div>
                ))}
                {(!school.smart_classes && !school.library && !school.labs && !school.sports_ground) && (
                  <p className="text-gray-500 text-sm italic col-span-full">No facilities listed.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Info */}
          <div className="space-y-6">

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b pb-3 mb-4">Contact Info</h3>

              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-blue-100 transition-colors">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Phone</p>
                    <p className="text-sm text-gray-900 font-medium">{school.phone_primary}</p>
                    {school.phone_secondary && <p className="text-sm text-gray-900">{school.phone_secondary}</p>}
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-blue-100 transition-colors">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Email</p>
                    <p className="text-sm text-gray-900 font-medium break-all">{school.email}</p>
                  </div>
                </div>

                {school.website_url && (
                  <div className="flex items-start group">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-blue-100 transition-colors">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Website</p>
                      <a href={school.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-medium break-all">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start group">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-blue-100 transition-colors">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Address</p>
                    <p className="text-sm text-gray-900">
                      {school.address_line1}
                      {school.address_line2 && <><br />{school.address_line2}</>}
                      <br />
                      {school.city}, {school.state} - {school.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Structure Card */}
            {(school.fee_range_min || school.fee_range_max) && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
                <h3 className="text-sm font-bold text-green-800 uppercase tracking-widest border-b border-green-200 pb-3 mb-4 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" /> Annual Fees
                </h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-700">
                    {school.fee_range_min ? `₹${school.fee_range_min.toLocaleString()}` : 'N/A'}
                    <span className="text-sm text-green-600 font-normal mx-2">to</span>
                    {school.fee_range_max ? `₹${school.fee_range_max.toLocaleString()}` : 'N/A'}
                  </p>
                  <p className="text-xs text-green-600 mt-2">*Fees may vary based on class</p>
                </div>
              </div>
            )}

            {/* Admission Process */}
            {school.admission_process && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b pb-3 mb-4 flex items-center">
                  <LayoutGrid className="w-4 h-4 mr-2 text-gray-500" /> Admission
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed min-h-[60px]">
                  {school.admission_process}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

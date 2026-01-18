import React, { useState } from 'react';
import Link from 'next/link';
import ReviewSection from '@/components/ReviewSection';
import {
  MapPin, Phone, Globe, User, CheckCircle, Mail, Award, BookOpen, Users,
  Building, Star, Download, Edit, Banknote, Clock, Share2, Heart,
  ChevronRight, Trophy, GraduationCap
} from 'lucide-react';

export default function CoachingProfileView({ coaching, canEdit }) {
  if (!coaching) return null;

  const [activeTab, setActiveTab] = useState('overview');

  // Fallbacks for backward compatibility
  const name = coaching.name || coaching.instituteName;
  const description = coaching.description_long || coaching.description;
  const address = coaching.address_line1 || coaching.location
    ? `${coaching.address_line1 || ''} ${coaching.city || ''} ${coaching.state || ''}`
    : coaching.location;

  const quickStats = [
    { label: 'Students', value: coaching.student_count ? `${coaching.student_count}+` : null, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Faculty', value: coaching.faculty_count ? `${coaching.faculty_count}+` : null, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Selections', value: (coaching.selection_count_neet || coaching.selection_count_jee) ? `${(coaching.selection_count_neet || 0) + (coaching.selection_count_jee || 0)}+` : null, icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Rating', value: '4.8', icon: Star, color: 'text-green-600', bg: 'bg-green-50' },
  ].filter(s => s.value);

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans text-gray-700">

      {/* 1. HERO HEADER */}
      <div className="relative bg-white shadow-sm border-b">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-900 to-indigo-900 relative overflow-hidden">
          {coaching.cover_image_url ? (
            <img src={coaching.cover_image_url} alt="Cover" className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Info Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-end">

            {/* Logo */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
                {coaching.logo_url ? (
                  <img src={coaching.logo_url} alt={name} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-4xl font-bold">
                    {name?.charAt(0)}
                  </div>
                )}
              </div>
              {coaching.is_verified && (
                <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Institute">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {coaching.brand_name && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm">
                    {coaching.brand_name}
                  </span>
                )}
                {coaching.mode?.map(m => (
                  <span key={m} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                    {m}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2 drop-shadow-sm md:drop-shadow-none md:text-gray-900 text-white md:bg-transparent">
                {name}
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600 mt-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{address || "Location not provided"}</span>
                </div>
                {coaching.website_url && (
                  <a href={coaching.website_url} target="_blank" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                    <Globe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-2">
              {canEdit ? (
                <Link href={`/coaching/${coaching._id}/edit`} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all">
                  <Edit className="w-4 h-4" /> Edit Profile
                </Link>
              ) : (
                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  <Phone className="w-4 h-4" /> Contact Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-200 transition-colors">
                  <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-2`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* About Section */}
            {(description || coaching.description_short) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" /> About Institute
                </h3>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                  <p>{description || coaching.description_short}</p>
                </div>

                {/* Additional Tags */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                  {coaching.streams?.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Courses Offered */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" /> Courses Offered
              </h3>

              {coaching.course_categories && Object.keys(coaching.course_categories).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(coaching.course_categories).map(([category, items]) => (
                    <div key={category} className="bg-gray-50/50 rounded-xl p-5 border border-gray-200/60">
                      <h4 className="font-bold text-gray-800 mb-3 text-base flex items-center">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2 px-2">
                        {Array.isArray(items) && items.map((item, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded shadow-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No specific courses listed.</p>
              )}
            </div>

            {/* Facilities Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" /> Facilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['ac_classrooms', 'smart_classes', 'library', 'wifi', 'study_room', 'hostel_support'].map(key => (
                  coaching[key] && (
                    <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Results Section */}
            {coaching.top_results?.length > 0 && (
              <div className="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-xl shadow-lg p-6 md:p-8 text-white">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" /> Top Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coaching.top_results.slice(0, 4).map((res, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/20 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{res.name}</h4>
                          <p className="text-blue-200 text-sm">{res.exam}</p>
                        </div>
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                          Rank {res.rank_or_score}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-blue-200 font-mono">Year: {res.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ReviewSection entityId={coaching._id} entityType="coaching" initialReviews={coaching.reviews || []} canReply={canEdit} />
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="space-y-6">

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Contact Information</h3>

              <div className="space-y-4">
                {coaching.phone_primary && (
                  <a href={`tel:${coaching.phone_primary}`} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 group transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
                      <Phone className="w-5 h-5 text-gray-500 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                      <p className="font-semibold text-gray-800 group-hover:text-blue-700">{coaching.phone_primary}</p>
                    </div>
                  </a>
                )}
                {coaching.email && (
                  <a href={`mailto:${coaching.email}`} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 group transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
                      <Mail className="w-5 h-5 text-gray-500 group-hover:text-white" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
                      <p className="font-semibold text-gray-800 group-hover:text-blue-700 truncate">{coaching.email}</p>
                    </div>
                  </a>
                )}
                {coaching.whatsapp_number && (
                  <a href={`https://wa.me/${coaching.whatsapp_number}`} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-green-50 group transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-green-600 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500 group-hover:text-white fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">WhatsApp</p>
                      <p className="font-semibold text-gray-800 group-hover:text-green-700">Chat Now</p>
                    </div>
                  </a>
                )}
              </div>

              {coaching.enquiry_link && (
                <a href={coaching.enquiry_link} target="_blank" className="mt-6 block w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-center rounded-xl shadow-lg transition transform hover:-translate-y-0.5">
                  Enquire Now
                </a>
              )}
            </div>

            {/* Fee Structure Mini Card */}
            {(coaching.course_fees?.length > 0 || coaching.fee_range_min) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-gray-400" /> Fees
                </h3>

                {coaching.fee_range_min && (
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {coaching.currency} {coaching.fee_range_min.toLocaleString()}
                    </span>
                    {coaching.fee_range_max && <span className="text-gray-500"> - {coaching.fee_range_max.toLocaleString()}</span>}
                    <span className="text-xs text-gray-500 block">per year (approx)</span>
                  </div>
                )}

                {coaching.course_fees?.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600">{f.course_name}</span>
                    <span className="font-semibold text-gray-900">{f.fee}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Download Brochure */}
            {coaching.brochure_pdf_url && (
              <a href={coaching.brochure_pdf_url} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
                <Download className="w-4 h-4" /> Download Brochure
              </a>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

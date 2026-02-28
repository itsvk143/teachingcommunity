import React, { useState } from 'react';
import Link from 'next/link';
import ContactRevealCard from '@/components/ContactRevealCard';
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
    { label: 'Students', value: coaching.student_count ? `${coaching.student_count}+` : null, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
    { label: 'Faculty', value: coaching.faculty_count ? `${coaching.faculty_count}+` : null, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' },
    { label: 'Selections', value: (coaching.selection_count_neet || coaching.selection_count_jee) ? `${(coaching.selection_count_neet || 0) + (coaching.selection_count_jee || 0)}+` : null, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
    { label: 'Rating', value: coaching.platform_rating > 0 ? coaching.platform_rating.toFixed(1) : 'New', icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  ].filter(s => s.value);

  const renderContactCard = (className = "") => (
    <div className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 ${className}`}>
      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Contact Information</h3>

      <div className="space-y-4">
        {coaching.phone_primary && (
          <ContactRevealCard
            phone={coaching.phone_primary}
            visibility={coaching.contact_visibility}
            canView={canEdit}
          />
        )}
        {coaching.email && (coaching.contact_visibility === 'everyone' || canEdit) && (
          <a href={`mailto:${coaching.email}`} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 group transition-all border border-transparent hover:border-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-indigo-600 transition-colors group-hover:shadow-indigo-200 group-hover:shadow-lg">
              <Mail className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Email</p>
              <p className="font-semibold text-slate-800 group-hover:text-indigo-700 truncate">{coaching.email}</p>
            </div>
          </a>
        )}
        {coaching.whatsapp_number && (coaching.contact_visibility === 'everyone' || canEdit) && (
          <a href={`https://wa.me/${coaching.whatsapp_number}`} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 group transition-all border border-transparent hover:border-emerald-100">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-emerald-500 transition-colors group-hover:shadow-emerald-200 group-hover:shadow-lg">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-400 group-hover:text-white fill-current transition-colors"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">WhatsApp</p>
              <p className="font-semibold text-slate-800 group-hover:text-emerald-700">Chat Now</p>
            </div>
          </a>
        )}
      </div>

      {coaching.enquiry_link && (
        <a href={coaching.enquiry_link} target="_blank" className="mt-8 block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-center rounded-2xl shadow-[0_4px_14px_0_rgb(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] transition-all transform hover:-translate-y-0.5 active:scale-95">
          Enquire Now
        </a>
      )}
    </div>
  );

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
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">

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

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
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
            <div className="flex gap-3 mb-2 md:mb-0">
              {canEdit ? (
                <Link href={`/coaching/${coaching._id}/edit`} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95">
                  <Edit className="w-4 h-4" /> Edit Profile
                </Link>
              ) : (
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 active:scale-95">
                  <Phone className="w-4 h-4" /> Contact Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS BAR (Floating) */}
      {quickStats.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 md:p-3 grid grid-cols-2 lg:flex lg:justify-around gap-4 md:gap-2">
            {quickStats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 px-2 md:px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.bg} ${stat.border} border flex items-center justify-center shadow-inner shrink-0`}>
                  <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-lg md:text-2xl font-black text-slate-800 leading-none truncate">{stat.value}</div>
                  <div className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-2 space-y-8">

            {/* MOBILE ONLY CONTACT BLOCK */}
            {renderContactCard("block lg:hidden")}



            {/* Courses Offered */}
            <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 p-4 sm:p-6 md:p-10">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                Courses Offered
              </h3>

              {coaching.categories && coaching.categories.length > 0 ? (
                <div className="space-y-6">
                  {coaching.categories.map((cat, idx) => (
                    <div key={idx} className="bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-200/60 transition hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:-translate-y-1 duration-300 group">
                      <h4 className="font-bold text-slate-900 mb-5 text-lg flex items-center">
                        <span className="w-2 h-8 bg-indigo-500 rounded-full mr-4 group-hover:scale-y-110 transition-transform"></span>
                        {cat.key === 'SCHOOL_TUTION' ? 'FOUNDATION' : cat.key.replace(/_/g, ' ')}
                      </h4>
                      {
                        cat.exams && cat.exams.length > 0 && (
                          <div className="mb-4 space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Exams & Courses</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {cat.exams.map((examObj, i) => {
                                // Support both string (old) and object (new) structure
                                let examName = typeof examObj === 'string' ? examObj : examObj.name;
                                if (examName === 'Other' && examObj.custom_name) {
                                  examName = examObj.custom_name;
                                }
                                const courses = typeof examObj === 'object' ? examObj.courses : [];

                                return (
                                  <div key={i} className="bg-white border border-indigo-100/50 rounded-xl p-4 shadow-sm group-hover:border-indigo-200 transition-colors">
                                    <h5 className="text-sm font-bold text-indigo-900 mb-3">{examName}</h5>
                                    {courses && courses.length > 0 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {courses.map((courseObj, k) => {
                                          let cName = typeof courseObj === 'string' ? courseObj : courseObj.name;
                                          const cCustom = typeof courseObj === 'string' ? null : courseObj.custom_name;

                                          if (cName === 'Other' && cCustom) cName = cCustom;

                                          return (
                                            <span key={k} className="px-3 py-1 bg-indigo-50/80 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100/50 transition-colors hover:bg-indigo-100">
                                              {cName}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-400 italic">No specific courses listed</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      }

                      {/* Subjects */}
                      {
                        cat.subjects && cat.subjects.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subjects</p>
                            <div className="flex flex-wrap gap-2">
                              {cat.subjects.map((subj, j) => (
                                <span key={j} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded border border-green-100">
                                  {subj}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    </div>
                  ))}
                </div>
              ) : coaching.course_categories && Object.keys(coaching.course_categories).length > 0 ? (
                // Legacy Fallback
                <div className="space-y-6">
                  {Object.entries(coaching.course_categories).map(([category, items]) => (
                    <div key={category} className="bg-gray-50/50 rounded-xl p-5 border border-gray-200/60">
                      <h4 className="font-bold text-gray-800 mb-3 text-base flex items-center">
                        <span className="w-1.5 h-6 bg-gray-400 rounded-full mr-3"></span>
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
            <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 p-4 sm:p-6 md:p-10">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Building className="w-5 h-5 text-emerald-600" />
                </div>
                Facilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {['ac_classrooms', 'smart_classes', 'library', 'wifi', 'study_room', 'hostel_support'].map(key => (
                  coaching[key] && (
                    <div key={key} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 capitalize tracking-wide">{key.replace(/_/g, ' ')}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Star Faculty Section */}
            {coaching.top_faculties?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" /> Star Faculty
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coaching.top_faculties.map((fac, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                      {fac.photo_url ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                          <img src={fac.photo_url} alt={fac.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-sm shrink-0">
                          {fac.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm md:text-base">{fac.name}</h4>
                        <p className="text-sm text-blue-700 font-medium">{fac.subject}</p>
                        <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                          {fac.experience && <span>{fac.experience} Exp</span>}
                          {fac.teacher_id && (
                            <>
                              <span>•</span>
                              <span className="font-mono bg-white px-1.5 rounded border">ID: {fac.teacher_id}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Section */}
            {coaching.top_results?.length > 0 && (
              <div className="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-white">
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

            {/* About Section */}
            {(description || coaching.description_short) && (
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 p-4 sm:p-6 md:p-10">
                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  About Institute
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base md:text-lg">
                  <p>{description || coaching.description_short}</p>
                </div>

                {/* Additional Tags */}
                {coaching.streams?.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                    {coaching.streams.map((s, i) => (
                      <span key={i} className="px-4 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-sm font-semibold tracking-wide transition-colors hover:bg-slate-100">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <ReviewSection entityId={coaching._id} entityType="coaching" initialReviews={coaching.reviews || []} canReply={canEdit} />
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="space-y-8">

            {/* Contact Card */}
            {renderContactCard("hidden lg:block sticky top-24")}

            {/* Fee Structure Mini Card */}
            {(coaching.course_fees?.length > 0 || coaching.fee_range_min) && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 mt-8">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-500" /> Fees
                </h3>

                {coaching.fee_range_min && (
                  <div className="mb-4">
                    <span className="text-2xl font-black text-slate-900">
                      {coaching.currency} {coaching.fee_range_min.toLocaleString()}
                    </span>
                    {coaching.fee_range_max && <span className="text-slate-500 font-medium"> - {coaching.fee_range_max.toLocaleString()}</span>}
                    <span className="text-xs text-slate-500 font-medium block mt-1 uppercase tracking-wider">per year (approx)</span>
                  </div>
                )}

                {coaching.course_fees?.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex justify-between text-sm py-3 border-b border-slate-50 last:border-0 group">
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{f.course_name}</span>
                    <span className="font-bold text-slate-900">{f.fee}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Download Brochure */}
            {coaching.brochure_pdf_url && (
              <a href={coaching.brochure_pdf_url} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-bold tracking-wide rounded-2xl transition-all">
                <Download className="w-5 h-5" /> Download Brochure
              </a>
            )}

          </div>
        </div>
      </div>
    </div >
  );
}

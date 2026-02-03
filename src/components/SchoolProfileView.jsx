"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Phone, Mail, Globe, Calendar, Users,
  Home, BookOpen, CheckCircle, Edit, Flag, Award,
  School, Trophy, LayoutGrid, IndianRupee, Video, Image as ImageIcon,
  Shield, AlertTriangle, Bus, Clock, UserCheck, Linkedin, Facebook, Instagram, Twitter, Youtube,
  MessageSquare
} from 'lucide-react';
import ReviewSection from '@/components/ReviewSection';

export default function SchoolProfileView({ school }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!school) return null;

  const socialLinks = [
    { key: 'facebook', icon: Facebook, color: 'text-blue-600', label: 'Facebook' },
    { key: 'instagram', icon: Instagram, color: 'text-pink-600', label: 'Instagram' },
    { key: 'twitter', icon: Twitter, color: 'text-sky-500', label: 'Twitter' },
    { key: 'linkedin', icon: Linkedin, color: 'text-blue-700', label: 'LinkedIn' },
    { key: 'youtube', icon: Youtube, color: 'text-red-600', label: 'YouTube' }
  ];

  const facilities = [
    { key: 'smart_classes', label: 'Smart Classes', icon: '💻' },
    { key: 'library', label: 'Library', icon: '📚' },
    { key: 'science_labs', label: 'Science Labs', icon: '🔬' },
    { key: 'computer_lab', label: 'Computer Lab', icon: '🖥️' },
    { key: 'playground', label: 'Large Playground', icon: '⚽' },
    { key: 'indoor_games', label: 'Indoor Games', icon: '🏓' },
    { key: 'swimming_pool', label: 'Swimming Pool', icon: '🏊' },
    { key: 'auditorium', label: 'Auditorium', icon: '🎭' },
    { key: 'transport_facility', label: 'Transport', icon: '🚌' },
    { key: 'hostel_facility', label: 'Hostel', icon: '🛏️' },
    { key: 'cctv', label: 'CCTV Security', icon: '📷' },
    { key: 'ac_classrooms', label: 'AC Classrooms', icon: '❄️' },
    { key: 'cafeteria', label: 'Cafeteria', icon: '🍎' },
    { key: 'medical_room', label: 'Medical Room', icon: '🩺' },
    { key: 'accessibility_ramp', label: 'Ramps/Lifts', icon: '♿' },
  ];

  const safetyFeatures = [
    { key: 'security_guard', label: 'Security Guard', icon: Shield },
    { key: 'fire_safety', label: 'Fire Safety', icon: AlertTriangle },
    { key: 'first_aid', label: 'First Aid', icon: Award },
    { key: 'female_staff', label: 'Female Staff', icon: UserCheck },
    { key: 'bus_attendant', label: 'Bus Attendant', icon: Bus },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'facilities', label: 'Facilities', icon: Trophy },
    { id: 'admissions', label: 'Admissions', icon: CheckCircle },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans min-h-[800px]">

      {/* --- HERO HEADER --- */}
      <div className="relative h-64 bg-slate-900">
        {school.cover_image_url ? (
          <img src={school.cover_image_url} alt="Cover" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 opacity-90" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col md:flex-row items-end gap-6">
          {/* Logo */}
          <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl p-2 flex items-center justify-center -mb-12 border-4 border-white relative z-10 shrink-0">
            {school.logo_url ? (
              <img src={school.logo_url} alt="Logo" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <School className="w-16 h-16 text-blue-900" />
            )}
          </div>

          {/* Title Info */}
          <div className="flex-1 text-white pb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight shadow-sm">{school.name}</h1>
            {school.tagline && <p className="text-blue-200 text-lg mt-1 font-medium italic">"{school.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-slate-300">
              {school.city && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-blue-400" /> {school.city}, {school.state}</span>}
              {school.founded_year && <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-blue-400" /> Est. {school.founded_year}</span>}
              <span className="flex items-center bg-blue-600/20 px-2 py-0.5 rounded text-blue-300 border border-blue-500/30">
                {school.school_type || 'School'} • {school.category || 'Private'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-2">
            <Link href={`/schools/${school._id}/edit`}>
              <button className="bg-white text-slate-900 hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg flex items-center transition-all">
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="mt-16 px-6 border-b border-gray-100 overflow-x-auto selection-none">
        <div className="flex gap-6 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-800'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-6 md:p-8 bg-gray-50/30 min-h-[500px]">

        {/* === OVERVIEW TAB === */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Left Main */}
            <div className="lg:col-span-2 space-y-8">

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Students" value={school.student_count} sub="Enrolled" color="bg-blue-50 text-blue-700" />
                <StatCard label="Teachers" value={school.teacher_count} sub="Staff" color="bg-purple-50 text-purple-700" />
                <StatCard label="Ratio" value={school.student_teacher_ratio || "N/A"} sub="Student:Teacher" color="bg-orange-50 text-orange-700" />
                <StatCard label="Board" value={school.board?.[0] || "N/A"} sub="Affiliation" color="bg-green-50 text-green-700" />
              </div>

              {/* About & Vision */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center"><BookOpen className="w-5 h-5 text-blue-500 mr-2" /> About Us</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {school.description_long || school.description_short || "Information coming soon."}
                  </p>
                </div>

                {(school.vision || school.mission) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                    {school.vision && (
                      <div className="bg-blue-50/50 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-800 mb-2">Our Vision</h4>
                        <p className="text-sm text-gray-700 italic">"{school.vision}"</p>
                      </div>
                    )}
                    {school.mission && (
                      <div className="bg-green-50/50 p-4 rounded-lg">
                        <h4 className="font-bold text-green-800 mb-2">Our Mission</h4>
                        <p className="text-sm text-gray-700 italic">"{school.mission}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Principal Message */}
              {(school.principal_message || school.principal_name) && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                  {school.principal_photo_url ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-gray-100 mx-auto md:mx-0">
                      <img src={school.principal_photo_url} alt={school.principal_name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Principal's Desk</h3>
                    <p className="font-medium text-blue-600 mb-3 text-sm">{school.principal_name} <span className="text-gray-400 font-normal ml-1 text-xs">{school.principal_qualification}</span></p>
                    <p className="text-gray-600 text-sm italic">"{school.principal_message || 'Welcome to our school profile.'}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Quick Info</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between"><span className="text-gray-500">Board</span> <span className="font-medium">{school.board?.join(', ')}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Medium</span> <span className="font-medium">{school.medium?.join(', ')}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">School Code</span> <span className="font-medium">{school.school_code || '-'}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Founded</span> <span className="font-medium">{school.founded_year || '-'}</span></li>
                  <li className="flex justify-between"><span className="text-gray-500">Gender</span> <span className="font-medium">{school.gender_type}</span></li>
                </ul>
              </div>

              {/* Socials */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Connect</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(s => {
                    const link = school.social_links?.[s.key];
                    if (!link) return null;
                    return (
                      <a key={s.key} href={link} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors ${s.color}`}>
                        <s.icon className="w-5 h-5" />
                      </a>
                    )
                  })}
                  {(!school.social_links || Object.values(school.social_links).every(x => !x)) && <p className="text-gray-400 text-sm">No social links added.</p>}
                </div>
                {school.website_url && (
                  <a href={school.website_url} target="_blank" className="mt-4 block w-full text-center py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 text-sm">
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === ACADEMICS TAB === */}
        {activeTab === 'academics' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Flag className="w-5 h-5 text-red-500 mr-2" /> Streams Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {school.streams_offered?.length > 0 ? school.streams_offered.map(s => (
                    <span key={s} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium">{s}</span>
                  )) : <p className="text-gray-500">Not listed</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Calendar className="w-5 h-5 text-blue-500 mr-2" /> Academic Info</h3>
                <div className="space-y-3">
                  <p className="text-sm"><span className="text-gray-500 w-32 inline-block">Session:</span> <span className="font-medium">{school.academic_session || '-'}</span></p>
                  <p className="text-sm"><span className="text-gray-500 w-32 inline-block">Class Range:</span> <span className="font-medium">{school.class_range || '-'}</span></p>
                  <p className="text-sm"><span className="text-gray-500 w-32 inline-block">Exam Pattern:</span> <span className="font-medium">{school.examination_pattern || '-'}</span></p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Trophy className="w-5 h-5 text-yellow-500 mr-2" /> Achievements & Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-yellow-50/50 rounded-lg border border-yellow-100">
                  <h4 className="font-bold text-yellow-800 mb-2">Academic</h4>
                  <p className="text-sm text-gray-700">{school.academic_achievements || "No data"}</p>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-2">Sports</h4>
                  <p className="text-sm text-gray-700">{school.sports_achievements || "No data"}</p>
                </div>
                <div className="p-4 bg-green-50/50 rounded-lg border border-green-100">
                  <h4 className="font-bold text-green-800 mb-2">Board Results</h4>
                  <p className="text-sm text-gray-700">{school.board_results || "No data"}</p>
                </div>
              </div>

              {school.toppers_list?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-3">Student Toppers</h4>
                  <div className="flex flex-wrap gap-3">
                    {school.toppers_list.map((t, i) => <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">🏆 {t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === FACILITIES TAB === */}
        {activeTab === 'facilities' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {facilities.map((f) => {
                const hasFacility = school[f.key];
                return (
                  <div key={f.key} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${hasFacility ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                    }`}>
                    <span className="text-3xl mb-2">{f.icon}</span>
                    <span className={`text-sm font-medium text-center leading-tight ${hasFacility ? 'text-gray-900' : 'text-gray-400'}`}>{f.label}</span>
                    {!hasFacility && <span className="text-[10px] text-gray-400 mt-1 uppercase">Not Avail</span>}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Campus Area</p>
                <p className="text-xl font-bold text-gray-900">{school.campus_area || 'N/A'}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Classrooms</p>
                <p className="text-xl font-bold text-gray-900">{school.classroom_count || 'N/A'}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">School Buses</p>
                <p className="text-xl font-bold text-gray-900">{school.bus_count || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* === ADMISSIONS TAB === */}
        {activeTab === 'admissions' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-green-900 flex items-center"><IndianRupee className="w-5 h-5 mr-1" /> Fee Structure</h3>
                  <p className="text-green-700 text-sm">Estimated annual costs</p>
                </div>
                {school.admission_open && (
                  <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md animate-pulse">
                    Admissions Open
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FeeCard label="Admission Fee" amount={school.admission_fee} />
                <FeeCard label="Monthly Fee" amount={school.monthly_fee} />
                <FeeCard label="Annual Charges" amount={school.annual_charges} />
                <FeeCard label="Transport Fee" amount={school.transport_fee} sub="/ month" />
              </div>
              <p className="text-center text-green-700/60 text-xs mt-6">* Fees are indicative and subject to change. Contact school for final details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-500" /> Timeline</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Admission Starts</span>
                    <span className="font-medium text-gray-900">{formatDate(school.admission_start_date)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-600">Admission Ends</span>
                    <span className="font-medium text-gray-900">{formatDate(school.admission_end_date)}</span>
                  </div>
                </div>
                {school.online_form_link && (
                  <a href={school.online_form_link} target="_blank" className="mt-6 block w-full bg-blue-600 text-white text-center py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors">
                    Apply Online
                  </a>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center"><BookOpen className="w-4 h-4 mr-2 text-blue-500" /> Process & Eligibility</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Eligibility Criteria:</p>
                    <p>{school.eligibility_criteria || "Contact school"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Admission Process:</p>
                    <p>{school.admission_process || "Contact school"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === GALLERY TAB === */}
        {activeTab === 'gallery' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><ImageIcon className="w-5 h-5 mr-2 text-purple-600" /> Photo Gallery</h3>
            {school.gallery_images?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {school.gallery_images.map((img, idx) => (
                  <div key={idx} className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-400">No photos added to gallery yet.</p>
              </div>
            )}

            {school.video_gallery?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><Video className="w-5 h-5 mr-2 text-red-600" /> Videos</h3>
                <div className="space-y-2">
                  {school.video_gallery.map((vid, idx) => (
                    <a key={idx} href={vid} target="_blank" className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors">
                      <Video className="w-4 h-4 mr-3 text-red-500" /> {vid}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === REVIEWS TAB === */}
        {activeTab === 'reviews' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ReviewSection
              entityId={school._id}
              entityType="school"
              initialReviews={school.platform_reviews || []}
              canReply={true} // School admin/owner can reply logic handled in component via session
            />
          </div>
        )}

        {/* === CONTACT TAB === */}
        {activeTab === 'contact' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Details */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="font-bold text-gray-900 mb-2">Contact Information</h3>

                <ContactItem icon={Phone} label="Primary Phone" value={school.phone_primary} />
                <ContactItem icon={Phone} label="Secondary Phone" value={school.phone_secondary} />
                <ContactItem icon={Mail} label="Email" value={school.email} />
                <ContactItem icon={Globe} label="Website" value={school.website_url} isLink />

                <div className="pt-4 border-t border-gray-50 mt-4">
                  <p className="font-medium text-gray-900 mb-2">Address</p>
                  <p className="text-gray-600 text-sm">{school.address_line1}, {school.address_line2}</p>
                  <p className="text-gray-600 text-sm">{school.city}, {school.district}, {school.state} - {school.pincode}</p>
                  {school.landmark && <p className="text-gray-500 text-xs mt-1">Landmark: {school.landmark}</p>}
                </div>
              </div>

              {/* Safety Features */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center"><Shield className="w-5 h-5 text-green-600 mr-2" /> Safety & Security</h3>
                <div className="grid grid-cols-1 gap-4">
                  {safetyFeatures.map(s => (
                    <div key={s.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <s.icon className={`w-5 h-5 ${school[s.key] ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${school[s.key] ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
                      </div>
                      {school[s.key] ? <CheckCircle className="w-5 h-5 text-green-500" /> : <span className="text-xs text-gray-400">No</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Policies & Guidelines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['visitor_entry_policy', 'student_pickup_policy', 'anti_bullying_policy', 'code_of_conduct'].map(p => (
                  school[p] && (
                    <div key={p} className="p-4 border border-gray-100 rounded-lg">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">{p.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-700">{school[p]}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper Components
function StatCard({ label, value, sub, color }) {
  return (
    <div className={`p-4 rounded-xl border border-white/50 shadow-sm ${color}`}>
      <p className="text-2xl font-bold">{value || 0}</p>
      <p className="text-xs font-bold uppercase opacity-80 mt-1">{label}</p>
      <p className="text-xs opacity-60 mt-0.5 font-medium">{sub}</p>
    </div>
  );
}

function FeeCard({ label, amount, sub }) {
  return (
    <div className="bg-white/60 p-4 rounded-lg border border-green-100 text-center">
      <p className="text-green-800 text-xs font-bold uppercase">{label}</p>
      <p className="text-xl font-bold text-green-700 mt-1">
        {amount ? `₹${amount.toLocaleString()}` : '-'}
        {sub && <span className="text-xs font-normal text-green-600 ml-1">{sub}</span>}
      </p>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, isLink }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
        {isLink ? (
          <a href={value} target="_blank" className="text-sm font-medium text-blue-600 hover:underline">{value}</a>
        ) : (
          <p className="text-sm font-medium text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

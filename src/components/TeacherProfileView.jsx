import React from 'react';
import {
  Mail, Phone, MapPin, Briefcase, GraduationCap,
  User, FileText, Video, Linkedin,
  Facebook, Instagram, Twitter, MessageCircle, Link as LinkIcon,
  Award, Calendar, CheckCircle2, Building2
} from 'lucide-react';

const getDirectImageUrl = (url) => {
  if (!url) return null;
  if (url.includes('drive.google.com') && url.includes('/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

const ensureAbsoluteUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('/')) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const TeacherProfileView = ({ teacher, canViewSalary }) => {
  if (!teacher) return null;

  const social = teacher.socialLinks || {};
  const validPhotoUrl = getDirectImageUrl(teacher.photoUrl);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const displayAge = calculateAge(teacher.dob) || teacher.age;

  return (
    <div className="bg-gray-50/50 min-h-full font-sans">

      {/* 1. PROFESSIONAL HEADER */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden mb-8 shadow-sm">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 relative">
              {validPhotoUrl ? (
                <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                  <img src={validPhotoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-5xl font-bold shadow-xl ring-4 ring-white">
                  {teacher.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {teacher.isVerified && (
                <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Verified Educator">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 pt-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{teacher.name}</h1>
                <p className="text-lg text-gray-600 font-medium mt-1">{teacher.currentInstitute || "Educator"} {teacher.city && `• ${teacher.city}`}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200">
                  <Briefcase className="w-4 h-4" /> {teacher.subject?.[0] || "General"}
                </span>
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100">
                  <Award className="w-4 h-4" /> {teacher.experience || "0"} Years Exp.
                </span>
                {teacher.state && (
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-emerald-100">
                    <MapPin className="w-4 h-4" /> {teacher.state}
                  </span>
                )}
              </div>

              {/* Connections */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium pt-1">
                {teacher.email && (
                  <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4" /> {teacher.email}
                  </div>
                )}
                {teacher.phone && (
                  <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4" /> +91 {teacher.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {teacher.resumeLink && (
                <a href={teacher.resumeLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-slate-200">
                  <FileText className="w-4 h-4" /> View Resume
                </a>
              )}
              {teacher.teachingVideoLink && (
                <a href={teacher.teachingVideoLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-semibold transition shadow-sm">
                  <Video className="w-4 h-4 text-red-500" /> Demo Video
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* 2. LEFT CONTENT (Experience, Education) - Spans 8 Cols */}
          <div className="lg:col-span-8 space-y-8">

            {/* ABOUT SECTION */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" /> Professional Summary
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {teacher.about || "No professional summary provided."}
              </div>
            </section>

            {/* EXPERIENCE TIMELINE */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" /> Work Experience
              </h2>

              <div className="relative pl-4 border-l-2 border-gray-100 space-y-10">
                {/* Current Role */}
                <div className="relative pl-6">
                  <div className="absolute -left-[25px] top-1 w-10 h-10 bg-indigo-50 rounded-full border-4 border-white flex items-center justify-center text-indigo-600 shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">CURRENTLY WORKING</span>
                    <h3 className="text-lg font-bold text-gray-900">{teacher.currentInstitute || teacher.currentlyWorkingIn || "Not specified"}</h3>
                    <p className="text-gray-500 text-sm mt-1">Current Organization</p>
                    {teacher.ctc && canViewSalary && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-green-100">
                        <span>CTC: {teacher.ctc}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Previous Roles */}
                {teacher.previousInstitutes && (
                  <div className="relative pl-6">
                    <div className="absolute -left-[21px] top-2 w-8 h-8 bg-gray-100 rounded-full border-4 border-white flex items-center justify-center text-gray-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Previous Experience</h3>
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {teacher.previousInstitutes}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* EDUCATION CARDS */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" /> Education
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Max Qual & Graduation Logic */}
                {(() => {
                  const isMaxQualValid = teacher.maxQualification && teacher.maxQualification.trim().toUpperCase() !== 'NA';
                  const showGraduationAsHighest = !isMaxQualValid && teacher.graduationQualification;

                  // Determine what to show in the "Featured" (Highest) slot
                  const featuredTitle = showGraduationAsHighest ? "Highest Qualification" : "Highest Qualification";
                  const featuredValue = showGraduationAsHighest ? teacher.graduationQualification : teacher.maxQualification;
                  const featuredSub = showGraduationAsHighest ? teacher.graduationCollege : teacher.maxQualificationCollege;

                  return (
                    <>
                      {/* Featured (Highest) Qualification Card */}
                      {(isMaxQualValid || showGraduationAsHighest) && (
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 col-span-1 md:col-span-2">
                          <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{featuredTitle}</h4>
                          <h3 className="text-lg font-bold text-gray-900">{featuredValue}</h3>
                          <p className="text-gray-600 text-sm">{featuredSub}</p>
                          {showGraduationAsHighest && teacher.education && (
                            <p className="text-indigo-600/80 text-xs mt-1 font-medium">{teacher.education}</p>
                          )}
                        </div>
                      )}

                      {/* Regular Graduation Card - Only show if Max Qual WAS valid (meaning Grad is secondary) */}
                      {isMaxQualValid && teacher.graduationQualification && (
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Graduation</h4>
                          <h3 className="font-bold text-gray-900">{teacher.graduationQualification}</h3>
                          <p className="text-gray-600 text-sm">{teacher.graduationCollege}</p>
                          {teacher.education && <p className="text-gray-500 text-xs mt-1">{teacher.education}</p>}
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Past Academics */}
                {teacher.educationalQualification?.map((edu, idx) => (
                  <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{edu.qualification}</h4>
                    <h3 className="font-bold text-gray-900">{edu.boardUniv}</h3>
                    {edu.schoolName && (
                      <p className="text-sm text-gray-600 mt-0.5">{edu.schoolName}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-medium text-gray-500">
                      {edu.year && <span>Year: {edu.year}</span>}
                      {edu.percentage && <span>Score: {edu.percentage}</span>}
                      {edu.medium && <span>Medium: {edu.medium}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. RIGHT SIDEBAR (Details, Social) - Spans 4 Cols */}
          <div className="lg:col-span-4 space-y-6">

            {/* Exams Taught Card - Now Above Personal Details */}
            {teacher.exams && teacher.exams.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" /> Exams Taught
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.exams.map((exam, index) => (
                    <span key={index} className="inline-block bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100">
                      {exam}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Details Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Personal Details
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Subject</span>
                  <span className="font-medium text-gray-900 text-right">{teacher.subject?.join(', ')}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Age</span>
                  <span className="font-medium text-gray-900">{displayAge ? `${displayAge} Years` : "-"}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-medium text-gray-900 capitalize">{teacher.gender || "-"}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Native State</span>
                  <span className="font-medium text-gray-900">{teacher.nativeState || "-"}</span>
                </li>
                <li className="pt-2">
                  <div className="text-gray-500 mb-1">Preferred Locations</div>
                  <div className="bg-gray-50 p-2 rounded text-gray-700 text-xs font-medium border border-gray-200">
                    {teacher.preferedState?.join(', ') || "No preference"}
                  </div>
                </li>
              </ul>
            </div>

            {/* Social & Connect */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-500" /> Connect
              </h3>

              {teacher.whatsapp && (
                <a href={`https://wa.me/${teacher.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold transition mb-6 shadow-sm hover:shadow-md">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </a>
              )}

              <div className="grid grid-cols-4 gap-2">
                {social.linkedin && (
                  <a href={ensureAbsoluteUrl(social.linkedin)} target="_blank" className="flex items-center justify-center h-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#0077b5] hover:text-white transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {social.twitter && (
                  <a href={ensureAbsoluteUrl(social.twitter)} target="_blank" className="flex items-center justify-center h-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {social.facebook && (
                  <a href={ensureAbsoluteUrl(social.facebook)} target="_blank" className="flex items-center justify-center h-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#4267B2] hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {social.instagram && (
                  <a href={ensureAbsoluteUrl(social.instagram)} target="_blank" className="flex items-center justify-center h-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default TeacherProfileView;

import React from 'react';
import {
  Mail, Phone, MapPin, Briefcase, GraduationCap,
  User, FileText, Video, Linkedin,
  Facebook, Instagram, Twitter, MessageCircle, Link as LinkIcon
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
    <div className="bg-gray-50/50 pb-12 font-sans w-full">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="px-6 py-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

            {/* AVATAR SECTION */}
            <div className="flex-shrink-0 relative group">
              {validPhotoUrl ? (
                <div className="w-32 h-32 md:w-36 md:h-36 relative ring-4 ring-white shadow-lg rounded-full overflow-hidden">
                  <img
                    src={validPhotoUrl}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-4 ring-white">
                  {teacher.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* INFO SECTION */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight capitalize">{teacher.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 items-center text-gray-600">
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">
                    <Briefcase className="w-3.5 h-3.5" /> {teacher.subject || "Subject N/A"} Faculty
                  </span>
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-100">
                    <GraduationCap className="w-3.5 h-3.5" /> {teacher.experience || 0} Years Exp
                  </span>
                  {teacher.gender && (
                    <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-gray-200">
                      <User className="w-3.5 h-3.5" /> {teacher.gender}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500 pt-2 font-medium">
                {teacher.email && (
                  <div className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <Mail className="w-4 h-4 text-gray-400" /> {teacher.email}
                  </div>
                )}
                {teacher.phone && (
                  <div className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <Phone className="w-4 h-4 text-gray-400" /> +91 {teacher.phone}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              {teacher.resumeLink && (
                <a href={teacher.resumeLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  <FileText className="w-4 h-4" /> Download Resume
                </a>
              )}
              {teacher.teachingVideoLink && (
                <a href={teacher.teachingVideoLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-6 py-2.5 rounded-lg font-semibold transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  <Video className="w-4 h-4 text-red-500" /> Watch Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BODY CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">

            {/* ABOUT */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="w-5 h-5 text-blue-500" /> About
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                {teacher.about || "No bio provided."}
              </div>
            </section>

            {/* EDUCATION */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2 border-b border-gray-100 pb-3">
                <GraduationCap className="w-5 h-5 text-blue-500" /> Education
              </h2>
              <div className="space-y-8 relative">
                <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                {teacher.maxQualification && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-blue-500 shadow-sm z-10"></div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{teacher.maxQualification}</h3>
                      <p className="text-gray-600">{teacher.maxQualificationCollege}</p>
                    </div>
                  </div>
                )}

                {teacher.graduationQualification && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-indigo-400 shadow-sm z-10"></div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{teacher.graduationQualification}</h3>
                      <p className="text-gray-600">{teacher.graduationCollege}</p>
                      {teacher.education && <p className="text-gray-400 text-sm mt-1">{teacher.education}</p>}
                    </div>
                  </div>
                )}

                {teacher.educationalQualification?.map((edu, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-gray-300 shadow-sm z-10"></div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{edu.qualification} <span className="text-gray-400 text-base font-normal">({edu.boardUniv})</span></h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {edu.year && <span className="mr-3">Year: {edu.year}</span>}
                        {edu.percentage && <span className="mr-3">Score: {edu.percentage}</span>}
                        {edu.medium && <span>Medium: {edu.medium}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* EXPERIENCE */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Briefcase className="w-5 h-5 text-blue-500" /> Experience
              </h2>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="text-blue-900 font-bold text-sm uppercase tracking-wider mb-1">Currently Working At</h3>
                  <p className="text-gray-900 text-xl font-bold">{teacher.currentInstitute || teacher.currentlyWorkingIn || "Not specified"}</p>
                  {teacher.ctc && canViewSalary && (
                    <p className="text-green-700 font-semibold mt-2 flex items-center gap-1">
                      <span className="text-xs bg-green-200 px-2 py-0.5 rounded text-green-800">CTC</span> {teacher.ctc}
                    </p>
                  )}
                </div>

                {teacher.previousInstitutes && (
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-3">Previous Experience</h3>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {teacher.previousInstitutes}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" /> Personal Details
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Age</span>
                  <span className="font-semibold text-gray-900">{displayAge ? `${displayAge} Years` : "-"}</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-semibold text-gray-900 capitalize">{teacher.gender || "-"}</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Current State</span>
                  <span className="font-semibold text-gray-900">{teacher.state || "-"}</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Native State</span>
                  <span className="font-semibold text-gray-900">{teacher.nativeState || "-"}</span>
                </li>
                <li className="flex justify-between items-center pt-1">
                  <span className="text-gray-500">Preferred Loc.</span>
                  <span className="font-semibold text-blue-600 text-right">{teacher.preferedState || "-"}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-400" /> Connect
              </h3>

              {teacher.whatsapp && (
                <a href={`https://wa.me/${teacher.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold transition mb-6 shadow-sm hover:shadow-md">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </a>
              )}

              <div className="grid grid-cols-4 gap-2">
                {social.linkedin && (
                  <a href={ensureAbsoluteUrl(social.linkedin)} target="_blank" className="flex items-center justify-center aspect-square bg-gray-50 rounded-xl hover:bg-[#0077b5] hover:text-white transition-all text-gray-600 group">
                    <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {social.twitter && (
                  <a href={ensureAbsoluteUrl(social.twitter)} target="_blank" className="flex items-center justify-center aspect-square bg-gray-50 rounded-xl hover:bg-[#1DA1F2] hover:text-white transition-all text-gray-600 group">
                    <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {social.facebook && (
                  <a href={ensureAbsoluteUrl(social.facebook)} target="_blank" className="flex items-center justify-center aspect-square bg-gray-50 rounded-xl hover:bg-[#4267B2] hover:text-white transition-all text-gray-600 group">
                    <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {social.instagram && (
                  <a href={ensureAbsoluteUrl(social.instagram)} target="_blank" className="flex items-center justify-center aspect-square bg-gray-50 rounded-xl hover:bg-[#E1306C] hover:text-white transition-all text-gray-600 group">
                    <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
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

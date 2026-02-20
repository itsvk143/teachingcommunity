import React from 'react';
import {
  Mail, Phone, MapPin, Briefcase, GraduationCap,
  User, FileText, Calendar, Linkedin, Globe,
  Facebook, Instagram, Twitter, MessageCircle, Link as LinkIcon, Award
} from 'lucide-react';

const ensureAbsoluteUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('/')) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const getDirectImageUrl = (url) => {
  if (!url) return null;
  if (url.includes('drive.google.com') && url.includes('/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

const NonTeacherProfileView = ({ profile, isAdmin = false }) => {
  if (!profile) return null;

  const social = profile.socialLinks || {};
  const showDob = profile.dobVisibility !== 'hr_only' || isAdmin;
  const validPhotoUrl = getDirectImageUrl(profile.photoUrl);

  return (
    <div className="bg-gray-50/50 pb-12 font-sans w-full">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="px-6 py-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

            {/* AVATAR */}
            <div className="flex-shrink-0 relative group">
              <div className="w-32 h-32 md:w-36 md:h-36 relative ring-4 ring-white shadow-lg rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={validPhotoUrl || "/logo.png"}
                  alt={profile.name}
                  className={`w-full h-full ${validPhotoUrl ? 'object-cover' : 'object-contain p-2'}`}
                  onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; e.target.className = "w-full h-full object-contain p-2"; }}
                />
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div>
                <div className="mb-2 flex justify-center md:justify-start">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-200">
                    {profile.designation || "LECTURER"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight capitalize">{profile.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 items-center text-gray-600">
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-100">
                    <Briefcase className="w-3.5 h-3.5" /> {profile.jobRole?.join(', ') || "Staff"}
                  </span>
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">
                    <User className="w-3.5 h-3.5" /> {profile.experience ? `${profile.experience} Years Exp` : "Fresher"}
                  </span>
                  {profile.unique_id && (
                    <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-purple-100">
                      <span className="text-gray-500">ID:</span> {profile.unique_id}
                    </span>
                  )}
                  {profile.gender && (
                    <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-gray-200">
                      {profile.gender}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500 pt-2 font-medium">
                {profile.email && (
                  <div className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <Mail className="w-4 h-4 text-gray-400" /> {profile.email}
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <Phone className="w-4 h-4 text-gray-400" /> +91 {profile.phone}
                  </div>
                )}
                {(profile.city || profile.state) && (
                  <div className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <MapPin className="w-4 h-4 text-gray-400" /> {profile.city}{profile.city && profile.state ? ', ' : ''}{profile.state}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              {profile.resumeLink && (
                <a href={profile.resumeLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  <FileText className="w-4 h-4" /> Download Resume
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

            {/* CAREER OBJECTIVE */}
            {profile.careerObjective && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Globe className="w-5 h-5 text-green-500" /> Career Objective
                </h2>
                <div className="text-gray-600 leading-relaxed">
                  {profile.careerObjective}
                </div>
              </section>
            )}

            {/* WORK EXPERIENCE */}
            {profile.workExperience?.length > 0 && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Briefcase className="w-5 h-5 text-green-500" /> Work Experience
                </h2>
                <div className="space-y-8">
                  {profile.workExperience.map((job, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-green-500 shadow-sm z-10"></div>
                      <div className="absolute left-[9px] top-7 bottom-0 w-0.5 bg-gray-100 last:hidden"></div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{job.designation || "Designation N/A"}</h3>
                        <p className="text-green-700 font-medium">{job.organization || "Organization N/A"}</p>
                        <p className="text-sm text-gray-400 mt-1 mb-2 flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5" /> {job.duration || "Dates N/A"}
                        </p>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">{job.responsibilities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EDUCATION */}
            {profile.educationalQualification?.length > 0 && (
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <GraduationCap className="w-5 h-5 text-green-500" /> Education
                </h2>
                <div className="space-y-6">
                  {profile.educationalQualification.map((edu, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-gray-300 shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{edu.qualification}</h3>
                        <p className="text-gray-600 text-sm">{edu.boardUniv}</p>
                        <div className="flex gap-4 mt-1 text-xs font-medium text-gray-500">
                          {edu.year && <span className="bg-gray-100 px-2 py-0.5 rounded">Year: {edu.year}</span>}
                          {edu.percentage && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">Score: {edu.percentage}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* SKILLS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-400" /> Skills
              </h3>
              {profile.keySkills?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.keySkills.map((skill, idx) => (
                      <span key={idx} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.technicalSkills?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.technicalSkills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(!profile.keySkills?.length && !profile.technicalSkills?.length) && (
                <p className="text-gray-400 italic text-sm">No skills added.</p>
              )}
            </div>

            {/* PERSONAL DETAILS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" /> Personal Details
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Date of Birth</span>
                  <span className="font-semibold text-gray-900">
                    {(() => {
                      if (!profile.dob) return "-";
                      if (isAdmin || profile.dobVisibility === 'everyone') {
                        return new Date(profile.dob).toLocaleDateString('en-GB');
                      }
                      if (profile.dobVisibility === 'mask_year') {
                        const d = new Date(profile.dob);
                        const day = d.getDate().toString().padStart(2, '0');
                        const month = (d.getMonth() + 1).toString().padStart(2, '0');
                        return `${day}/${month}/XXXX`;
                      }
                      return "Confidential";
                    })()}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-semibold text-gray-900 capitalize">{profile.gender || "-"}</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Marital Status</span>
                  <span className="font-semibold text-gray-900">{profile.maritalStatus || "-"}</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Nationality</span>
                  <span className="font-semibold text-gray-900">{profile.nationality || "-"}</span>
                </li>
                <li className="flex justify-between items-center pt-1">
                  <span className="text-gray-500">Current CTC</span>
                  <span className="font-semibold text-green-600">{profile.ctc || "-"}</span>
                </li>
              </ul>
            </div>

            {/* CONNECT */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-400" /> Connect
              </h3>

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

              {!social.linkedin && !social.twitter && !social.facebook && !social.instagram && (
                <p className="text-gray-400 italic text-sm text-center">No social links.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NonTeacherProfileView;

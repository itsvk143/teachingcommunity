import React from 'react';
import {
  User, Phone, MapPin, Users, BookOpen, Briefcase, Home,
  Baby, GraduationCap, School, Heart, Mail, Calendar
} from 'lucide-react';

const ParentProfileView = ({ parent }) => {
  if (!parent) return null;

  return (
    <div className="bg-gray-50/50 min-h-full font-sans">

      {/* 1. WARM WELCOME HEADER */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden mb-8 shadow-sm">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 opacity-50"></div>
        <div className="absolute right-0 top-0 p-32 bg-orange-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">

            {/* Avatar */}
            <div className="shrink-0 relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl ring-4 ring-white">
                {parent.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 bg-white text-orange-600 p-2 rounded-full shadow-md border border-gray-100">
                <Heart className="w-5 h-5 fill-orange-600" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3 pt-2">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{parent.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                  {parent.employmentType && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      <Briefcase className="w-3.5 h-3.5" />
                      {parent.employmentType}
                    </span>
                  )}
                  {parent.currentCity && (
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      <MapPin className="w-3.5 h-3.5" /> {parent.currentCity}, {parent.currentState}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:inline-flex gap-4 md:gap-8 pt-2">
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-gray-900">{parent.numberOfChildren || 0}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Children</div>
                </div>
                {/* Placeholder for future stat like "Active Tutors" */}
                {parent.nativeState && (
                  <div className="text-center md:text-left px-4 border-l border-gray-200">
                    <div className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{parent.nativeState}</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Native</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* 2. LEFT CONTENT (Children) - Spans 8 Cols */}
          <div className="lg:col-span-8 space-y-8">

            {/* CHILDREN SECTION */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Baby className="w-6 h-6 text-orange-500" /> My Children
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold ml-2">
                    {parent.children?.length || 0}
                  </span>
                </h2>
              </div>

              {(!parent.children || parent.children.length === 0) ? (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Baby className="w-8 h-8" />
                  </div>
                  <h3 className="text-gray-900 font-bold">No children profiles added yet</h3>
                  <p className="text-gray-500 text-sm mt-1">Add your children's details to find better tutors.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parent.children.map((child, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">

                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{child.gender}</h3>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{child.age} Years Old</p>
                          </div>
                        </div>
                        <Briefcase className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Class / Grade</p>
                            <p className="text-gray-900 font-semibold">{child.classGrade}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <School className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">School</p>
                            <p className="text-gray-900 font-semibold line-clamp-1" title={child.school}>{child.school}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* 3. RIGHT SIDEBAR (Details) - Spans 4 Cols */}
          <div className="lg:col-span-4 space-y-6">

            {/* Contact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Home className="w-4 h-4 text-orange-500" /> Household Details
              </h3>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Current Address</span>
                    <p className="text-sm text-gray-700 font-medium leading-snug">{parent.address}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Native Place</span>
                    <p className="text-sm text-gray-700 font-medium">
                      {parent.nativeCity && parent.nativeState
                        ? `${parent.nativeCity}, ${parent.nativeState}`
                        : "Not specified"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Employment Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" /> Work Profile
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Occupation</div>
                <div className="font-bold text-gray-900 text-lg mb-2">{parent.employmentType || "Not specified"}</div>
                {parent.salariedDetails && (
                  <div className="text-sm text-gray-600 border-t border-gray-200 pt-2 mt-2">
                    {parent.salariedDetails}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400" /> Contact Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 opacity-90">
                  <Mail className="w-4 h-4" /> {parent.userEmail}
                </div>
                <div className="flex items-center gap-2 opacity-90">
                  <Phone className="w-4 h-4" /> {parent.contact}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfileView;

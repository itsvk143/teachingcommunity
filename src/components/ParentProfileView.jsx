import React from 'react';
import { User, Phone, MapPin, Users, BookOpen, Briefcase, Home } from 'lucide-react';

const ParentProfileView = ({ parent }) => {
  if (!parent) return null;

  return (
    <div className="bg-white pb-8 font-sans w-full rounded-xl overflow-hidden border border-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-28 h-28 rounded-full bg-white text-orange-600 flex items-center justify-center text-5xl font-bold shadow-xl border-4 border-white/30">
            {parent.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-1">
              <h1 className="text-4xl font-extrabold tracking-tight">{parent.name}</h1>
              {parent.employmentType && (
                <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm">
                  <Briefcase className="w-3 h-3" />
                  {parent.employmentType}
                  {parent.employmentType === 'Salaried' && parent.salariedDetails && ` - ${parent.salariedDetails}`}
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium opacity-90">
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Phone className="w-4 h-4" /> {parent.contact}
              </span>
              {parent.currentCity && parent.currentState && (
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <MapPin className="w-4 h-4" /> {parent.currentCity}, {parent.currentState}
                </span>
              )}
            </div>

            {parent.nativeCity && parent.nativeState && (
              <div className="pt-1">
                <span className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-medium text-orange-100">
                  <Home className="w-3 h-3" /> Native: {parent.nativeCity}, {parent.nativeState}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-8 space-y-8">

        {/* Full Address Block */}
        <div className="bg-orange-50 px-6 py-4 rounded-xl border border-orange-100 flex items-start gap-3">
          <div className="mt-1"><MapPin className="w-5 h-5 text-orange-500" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Residential Address</p>
            <p className="text-gray-800 font-medium">{parent.address}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-500" />
              Children Details
              <span className="text-sm font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                {parent.numberOfChildren}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parent.children?.map((child, index) => (
              <div key={index} className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 relative group">
                <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-600 text-sm font-bold shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  {index + 1}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Class</p>
                    <p className="font-bold text-gray-900 leading-tight">{child.classGrade}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">School</span>
                    <span className="font-semibold text-gray-800 truncate max-w-[120px]" title={child.school}>{child.school}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Gender</span>
                    <span className="font-medium text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-100">{child.gender}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Age</span>
                    <span className="font-medium text-gray-700">{child.age} Years</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfileView;

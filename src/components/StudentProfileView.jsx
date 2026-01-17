import React from 'react';
import { User, Phone, MapPin, BookOpen, GraduationCap, Heart, Users, Target, TrendingUp, ThumbsUp, ThumbsDown, Info, Smile, Cake, Globe, School } from 'lucide-react';

const StudentProfileView = ({ student }) => {
  if (!student) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white text-center md:text-left">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white text-teal-600 flex items-center justify-center text-4xl font-bold uppercase shadow-lg border-4 border-white/30">
            {student.name?.charAt(0) || 'S'}
          </div>

          {/* Main Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium opacity-90">
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <GraduationCap className="w-4 h-4" /> Class {student.classGrade}
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <BookOpen className="w-4 h-4" /> {student.school}
              </span>
              {student.location && (
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <MapPin className="w-4 h-4" /> {student.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-gray-200">

        {/* LEFT SIDEBAR - Personal Info */}
        <div className="lg:col-span-1 p-6 space-y-8 bg-gray-50/50">

          {/* Contact & Basics */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Personal Details</h3>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal-600 mt-0.5" />
                <span>{student.contact}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-600 mt-0.5" />
                <span>{student.address}</span>
              </li>
              {student.dob && (
                <li className="flex items-start gap-3">
                  <Cake className="w-4 h-4 text-teal-600 mt-0.5" />
                  <span>{new Date(student.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </li>
              )}
              {student.languages && (
                <li className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-teal-600 mt-0.5" />
                  <span>{student.languages}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Hobbies & Parents */}
          {(student.hobbies || student.parentsDetails) && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Background</h3>
              <ul className="space-y-4 text-sm text-gray-700">
                {student.hobbies && (
                  <li className="flex items-start gap-3">
                    <Smile className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-xs">Hobbies</strong>
                      {student.hobbies}
                    </div>
                  </li>
                )}
                {student.parentsDetails && (
                  <li className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 text-xs">Parents</strong>
                      {student.parentsDetails}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* School Sentiment - Quick View */}
          {student.schoolSentiment && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <School className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase text-gray-500">School Life</span>
              </div>
              <div className={`text-sm font-semibold ${student.schoolSentiment === 'Yes' ? 'text-green-600' : 'text-red-500'}`}>
                {student.schoolSentiment === 'Yes' ? '👍 Likes School' : '👎 Dislikes School'}
              </div>
              {student.schoolFeedback && (
                <p className="text-xs text-gray-500 mt-2 italic border-l-2 pl-2 border-indigo-100">
                  "{student.schoolFeedback}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="lg:col-span-2 p-6 space-y-8">

          {/* About Me */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-800">About Me</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              {student.about ? student.about : "No about me information provided yet."}
            </p>
          </section>

          {/* Academics */}
          {(student.favoriteSubjects || student.strength || student.weakness) && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {student.favoriteSubjects && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 mb-2 text-red-800 font-bold text-sm">
                    <Heart className="w-4 h-4" /> Favorite Subjects
                  </div>
                  <p className="text-gray-700 text-sm">{student.favoriteSubjects}</p>
                </div>
              )}
              {(student.strength || student.weakness) && (
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 space-y-3">
                  {student.strength && (
                    <div>
                      <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-1">
                        <ThumbsUp className="w-4 h-4" /> My Strengths
                      </div>
                      <p className="text-gray-700 text-sm">{student.strength}</p>
                    </div>
                  )}
                  {student.weakness && (
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
                        <ThumbsDown className="w-4 h-4" /> My Weaknesses
                      </div>
                      <p className="text-gray-600 text-sm">{student.weakness}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Future & Goals */}
          {(student.goals || student.visionFiveYears || student.visionTenYears) && (
            <section className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-800">Ambitions & Vision</h2>
              </div>

              <div className="space-y-4">
                {student.goals && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-1">My Goals</h4>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {student.goals}
                    </p>
                  </div>
                )}

                {(student.visionFiveYears || student.visionTenYears) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {student.visionFiveYears && (
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="text-purple-800 font-bold text-xs uppercase mb-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> In 5 Years
                        </div>
                        <p className="text-sm text-gray-700">{student.visionFiveYears}</p>
                      </div>
                    )}
                    {student.visionTenYears && (
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="text-purple-800 font-bold text-xs uppercase mb-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> In 10 Years
                        </div>
                        <p className="text-sm text-gray-700">{student.visionTenYears}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Extra Info */}
          {(student.friendsDetails || student.otherDetails) && (
            <section className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {student.friendsDetails && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-500" /> My Friends
                  </h3>
                  <p className="text-gray-600 text-sm">{student.friendsDetails}</p>
                </div>
              )}
              {student.otherDetails && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" /> Other Details
                  </h3>
                  <p className="text-gray-600 text-sm">{student.otherDetails}</p>
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;

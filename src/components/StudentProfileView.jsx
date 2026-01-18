import React from 'react';
import {
  User, Phone, MapPin, BookOpen, GraduationCap, Heart, Users, Target,
  TrendingUp, ThumbsUp, ThumbsDown, Info, Smile, Cake, Globe, School,
  Award, Calendar, Mail
} from 'lucide-react';

const StudentProfileView = ({ student }) => {
  if (!student) return null;

  // Helper for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-full font-sans">

      {/* 1. HEADER HERO SECTION */}
      <div className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Decorative Background */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-end -mt-12">

            {/* Avatar */}
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl shrink-0">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center text-5xl font-bold text-indigo-600">
                {student.name?.charAt(0) || 'S'}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 pb-2 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 mt-2 text-gray-600 font-medium">
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <GraduationCap className="w-4 h-4" /> Class {student.classGrade}
                </span>
                <span className="flex items-center gap-1.5 bg-fuchsia-50 text-fuchsia-700 px-3 py-1 rounded-full text-sm">
                  <School className="w-4 h-4" /> {student.school}
                </span>
                {student.location && (
                  <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    <MapPin className="w-4 h-4" /> {student.location}
                  </span>
                )}
              </div>
            </div>

            {/* Sentiment Badge (Desktop) */}
            {student.schoolSentiment && (
              <div className={`hidden md:flex flex-col items-end px-4 py-2 rounded-xl border ${student.schoolSentiment === 'Yes' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                <span className="text-xs font-bold uppercase tracking-wide opacity-70">School Sentiment</span>
                <span className="font-bold text-lg">{student.schoolSentiment === 'Yes' ? 'Loves School 😄' : 'Needs Support 😟'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 2. LEFT SIDEBAR (Personal Info) - Spans 4 Cols */}
        <div className="lg:col-span-4 space-y-6">

          {/* About Me Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" /> About Me
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {student.about || "No bio added yet. Tell us about yourself!"}
            </p>
          </div>

          {/* Contact & Personal Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Details</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Phone</div>
                  {student.contact}
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Address</div>
                  <span className="line-clamp-1">{student.address}</span>
                </div>
              </li>
              {formatDate(student.dob) && (
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                    <Cake className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Birthday</div>
                    {formatDate(student.dob)}
                  </div>
                </li>
              )}
              {student.languages && (
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Languages</div>
                    {student.languages}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Hobbies & Friends */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Life & Interests</h3>
            <div className="space-y-5">
              {student.hobbies && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                    <Smile className="w-4 h-4 text-yellow-500" /> Hobbies
                  </div>
                  <p className="text-xs text-gray-600 bg-yellow-50/50 p-2 rounded-lg border border-yellow-100">
                    {student.hobbies}
                  </p>
                </div>
              )}
              {student.friendsDetails && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                    <Users className="w-4 h-4 text-pink-500" /> Friends
                  </div>
                  <p className="text-xs text-gray-600">
                    {student.friendsDetails}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. RIGHT MAIN CONTENT (Academics & Vision) - Spans 8 Cols */}
        <div className="lg:col-span-8 space-y-6">

          {/* ACADEMIC SNAPSHOT */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Academic Snapshot
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Favorites */}
              <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Favorite Subjects</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {student.favoriteSubjects || "Not listed yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strength */}
              <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Top Strengths</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {student.strength || "Not listed yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Weakness */}
              <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border border-orange-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                    <ThumbsDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Areas to Improve</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {student.weakness || "Not listed yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* School Feedback */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-200 text-gray-600 rounded-lg">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">School Feedback</h4>
                    <p className="text-sm text-gray-600 mt-1 italic">
                      "{student.schoolFeedback || "No feedback provided"}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* VISION & GOALS */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>

            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 relative z-10">
              <Target className="w-5 h-5 text-purple-500" /> Vision Board
            </h2>

            <div className="space-y-6 relative z-10">
              {/* Primary Goal */}
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex gap-4">
                <div className="p-3 bg-white rounded-full shadow-sm text-purple-600 h-fit">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-purple-900 font-bold mb-1">My Main Goal</h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    {student.goals || "Set your main academic or personal goal here."}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-4 ring-white">5y</div>
                    <h4 className="font-bold text-gray-900 text-sm">In 5 Years</h4>
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {student.visionFiveYears || "Where do you see yourself?"}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs ring-4 ring-white">10y</div>
                    <h4 className="font-bold text-gray-900 text-sm">In 10 Years</h4>
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {student.visionTenYears || "Think big! What's the long term dream?"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* OTHER DETAILS */}
          {(student.otherDetails || student.parentsDetails) && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-500" /> Additional Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {student.parentsDetails && (
                  <div>
                    <h4 className="font-bold text-gray-700 text-sm mb-2">Parents Details</h4>
                    <p className="text-sm text-gray-600">{student.parentsDetails}</p>
                  </div>
                )}
                {student.otherDetails && (
                  <div>
                    <h4 className="font-bold text-gray-700 text-sm mb-2">Other Notes</h4>
                    <p className="text-sm text-gray-600">{student.otherDetails}</p>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;

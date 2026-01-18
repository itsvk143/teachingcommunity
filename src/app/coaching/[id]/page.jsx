import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Coaching from '@/model/Coaching';
import ReviewSection from '@/components/ReviewSection';
import {
  MapPin,
  Phone,
  Globe,
  User,
  ArrowLeft,
  CheckCircle,
  Mail,
  Clock,
  Award,
  BookOpen,
  Users,
  Building,
  Star,
  Download,
  Video,
  Image as ImageIcon
} from 'lucide-react';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Edit } from 'lucide-react';

async function getCoaching(id) {
  try {
    await dbConnect();
    const coaching = await Coaching.findById(id).lean();
    if (!coaching) return null;
    return JSON.parse(JSON.stringify(coaching));
  } catch (error) {
    console.error("Error fetching coaching:", error);
    return null;
  }
}

export default async function CoachingDetailPage(props) {
  const params = await props.params;
  const coaching = await getCoaching(params.id);
  const session = await getServerSession(authOptions);

  if (!coaching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <p className="text-gray-500 mt-2">Coaching institute not found</p>
        <Link href="/coaching" className="mt-6 text-blue-600 hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  // Check ownership/admin
  const isOwner = (session?.user?.email && session.user.email === coaching.email) || (session?.user?.id && session.user.id === coaching.owner_user_id);
  const isAdmin = session?.user?.role === 'admin';
  const canEdit = isOwner || isAdmin;

  // Fallbacks for backward compatibility
  const name = coaching.name || coaching.instituteName;
  const description = coaching.description_long || coaching.description;
  const owner = coaching.contact_person_name || coaching.ownerName;
  const address =
    coaching.address_line1 || coaching.location
      ? `${coaching.address_line1 || ''} ${coaching.address_line2 || ''} ${coaching.city || ''
      } ${coaching.state || ''}`
      : coaching.location;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Cover Image Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        {coaching.cover_image_url ? (
          <img
            src={coaching.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/coaching"
            className="inline-flex items-center text-white/90 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Link>
          {canEdit && (
            <Link
              href={`/coaching/${params.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-bold rounded-lg shadow hover:bg-gray-50 transition"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Details
            </Link>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN (Main Content) */}
          <div className="flex-1 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  {coaching.logo_url || coaching.logoUrl ? (
                    <img
                      src={coaching.logo_url || coaching.logoUrl}
                      alt={name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-contain bg-white border shadow-sm p-2"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-4xl font-bold border border-blue-100">
                      {name?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {coaching.brand_name && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {coaching.brand_name}
                      </span>
                    )}
                    {coaching.is_verified && (
                      <span className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {name}
                  </h1>

                  {coaching.center_name && (
                    <h2 className="text-lg text-gray-500 font-medium mb-3">
                      {coaching.center_name}
                    </h2>
                  )}

                  <div className="flex flex-col gap-2 text-gray-600 mt-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{address}</span>
                    </div>
                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {coaching.exam_types?.map((exam, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                          {exam}
                        </span>
                      ))}
                      {coaching.mode?.map((m, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-md">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Highlights */}
            {(coaching.faculty_count > 0 || coaching.student_count > 0 || coaching.selection_count_neet > 0 || coaching.selection_count_jee > 0 || coaching.batch_strength_avg) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coaching.faculty_count > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{coaching.faculty_count}+</div>
                    <div className="text-sm text-blue-600">Expert Faculty</div>
                  </div>
                )}
                {coaching.student_count > 0 && (
                  <div className="bg-teal-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-teal-700">{coaching.student_count}+</div>
                    <div className="text-sm text-teal-600">Students Enrolled</div>
                  </div>
                )}
                {coaching.selection_count_neet > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{coaching.selection_count_neet}+</div>
                    <div className="text-sm text-green-600">NEET Selections</div>
                  </div>
                )}
                {coaching.selection_count_jee > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-700">{coaching.selection_count_jee}+</div>
                    <div className="text-sm text-orange-600">JEE Selections</div>
                  </div>
                )}
                {coaching.batch_strength_avg && (
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-700">{coaching.batch_strength_avg}</div>
                    <div className="text-sm text-purple-600">Avg Batch Size</div>
                  </div>
                )}
                {coaching.non_academic_staff_count > 0 && (
                  <div className="bg-indigo-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-700">{coaching.non_academic_staff_count}+</div>
                    <div className="text-sm text-indigo-600">Support Staff</div>
                  </div>
                )}
              </div>
            )}

            {/* About Section */}
            {(description || coaching.description_short) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" /> About Institute
                </h3>
                <div className="prose prose-blue max-w-none text-gray-600">
                  <p className="whitespace-pre-wrap leading-relaxed">{description || coaching.description_short}</p>
                </div>
              </div>
            )}

            {/* Courses & Programs */}
            {coaching.courses_offered?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" /> Courses Offered
                </h3>
                {/* Structured Course Categories Display */}
                {coaching.course_categories && Object.keys(coaching.course_categories).length > 0 ? (
                  <div className="space-y-8">
                    {Object.entries(coaching.course_categories).map(([category, items]) => {
                      // Define known structures to help grouping
                      const knownStructure = {
                        "School Tuition (Academic Coaching)": ["Classes", "Subjects Available"],
                        "Board Exam Preparation": ["Boards", "Special"],
                        "Competitive Exam Coaching": ["Engineering", "Medical"],
                        "Foundation Courses": ["Courses"],
                        "Olympiad Coaching": ["Exams"],
                        "Test Series / DPP Courses": ["Types"],
                        "Crash Courses": ["Courses"],
                        "Special Support Programs": ["Programs"]
                      };

                      // Definition of items for sorting (simplified version of the register page constant)
                      const itemGroups = {
                        "School Tuition (Academic Coaching)": {
                          "Classes": ["Class 6th", "Class 7th", "Class 8th", "Class 9th", "Class 10th (Board Special)", "Class 11th", "Class 12th (Board Special)"],
                          "Subjects Available": ["Mathematics", "Science (Physics/Chemistry/Biology)", "Physics", "Chemistry", "Biology", "English", "Social Science", "Computer Science / IT"]
                        },
                        "Board Exam Preparation": {
                          "Boards": ["CBSE Board", "ICSE Board", "State Board"],
                          "Special": ["Class 10 Board Booster", "Class 12 Board Booster", "Sample Paper + PYQ Practice", "Pre-board Test Series"]
                        },
                        "Competitive Exam Coaching": {
                          "Engineering": ["JEE Main", "JEE Advanced", "JEE (11th + 12th Full Course)", "JEE Dropper Course"],
                          "Medical": ["NEET (UG)", "NEET (11th + 12th Full Course)", "NEET Dropper Course", "AIIMS level practice (NEET-based)"]
                        }
                      };

                      // If we have structure for this category, try to group items
                      let groupedItems = {};
                      let leftoverItems = [];

                      if (itemGroups[category]) {
                        // Initialize groups
                        Object.keys(itemGroups[category]).forEach(key => groupedItems[key] = []);

                        // Sort items
                        if (Array.isArray(items)) {
                          items.forEach(item => {
                            let found = false;
                            for (const [groupName, groupItems] of Object.entries(itemGroups[category])) {
                              if (groupItems.includes(item)) {
                                groupedItems[groupName].push(item);
                                found = true;
                                break;
                              }
                            }
                            if (!found) leftoverItems.push(item);
                          });
                        }
                      } else {
                        leftoverItems = Array.isArray(items) ? items : [];
                      }

                      const hasGroups = Object.values(groupedItems).some(g => g.length > 0);

                      return (
                        <div key={category} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                          <h4 className="font-bold text-blue-900 mb-4 text-lg border-b border-gray-200 pb-2">{category}</h4>

                          {hasGroups ? (
                            <div className="space-y-4">
                              {Object.entries(groupedItems).map(([groupName, groupItems]) => (
                                groupItems.length > 0 && (
                                  <div key={groupName}>
                                    {(groupName !== 'Courses' && groupName !== 'Programs' && groupName !== 'Types' && groupName !== 'Exams') && (
                                      <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                                        {groupName === 'Classes' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>}
                                        {groupName === 'Subjects Available' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>}
                                        {groupName}
                                      </h5>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                      {groupItems.map((course, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-200 shadow-sm">
                                          {course}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )
                              ))}
                              {leftoverItems.length > 0 && (
                                <div>
                                  <div className="flex flex-wrap gap-2">
                                    {leftoverItems.map((course, idx) => (
                                      <span key={idx} className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-200 shadow-sm">
                                        {course}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(items) && items.map((course, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-200 shadow-sm">
                                  {course}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {coaching.courses_offered.map((course, idx) => (
                      <div key={idx} className="flex items-center p-3 border rounded-lg hover:border-blue-300 transition-colors bg-gray-50">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                        <span className="font-medium text-gray-700">{course}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm text-gray-500 block mb-2 font-semibold uppercase tracking-wide">Other</span>
                    <div className="flex flex-wrap gap-2">
                      {coaching.streams?.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-sm rounded border border-gray-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-2 font-semibold uppercase tracking-wide">Batch Timings</span>
                  <div className="flex flex-wrap gap-2">
                    {coaching.batch_timing?.length > 0 ? (
                      coaching.batch_timing.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-green-50 text-green-700 text-sm rounded border border-green-200">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">Not specified</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Facilities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" /> Facilities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {['ac_classrooms', 'smart_classes', 'library', 'wifi', 'study_room', 'hostel_support', 'transport_available', 'separate_doubt_counter', 'cctv', 'biometric_attendance'].map(key => (
                  coaching[key] && (
                    <div key={key} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 text-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Faculty Section */}
            {coaching.top_faculties?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> Top Faculty
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {coaching.top_faculties.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border bg-gray-50">
                      {fac.photo_url ? (
                        <img src={fac.photo_url} alt={fac.name} className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900">{fac.name}</h4>
                        <p className="text-sm text-blue-600 font-medium">{fac.subject}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {coaching.subject_wise_faculty?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="text-md font-bold text-gray-800 mb-4">Faculty Distribution</h4>
                    <div className="flex flex-wrap gap-4">
                      {coaching.subject_wise_faculty.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                          <span className="font-medium text-gray-700">{item.subject}</span>
                          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results Section */}
            {coaching.top_results?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" /> Centre Results & Achievements
                </h3>

                <div className="space-y-8">
                  {Object.entries(
                    coaching.top_results.reduce((acc, curr) => {
                      const yr = curr.year || 'Other';
                      if (!acc[yr]) acc[yr] = [];
                      acc[yr].push(curr);
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[0] - a[0]) // Sort by year desc
                    .map(([year, results]) => (
                      <div key={year}>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">{year}</span>
                          <div className="h-px bg-gray-100 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {results.map((res, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50/50">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold text-gray-900">{res.name}</h4>
                                  <p className="text-xs text-gray-500 font-mono">ID: {res.student_enrollment_id || 'N/A'}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">{res.exam}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-600">Rank/Score: </span>
                                <span className="font-bold text-blue-600">{res.rank_or_score}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewSection entityId={coaching._id} entityType="coaching" initialReviews={coaching.reviews || coaching.platform_reviews || []} canReply={canEdit} />
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <div className="lg:w-1/3 space-y-6">

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>

              <div className="space-y-4">
                {coaching.phone_primary && (
                  <a href={`tel:${coaching.phone_primary}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{coaching.phone_primary}</span>
                  </a>
                )}
                {coaching.whatsapp_number && (
                  <a href={`https://wa.me/${coaching.whatsapp_number}`} target="_blank" className="flex items-center gap-3 text-gray-700 hover:text-green-600 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-500" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    <span className="font-medium">WhatsApp</span>
                  </a>
                )}
                {coaching.email && (
                  <a href={`mailto:${coaching.email}`} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="font-medium truncate">{coaching.email}</span>
                  </a>
                )}
                {coaching.website_url && (
                  <a href={coaching.website_url} target="_blank" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="font-medium truncate">Visit Website</span>
                  </a>
                )}
              </div>

              {coaching.enquiry_link && (
                <a href={coaching.enquiry_link} target="_blank" className="mt-6 block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-center rounded-lg shadow-lg transition transform hover:-translate-y-0.5">
                  Enquire Now
                </a>
              )}
            </div>

            {/* Fees Card */}
            {(coaching.course_fees?.length > 0 || coaching.fee_range_min || coaching.pricing_note) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Fees & Structure</h3>

                {/* Course-wise Fees */}
                {coaching.course_fees?.length > 0 ? (
                  <div className="mb-4 space-y-3">
                    {coaching.course_fees.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <span className="text-gray-700 font-medium text-sm">{item.course_name}</span>
                        <span className="text-gray-900 font-bold text-sm ml-2 text-right">{item.fee}</span>
                      </div>
                    ))}
                  </div>
                ) : coaching.fee_range_min ? (
                  /* Fallback to range */
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {coaching.currency} {coaching.fee_range_min.toLocaleString()}
                      {coaching.fee_range_max && ` - ${coaching.fee_range_max.toLocaleString()}`}
                    </span>
                  </div>
                ) : null}

                {coaching.pricing_note && <p className="text-sm text-gray-600 mb-3 italic">{coaching.pricing_note}</p>}

                <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                  {coaching.installment_available && (
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> EMI Available
                    </div>
                  )}
                  {coaching.free_demo_available && (
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Free Demo Class
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Google Map Embed */}


            {/* Brochure Download */}
            {coaching.brochure_pdf_url && (
              <a href={coaching.brochure_pdf_url} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition">
                <Download className="w-4 h-4" /> Download Brochure
              </a>
            )}

          </div>
        </div>
      </div>
    </div >
  );
}

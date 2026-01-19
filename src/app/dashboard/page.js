"use client"; // Mark this as a Client Component

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Briefcase, GraduationCap, Building2, School, Users, LogOut, Plus, Pencil, Trash2, Home, BookOpen } from "lucide-react";
import TeacherProfileView from "@/components/TeacherProfileView";
import NonTeacherProfileView from "@/components/NonTeacherProfileView";
import CoachingProfileView from "@/components/CoachingProfileView";
import SchoolProfileView from "@/components/SchoolProfileView";
import ParentProfileView from "@/components/ParentProfileView";
import StudentProfileView from "@/components/StudentProfileView";

export default function Dashboard() {
  const { data: session, status } = useSession(); // Get the user session status
  const router = useRouter();
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [nonTeacherProfile, setNonTeacherProfile] = useState(null);
  const [coachingProfile, setCoachingProfile] = useState(null);
  const [schoolProfile, setSchoolProfile] = useState(null);
  const [parentProfile, setParentProfile] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [homeTuitions, setHomeTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profiles if user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      setLoading(true);

      const fetchAllProfiles = async () => {
        try {
          // Parallel Fetching for speed
          const [teacherRes, nonTeacherRes, coachingRes, schoolRes, parentRes, studentRes, htRes] = await Promise.all([
            fetch(`/api/teachers?email=${email}`),
            fetch(`/api/non-teachers?email=${email}`),
            fetch(`/api/coaching?email=${email}`),
            fetch(`/api/schools?email=${email}`),
            fetch(`/api/parents?email=${email}`),
            fetch(`/api/students?email=${email}`),
            fetch(`/api/hometuition?email=${email}`)
          ]);

          const [teacherData, nonTeacherData, coachingData, schoolData, parentData, studentData, htData] = await Promise.all([
            teacherRes.json(),
            nonTeacherRes.json(),
            coachingRes.json(),
            schoolRes.json(),
            parentRes.json(),
            studentRes.json(),
            htRes.json()
          ]);

          if (teacherData?.teachers?.length > 0) setTeacherProfile(teacherData.teachers[0]);
          if (nonTeacherData?.staff?.length > 0) setNonTeacherProfile(nonTeacherData.staff[0]);
          if (coachingData?.length > 0) setCoachingProfile(coachingData[0]);
          if (schoolData?.schools?.length > 0) setSchoolProfile(schoolData.schools[0]);
          if (parentData && !parentData.error) setParentProfile(parentData);
          if (studentData && !studentData.error) setStudentProfile(studentData);
          if (Array.isArray(htData)) setHomeTuitions(htData);

        } catch (err) {
          console.error("Failed to fetch profiles", err);
        } finally {
          setLoading(false);
        }
      };

      fetchAllProfiles();
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // Redirect user to login after logout
  };

  const handleDeleteHomeTuition = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/hometuition/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHomeTuitions(prev => prev.filter(item => item._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/login"); // Redirect to login if user is not authenticated
    return null;
  }

  const hasAnyProfile = teacherProfile || nonTeacherProfile || coachingProfile || schoolProfile || parentProfile || studentProfile;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* TOP BAR: Welcome & Account */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {session.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {session.user?.name}</h1>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Profiles (2 Cols wide on LG) */}
          <div className="lg:col-span-2 space-y-8">

            {/* REGISTER AS SECTION - Show if NO profiles */}
            {!hasAnyProfile && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-gray-900">What describes you best?</h2>
                  <p className="text-gray-500 mt-2">Create a profile to get started with our platform.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <RoleCard
                    icon={GraduationCap} color="blue" title="Teacher" desc="For educators looking for schools/jobs."
                    onClick={() => router.push('/teachersadmin/new')}
                  />
                  <RoleCard
                    icon={Briefcase} color="green" title="Staff" desc="Administrative & support roles."
                    onClick={() => router.push('/nonteachersadmin/new')}
                  />
                  <RoleCard
                    icon={Building2} color="purple" title="Institute" desc="Coaching centers & institutes."
                    onClick={() => router.push('/coaching/register')}
                  />
                  <RoleCard
                    icon={School} color="red" title="School" desc="Register your school."
                    onClick={() => router.push('/schools/register')}
                  />
                  <RoleCard
                    icon={Users} color="orange" title="Parent" desc="Find tutors for your kids."
                    onClick={() => router.push('/parents/register')}
                  />
                  <RoleCard
                    icon={Users} color="teal" title="Student" desc="Manage your student profile."
                    onClick={() => router.push('/students/register')}
                  />
                </div>
              </div>
            )}

            {/* ACTIVE PROFILES VIEW */}

            {/* Teacher Profile View */}
            {teacherProfile && (
              <ProfileContextWrapper
                title="Teaching Profile"
                color="blue"
                icon={GraduationCap}
                onEdit={() => router.push(`/teachersadmin/${teacherProfile._id}/edit`)}
                onViewPublic={() => router.push(`/teacherspublic/${teacherProfile._id}`)}
              >
                <TeacherProfileView teacher={teacherProfile} canViewSalary={true} />
              </ProfileContextWrapper>
            )}

            {/* Non-Teacher Profile View */}
            {nonTeacherProfile && (
              <ProfileContextWrapper
                title="Staff Profile"
                color="green"
                icon={Briefcase}
                onEdit={() => router.push(`/nonteachersadmin/${nonTeacherProfile._id}/edit`)}
                onViewPublic={() => router.push(`/nonteacherspublic`)}
              >
                <NonTeacherProfileView profile={nonTeacherProfile} />
              </ProfileContextWrapper>
            )}

            {/* Coaching Profile View */}
            {coachingProfile && (
              <ProfileContextWrapper
                title="Institute Profile"
                color="purple"
                icon={Building2}
                onEdit={null} // Coaching view handles edit internal link if needed, or pass explicit
                onViewPublic={() => router.push(`/coaching/${coachingProfile._id}`)}
              >
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <CoachingProfileView coaching={coachingProfile} canEdit={true} />
                </div>
              </ProfileContextWrapper>
            )}

            {/* School Profile View */}
            {schoolProfile && (
              <ProfileContextWrapper
                title="School Profile"
                color="red"
                icon={School}
                onEdit={() => router.push(`/schools/${schoolProfile._id}/edit`)}
                onViewPublic={() => router.push(`/schools/${schoolProfile._id}`)}
              >
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <SchoolProfileView school={schoolProfile} />
                </div>
              </ProfileContextWrapper>
            )}

            {/* Parent Profile View */}
            {parentProfile && (
              <ProfileContextWrapper
                title="Parent Profile"
                color="orange"
                icon={Users}
                onEdit={() => router.push(`/parents/${parentProfile._id}/edit`)}
              >
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <ParentProfileView parent={parentProfile} />
                </div>
              </ProfileContextWrapper>
            )}

            {/* Student Profile View */}
            {studentProfile && (
              <ProfileContextWrapper
                title="Student Profile"
                color="teal"
                icon={Users}
                onEdit={() => router.push(`/students/${studentProfile._id}/edit`)}
              >
                <StudentProfileView student={studentProfile} />
              </ProfileContextWrapper>
            )}

          </div>

          {/* RIGHT COLUMN: Home Tuitions (1 Col wide on LG) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="p-6 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-gray-800">My Tuitions</h3>
                </div>
                <button
                  onClick={() => router.push('/hometuition/new')}
                  className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shadow-sm"
                  title="Post Requirement"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto max-h-[800px] space-y-4">
                {homeTuitions.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">You haven&apos;t posted any requirements yet.</p>
                    <button onClick={() => router.push('/hometuition/new')} className="text-indigo-600 font-semibold text-sm mt-2">Post now</button>
                  </div>
                ) : (
                  homeTuitions.map((ht) => (
                    <div key={ht._id} className="group bg-white rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800 text-base">{ht.subject}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${ht.mode === 'Online' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                          {ht.mode}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {ht.classGrade}
                      </p>
                      <p className="text-xs text-gray-400 mb-4 truncate">{ht.location}, {ht.city}</p>

                      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
                        <button
                          onClick={() => router.push(`/hometuition/${ht._id}/edit`)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHomeTuition(ht._id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper Components for Cleaner JSX

function RoleCard({ icon: Icon, color, title, desc, onClick }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    red: "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
  };

  return (
    <button onClick={onClick} className="group text-left p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 bg-white">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </button>
  );
}

function ProfileContextWrapper({ title, color, icon: Icon, children, onEdit, onViewPublic }) {
  const colors = {
    blue: "text-blue-600 border-blue-100 bg-blue-50",
    green: "text-green-600 border-green-100 bg-green-50",
    purple: "text-purple-600 border-purple-100 bg-purple-50",
    red: "text-red-600 border-red-100 bg-red-50",
    orange: "text-orange-600 border-orange-100 bg-orange-50",
    teal: "text-teal-600 border-teal-100 bg-teal-50",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color].split(' ')[2]}`}>
            <Icon className={`w-4 h-4 ${colors[color].split(' ')[0]}`} />
          </div>
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <div className="flex gap-2">
          {onViewPublic && (
            <button onClick={onViewPublic} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition">
              Public View
            </button>
          )}
          {onEdit && (
            <button onClick={onEdit} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 transition shadow-sm">
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

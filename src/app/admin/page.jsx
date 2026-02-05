'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Briefcase, GraduationCap, LayoutDashboard, Settings, Crown, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    teachers: 0,
    vacancies: 0,
    coachings: 0,
    hometuition: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      // Temporarily allow all for dev or handle unauthorized
      // router.push('/'); 
    }
  }, [status, session, router]);

  // Fetch stats efficiently
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();

        if (res.ok) {
          setStats({
            teachers: data.teachers || 0,
            nonTeachers: data.nonTeachers || 0,
            vacancies: data.vacancies || 0,
            coachings: data.coachings || 0,
            hometuition: data.hometuition || 0
          });
        }
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }
    }
    fetchStats();
  }, []);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Double check admin role
  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
        <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white min-h-screen fixed left-0 top-0 bottom-0 z-10 pt-20">
        <div className="px-6 pb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-blue-400" />
            Admin
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavLink href="/admin" active icon={<LayoutDashboard size={20} />}>Dashboard</NavLink>
          <NavLink href="/teachersadmin" icon={<GraduationCap size={20} />}>Manage Teachers</NavLink>
          <NavLink href="/nonteachersadmin" icon={<Users size={20} />}>Manage Non Teachers</NavLink>
          <NavLink href="/admin/vacancies" icon={<Briefcase size={20} />}>Manage Vacancies</NavLink>
          <NavLink href="/admin/coaching" icon={<Crown size={20} />}>Manage Coaching</NavLink>
          <NavLink href="/admin/parents" icon={<Users size={20} />}>Manage Parents</NavLink>
          <NavLink href="/admin/students" icon={<GraduationCap size={20} />}>Manage Students</NavLink>
          <NavLink href="/admin/hometuition" icon={<BookOpen size={20} />}>Manage Home Tuition</NavLink>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Teachers" value={stats.teachers} icon={<GraduationCap className="text-blue-600" />} color="bg-blue-50 border-blue-200" />
            <StatCard title="Non-Teaching Staff" value={stats.nonTeachers || 0} icon={<Users className="text-teal-600" />} color="bg-teal-50 border-teal-200" />
            <StatCard title="Active Vacancies" value={stats.vacancies} icon={<Briefcase className="text-green-600" />} color="bg-green-50 border-green-200" />
            <StatCard title="Coaching Institutes" value={stats.coachings} icon={<Crown className="text-purple-600" />} color="bg-purple-50 border-purple-200" />
            <StatCard title="Home Tuitions" value={stats.hometuition} icon={<BookOpen className="text-orange-600" />} color="bg-orange-50 border-orange-200" />
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              title="Add New Teacher"
              description="Register a new teacher manually."
              href="/teachersadmin" // Assuming list page has "Add" button
              buttonText="Go to Teachers"
            />
            <ActionCard
              title="Review Vacancies"
              description="Check and sort job listings."
              href="/admin/vacancies"
              buttonText="Manage Jobs"
            />
            <ActionCard
              title="View Home Tuition"
              description="See latest student requirements."
              href="/hometuition"
              buttonText="View List"
            />
            <ActionCard
              title="Manage Coaching"
              description="Approve or edit coaching institutes."
              href="/admin/coaching"
              buttonText="Go to Coaching"
            />
            <ActionCard
              title="Manage Non Teachers"
              description="Profiles of non-teaching staff."
              href="/nonteachersadmin"
              buttonText="Go to Non-Teachers"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, children, icon, active = false }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`p-6 rounded-xl border ${color} shadow-sm flex items-center gap-4`}>
      <div className="p-3 bg-white rounded-lg shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function ActionCard({ title, description, href, buttonText }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm">{description}</p>
      <Link href={href} className="text-blue-600 font-medium hover:underline text-sm flex items-center gap-1">
        {buttonText} &rarr;
      </Link>
    </div>
  )
}

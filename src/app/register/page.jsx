'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Briefcase, Building2, Users, School } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleNavigation = (path) => {
    if (status === 'authenticated') {
      router.push(path);
    } else {
      router.push(`/signup?callbackUrl=${path}`);
    }
  };

  const options = [
    {
      title: 'Teacher',
      description: 'Join as a faculty member, create your profile, and find teaching opportunities.',
      icon: <GraduationCap className="h-12 w-12 text-blue-600 mb-4" />,
      path: '/teachersadmin/new',
      color: 'border-blue-200 hover:border-blue-500 hover:shadow-blue-100',
      bg: 'bg-blue-50',
    },
    {
      title: 'Institute / Coaching',
      description: 'Register your institute, post vacancies, and manage your organization.',
      icon: <Building2 className="h-12 w-12 text-purple-600 mb-4" />,
      path: '/coaching/register',
      color: 'border-purple-200 hover:border-purple-500 hover:shadow-purple-100',
      bg: 'bg-purple-50',
    },
    {
      title: 'Non-Teaching Staff',
      description: 'Find administrative, support, and operational roles in education.',
      icon: <Briefcase className="h-12 w-12 text-green-600 mb-4" />,
      path: '/nonteachersadmin/new',
      color: 'border-green-200 hover:border-green-500 hover:shadow-green-100',
      bg: 'bg-green-50',
    },
    {
      title: 'School',
      description: 'Register your school, manage admissions, and showcase facilities.',
      icon: <School className="h-12 w-12 text-red-600 mb-4" />,
      path: '/schools/register',
      color: 'border-red-200 hover:border-red-500 hover:shadow-red-100',
      bg: 'bg-red-50',
    },
    {
      title: 'Student',
      description: 'Post your learning requirements and find the perfect tutor.',
      icon: <Users className="h-12 w-12 text-teal-600 mb-4" />,
      path: '/students/register',
      color: 'border-teal-200 hover:border-teal-500 hover:shadow-teal-100',
      bg: 'bg-teal-50',
    },
    {
      title: 'Parent',
      description: 'Find the best tutors for your child\'s education.',
      icon: <Users className="h-12 w-12 text-orange-600 mb-4" />,
      path: '/parents/register',
      color: 'border-orange-200 hover:border-orange-500 hover:shadow-orange-100',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Join Our Community</h1>
          <p className="text-xl text-gray-600">Select how you want to register with us today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(option.path)}
              className={`flex flex-col items-center text-center p-8 bg-white border-2 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-xl ${option.color}`}
            >
              <div className={`p-4 rounded-full mb-4 ${option.bg}`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{option.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
}

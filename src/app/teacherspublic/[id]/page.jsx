import React from 'react';
import Link from 'next/link';
import TeacherProfileView from '@/components/TeacherProfileView';
import dbConnect from '@/lib/db';
import Teacher from '@/model/Teacher';

async function getTeacher(id) {
  await dbConnect();
  try {
    const teacher = await Teacher.findById(id);
    return JSON.parse(JSON.stringify(teacher));
  } catch (error) {
    return null;
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TeacherProfilePage(props) {
  const params = await props.params;
  const teacher = await getTeacher(params.id);
  const session = await getServerSession(authOptions);

  if (!teacher) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <p className="text-gray-500 mt-2">Teacher profile not found</p>
        <Link href="/teacherspublic" className="mt-6 text-blue-600 hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  // Permission Logic
  const userRole = session?.user?.role;
  const userEmail = session?.user?.email;

  const isOwner = userEmail && teacher.email && userEmail === teacher.email;
  const isAdmin = userRole === 'admin';
  const isHR = userRole === 'hr';
  const isCoachingOwner = userRole === 'coaching'; // Assuming 'coaching' is the role for owners

  const canViewSalary = isAdmin || isOwner || isHR || isCoachingOwner;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-7xl mx-auto px-4">
        <TeacherProfileView teacher={teacher} canViewSalary={canViewSalary} />
      </div>
    </div>
  );
}
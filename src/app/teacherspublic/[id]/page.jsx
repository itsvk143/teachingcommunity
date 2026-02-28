import React from 'react';
import Link from 'next/link';
import TeacherProfileView from '@/components/TeacherProfileView';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';

async function getTeacher(id) {
  await dbConnect();
  try {
    // 1. Try direct ID lookup if it looks like a valid specific ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      const teacher = await Teacher.findById(id);
      if (teacher) return JSON.parse(JSON.stringify(teacher));
    }

    // 2. Fallback: Try finding by Last-6 characters of _id (displayed in UI)
    // Fetch generic fields needed to identify, then re-fetch full if needed, or just findOne logic
    // Since we can't easily regex _id, we fetch all (ok for this scale) or use aggregation
    // Optimisation: If valid ID failed, or not valid ID, we search.
    const allTeachers = await Teacher.find({}).lean();
    const teacher = allTeachers.find(t => t._id.toString().slice(-6) === id);

    if (teacher) {
      // If found by short ID, we might want to ensure we have the full document as findById would return
      // Since we did .find({}), we have it.
      return JSON.parse(JSON.stringify(teacher));
    }

    return null;
  } catch (error) {
    console.error("Error fetching teacher:", error);
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
  const isSchoolOwner = userRole === 'school';

  const canViewSalary = isAdmin || isOwner || isHR || isCoachingOwner || isSchoolOwner;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-7xl mx-auto px-4">
        <TeacherProfileView teacher={teacher} canViewSalary={canViewSalary} />
      </div>
    </div>
  );
}
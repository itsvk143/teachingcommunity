"use client";

import Link from 'next/link';

const getDirectImageUrl = (url) => {
  if (!url) return null;
  if (url.includes('drive.google.com') && url.includes('/d/')) {
    const id = url.split('/d/')[1].split('/')[0];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
};

export default function TeacherCard({ teacher }) {
  // 🔍 This will show the full teacher data in the browser console
  console.log(teacher);

  const validPhotoUrl = getDirectImageUrl(teacher?.photoUrl);

  return (
    <div className="flex border p-4 rounded-lg bg-zinc-900 text-white shadow-md">
      {/* Left section: Text */}
      <div className="flex-1 pr-4">
        <p><strong>Name:</strong> {teacher.name}</p>
        <p><strong>Subject:</strong> {teacher.subject}</p>
        <p><strong>Experience:</strong> {teacher.experience}</p>
        <p><strong>Institute:</strong> {teacher.coaching || 'N/A'}</p>

        {teacher.resume && (
          <p className="mt-2">
            <a href={teacher.resume} target="_blank" className="text-blue-400 underline">
              Download Resume
            </a>
          </p>
        )}

        <Link href={`/teacherspublic/${teacher.id || teacher.slug}`}>
          <p className="mt-3 text-blue-400 underline">View Profile</p>
        </Link>
      </div>

      {/* Right section: Image */}
      <div className="w-32 h-64 flex-shrink-0">
        <img
          src={validPhotoUrl || "/logo.png"}
          alt={teacher.name || "Teacher Photo"}
          className={`w-full h-full ${validPhotoUrl ? 'object-cover' : 'object-contain'} rounded-md`}
          onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; e.target.className = "w-full h-full object-contain rounded-md"; }}
        />
      </div>
    </div>
  );
}

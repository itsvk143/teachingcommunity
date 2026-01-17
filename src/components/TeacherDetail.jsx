'use client';
import React from 'react';
import Link from 'next/link';

const ensureAbsoluteUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('/')) return url; // Allow internal relative links
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function TeacherDetail({ teacher }) {
  // ... existing code ...
  // (Note: I need to insert the function outside or inside. Inside is fine for functional components or outside file scope. Outside is cleaner.)

  // Wait, I cannot easily insert outside with replace_file_content if I am targeting the whole file or a range.
  // Let me just replace the component start to include the helper, and then the links.

  // Actually, I'll put the helper at the top, and update the links.
  // ...

  return (
    <div className="max-w-4xl mx-auto p-6 text-white bg-zinc-900 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row gap-8">
        {teacher.photoUrl && (
          <div className="flex-shrink-0">
            <img
              src={teacher.photoUrl}
              alt={teacher.name}
              className="w-48 h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="flex-1 space-y-4">
          <div className="border-b border-zinc-700 pb-4">
            <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
            {teacher.age && <p className="text-zinc-300">Age: {teacher.age}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Information */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Contact Information</h3>

              {teacher.email && (
                <p><strong>Email:</strong> <a href={`mailto:${teacher.email}`} className="text-blue-400 underline hover:text-blue-300">{teacher.email}</a></p>
              )}

              {teacher.phone && (
                <p><strong>Phone:</strong> <a href={`tel:${teacher.phone}`} className="text-green-400 hover:text-green-300">{teacher.phone}</a></p>
              )}

              {teacher.whatsapp && (
                <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${teacher.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-400 underline hover:text-green-300">{teacher.whatsapp}</a></p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">Location</h3>

              {teacher.city && (
                <p><strong>City:</strong> {teacher.city}</p>
              )}

              {teacher.state && (
                <p><strong>State:</strong> {teacher.state}</p>
              )}

              {teacher.nativeState && (
                <p><strong>Native State:</strong> {teacher.nativeState}</p>
              )}
            </div>
          </div>

          {/* Teaching Information */}
          <div className="border-t border-zinc-700 pt-4">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">Teaching Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacher.subject && (
                <p><strong>Subject:</strong> {teacher.subject}</p>
              )}

              {teacher.experience && (
                <p><strong>Experience:</strong> {teacher.experience}</p>
              )}

              {teacher.currentInstitute && (
                <p><strong>Current Institute:</strong> {teacher.currentInstitute}</p>
              )}

              {teacher.previousInstitutes && (
                <p><strong>Previous Institutes:</strong> {teacher.previousInstitutes}</p>
              )}

              {teacher.ctc && (
                <p><strong>CTC:</strong> {teacher.ctc}</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="border-t border-zinc-700 pt-4">
            <h3 className="text-xl font-semibold text-red-400 mb-3">Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacher.maxQualification && (
                <p><strong>Highest Qualification:</strong> {teacher.maxQualification}</p>
              )}

              {teacher.maxQualificationCollege && (
                <p><strong>College (Highest):</strong> {teacher.maxQualificationCollege}</p>
              )}

              {teacher.graduationQualification && (
                <p><strong>Graduation:</strong> {teacher.graduationQualification}</p>
              )}

              {teacher.graduationCollege && (
                <p><strong>Graduation College:</strong> {teacher.graduationCollege}</p>
              )}

              {teacher.education && (
                <p className="md:col-span-2"><strong>Education Details:</strong> {teacher.education}</p>
              )}
            </div>
          </div>

          {/* About */}
          {teacher.about && (
            <div className="border-t border-zinc-700 pt-4">
              <h3 className="text-xl font-semibold text-green-400 mb-3">About</h3>
              <p className="text-zinc-200 leading-relaxed">{teacher.about}</p>
            </div>
          )}

          {/* Documents & Links */}
          <div className="border-t border-zinc-700 pt-4">
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">Documents & Links</h3>
            <div className="flex flex-wrap gap-4">
              {teacher.resumeLink && (
                <a
                  href={teacher.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  View Resume (PDF)
                </a>
              )}

              {/* Social Links */}
              {teacher.socialLinks && (
                <div className="flex gap-3">
                  {teacher.socialLinks.facebook && (
                    <a
                      href={ensureAbsoluteUrl(teacher.socialLinks.facebook)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      Facebook
                    </a>
                  )}

                  {teacher.socialLinks.linkedin && (
                    <a
                      href={ensureAbsoluteUrl(teacher.socialLinks.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}

                  {teacher.socialLinks.twitter && (
                    <a
                      href={ensureAbsoluteUrl(teacher.socialLinks.twitter)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-500 hover:bg-sky-600 px-3 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      Twitter
                    </a>
                  )}

                  {teacher.socialLinks.instagram && (
                    <a
                      href={ensureAbsoluteUrl(teacher.socialLinks.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-lg text-white text-sm transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <Link href="/teacher" className="inline-block bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium transition-colors">
              ← Back to Teacher List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
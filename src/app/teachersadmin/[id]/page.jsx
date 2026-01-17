'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TeacherDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchTeacher = async () => {
      try {
        const res = await fetch(`/api/teachers/${id}`);
        if (!res.ok) throw new Error('Failed to fetch teacher');
        const data = await res.json();
        setTeacher(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (!teacher) return <p className="p-4">Teacher not found</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">{teacher.name}</h1>
      <div className="space-y-2">
        <p><strong>Email:</strong> {teacher.email}</p>
        <p><strong>Phone:</strong> {teacher.phone}</p>
        <p><strong>Subject:</strong> {Array.isArray(teacher.subject) ? teacher.subject.join(', ') : teacher.subject}</p>
        <p><strong>Experience:</strong> {teacher.experience} years</p>
        <p><strong>Gender:</strong> {teacher.gender}</p>
        <p><strong>Education:</strong> {teacher.education}</p>
        <p><strong>Max Qualification:</strong> {teacher.maxQualification} ({teacher.maxQualificationCollege})</p>
        <p><strong>Graduation:</strong> {teacher.graduationQualification} ({teacher.graduationCollege})</p>

        {teacher.educationalQualification?.length > 0 && (
          <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
            <strong>School Education:</strong>
            <ul className="list-disc list-inside ml-2 mt-1">
              {teacher.educationalQualification.map((edu, idx) => (
                <li key={idx}>
                  {edu.qualification} - {edu.boardUniv} ({edu.year}, {edu.percentage}%, {edu.medium})
                </li>
              ))}
            </ul>
          </div>
        )}
        <p><strong>Currently Working:</strong> {teacher.currentlyWorkingIn}</p>
        <p><strong>State:</strong> {teacher.state}</p>
        <p><strong>Preferred State:</strong> {Array.isArray(teacher.preferedState) ? teacher.preferedState.join(', ') : teacher.preferedState}</p>
        <p><strong>CTC:</strong> {teacher.ctc} LPA</p>

        <div className="flex gap-4 mt-4">
          {teacher.about && (
            <p><strong>About:</strong> <a href={teacher.about} className="text-blue-600 underline" target="_blank">View</a></p>
          )}
          {teacher.resumeLink && (
            <p><strong>Resume:</strong> <a href={teacher.resumeLink} className="text-blue-600 underline" target="_blank">Download</a></p>
          )}
          {teacher.teachingVideoLink && (
            <p><strong>Teaching Video:</strong> <a href={teacher.teachingVideoLink} className="text-blue-600 underline" target="_blank">Watch</a></p>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => router.push(`/teachersadmin/${id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

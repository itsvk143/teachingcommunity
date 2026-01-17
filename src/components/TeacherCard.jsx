import Link from 'next/link';

export default function TeacherCard({ teacher }) {
  // 🔍 This will show the full teacher data in the browser console
  console.log(teacher);

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
          src={`/images/teachers/${teacher.slug}.JPG`}
          alt={`${teacher.name}'s photo`}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </div>
  );
}

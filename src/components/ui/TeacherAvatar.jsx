'use client'; // This must be a Client Component to handle image errors
import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function TeacherAvatar({ src, name }) {
  const [imageError, setImageError] = useState(false);

  // Logic: If there is no link OR if the image failed to load, show initials
  if (!src || imageError) {
    return (
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white">
        {/* Show first letter of name, or a User icon if name is missing */}
        {name ? name.charAt(0).toUpperCase() : <User className="w-12 h-12 opacity-50" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Teacher"}
      // This is the magic part: if the link is bad, it triggers this error
      onError={() => setImageError(true)} 
      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100"
    />
  );
}
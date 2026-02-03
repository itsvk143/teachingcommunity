'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ContactReveal({ phone, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!phone) return <span className="text-gray-400 text-xs">N/A</span>;

  // Create a masked version (e.g., "98765 XXXXX")
  // Keeps first 5 digits, masks the rest
  const maskedPhone = phone.length > 5 
    ? `${phone.slice(0, 5)}xxxxx`
    : 'xxxxx';

  const toggleVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-medium text-gray-800">
        {isVisible ? phone : maskedPhone}
      </span>
      <button
        onClick={toggleVisibility}
        className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
        type="button"
      >
        {isVisible ? (
          <>Hide</>
        ) : (
          <>View</>
        )}
      </button>
    </div>
  );
}

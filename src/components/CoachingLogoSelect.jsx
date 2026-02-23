import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Link as LinkIcon, AlertCircle } from 'lucide-react';

const availableLogos = [
    '/coachinglogo/logo.png', // Default
    '/coachinglogo/Aakash.jpg',
    '/coachinglogo/allen.jpeg',
    '/coachinglogo/chatainya.jpg',
    '/coachinglogo/chatinya.png',
    '/coachinglogo/drishti.jpeg',
    '/coachinglogo/extramarks.jpeg',
    '/coachinglogo/narayana.png',
    '/coachinglogo/pace.jpg',
    '/coachinglogo/pw.jpg',
    '/coachinglogo/reso.jpeg',
    '/coachinglogo/unacademy.webp',
    '/coachinglogo/utkarsh .jpeg',
    '/coachinglogo/vedantu.jpg'
];

export default function CoachingLogoSelect({ selectedLogoUrl, onChange, onLogoToggle }) {
    const [useCustomUrl, setUseCustomUrl] = useState(() => {
        // If the selected URL isn't one of the pre-defined ones and is not empty, 
        // it's a custom URL.
        return selectedLogoUrl && !availableLogos.includes(selectedLogoUrl) && selectedLogoUrl !== '/coachinglogo/logo.png';
    });

    const handleCustomToggle = () => {
        setUseCustomUrl(!useCustomUrl);
        if (useCustomUrl) {
            // Switched back to avatars - set to default if current is a custom URL
            if (!availableLogos.includes(selectedLogoUrl)) {
                onChange('/coachinglogo/logo.png');
            }
        }
    };

    const handleCustomUrlChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-indigo-500" />
                    Institute Logo
                </label>

                {/* Toggle between Grid and Custom URL */}
                <button
                    type="button"
                    onClick={handleCustomToggle}
                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                    {useCustomUrl ? (
                        <><Camera className="w-3 h-3" /> Select Logo</>
                    ) : (
                        <><LinkIcon className="w-3 h-3" /> Custom URL</>
                    )}
                </button>
            </div>

            {useCustomUrl ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                        type="url"
                        value={selectedLogoUrl}
                        onChange={handleCustomUrlChange}
                        placeholder="https://example.com/your-logo.jpg"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>Make sure the URL points directly to an image file (jpg, png, etc.)</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 sm:gap-4 max-h-[220px] overflow-y-auto p-2 bg-gray-50/50 rounded-xl border border-gray-100 custom-scrollbar">
                    {availableLogos.map((logo, index) => {
                        const isSelected = selectedLogoUrl === logo || (!selectedLogoUrl && logo === '/coachinglogo/logo.png');

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onChange(logo)}
                                className={`
                  relative aspect-square rounded-full flex items-center justify-center overflow-hidden border-4 transition-all duration-200
                  ${isSelected
                                        ? 'border-indigo-500 shadow-md scale-105 bg-white z-10'
                                        : 'border-transparent hover:border-indigo-200 hover:scale-105 hover:shadow-sm bg-white'
                                    }
                `}
                            >
                                {/* Visual indicator for selection */}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-indigo-500/10 z-10 rounded-full" />
                                )}

                                <Image
                                    src={logo}
                                    alt={`Logo option ${index + 1}`}
                                    fill
                                    className="object-cover p-1"
                                    sizes="(max-width: 768px) 60px, 80px"
                                    unoptimized={true} // Using unoptimized since these are local static files and Next.js might complain about external domains if custom URLs are used later
                                />
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

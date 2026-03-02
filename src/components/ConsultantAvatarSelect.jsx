import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Link as LinkIcon, AlertCircle } from 'lucide-react';

const availableAvatars = [
    '/consultantavatar/logo.png', // The default logo
    '/consultantavatar/avatar1.svg',
    '/consultantavatar/avatar2.svg',
    '/consultantavatar/avatar3.svg',
    '/consultantavatar/avatar4.svg'
];

export default function ConsultantAvatarSelect({ selectedAvatarUrl, onChange }) {
    const [useCustomUrl, setUseCustomUrl] = useState(() => {
        return selectedAvatarUrl && !availableAvatars.includes(selectedAvatarUrl) && selectedAvatarUrl !== '/consultantavatar/logo.png';
    });

    const handleCustomToggle = () => {
        setUseCustomUrl(!useCustomUrl);
        if (useCustomUrl) {
            if (!availableAvatars.includes(selectedAvatarUrl)) {
                onChange('/consultantavatar/logo.png');
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
                    Consultant Avatar
                </label>

                <button
                    type="button"
                    onClick={handleCustomToggle}
                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                    {useCustomUrl ? (
                        <><Camera className="w-3 h-3" /> Select Avatar</>
                    ) : (
                        <><LinkIcon className="w-3 h-3" /> Custom URL</>
                    )}
                </button>
            </div>

            {useCustomUrl ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                        type="url"
                        value={selectedAvatarUrl || ''}
                        onChange={handleCustomUrlChange}
                        placeholder="https://example.com/your-avatar.jpg"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>Make sure the URL points directly to an image file (jpg, png, etc.)</p>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 overflow-x-auto custom-scrollbar">
                    {availableAvatars.map((avatar, index) => {
                        const isSelected = selectedAvatarUrl === avatar || (!selectedAvatarUrl && avatar === '/consultantavatar/logo.png');

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onChange(avatar)}
                                className={`
                                    relative w-24 h-24 shrink-0 rounded-full flex items-center justify-center overflow-hidden border-4 transition-all duration-200
                                    ${isSelected
                                        ? 'border-indigo-500 shadow-md scale-105 bg-white z-10'
                                        : 'border-transparent hover:border-indigo-200 hover:scale-105 hover:shadow-sm bg-white'
                                    }
                                `}
                            >
                                {isSelected && (
                                    <div className="absolute inset-0 bg-indigo-500/10 z-10 rounded-full" />
                                )}

                                <Image
                                    src={avatar}
                                    alt={`Avatar option ${index + 1}`}
                                    fill
                                    className="object-cover p-1"
                                    sizes="96px"
                                    unoptimized={true}
                                />
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

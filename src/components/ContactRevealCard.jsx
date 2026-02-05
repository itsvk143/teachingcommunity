'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';

export default function ContactRevealCard({ phone, visibility = 'masked', canView = false }) {
    const [isVisible, setIsVisible] = useState(false);

    if (!phone) return null;

    // Admin/Owner or Explicitly Visible -> Show directly (or behave as normal view)
    // Actually, if visible/canView, we might still want to show it nicely. 
    // Let's say: 
    // - Hidden + !canView -> "Contact Hidden"
    // - Visible -> Show Number
    // - Masked -> Show Masked + Toggle

    if (visibility === 'hidden' && !canView) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 text-gray-500">
                <Phone className="w-5 h-5 shrink-0 opacity-50" />
                <span className="font-medium italic text-sm">Contact Number Private</span>
            </div>
        );
    }

    const showDirectly = visibility === 'visible' || canView || isVisible;

    const masked = phone.length > 5
        ? `${phone.slice(0, 5)}xxxxx`
        : 'xxxxx';

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 transition-all hover:bg-blue-50/50">
            <div className="flex items-center gap-3 text-gray-700 overflow-hidden">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                {showDirectly ? (
                    <a
                        href={`tel:${phone}`}
                        className="font-medium hover:text-blue-600 transition-colors truncate"
                        title="Click to call"
                    >
                        {phone}
                    </a>
                ) : (
                    <span className="font-medium text-gray-500 font-mono tracking-wide">{masked}</span>
                )}
            </div>

            {(visibility === 'masked' && !canView) && (
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="ml-2 text-xs font-bold text-blue-600 bg-blue-100/50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                    {isVisible ? 'HIDE' : 'VIEW'}
                </button>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';

export default function ContactRevealCard({ phone }) {
    const [isVisible, setIsVisible] = useState(false);

    if (!phone) return null;

    const masked = phone.length > 5
        ? `${phone.slice(0, 5)}xxxxx`
        : 'xxxxx';

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 transition-all hover:bg-blue-50/50">
            <div className="flex items-center gap-3 text-gray-700 overflow-hidden">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                {isVisible ? (
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
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="ml-2 text-xs font-bold text-blue-600 bg-blue-100/50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
            >
                {isVisible ? 'HIDE' : 'VIEW'}
            </button>
        </div>
    );
}

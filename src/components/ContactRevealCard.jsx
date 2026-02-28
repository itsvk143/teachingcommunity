'use client';

import { Phone } from 'lucide-react';

export default function ContactRevealCard({ phone, visibility = 'everyone', canView = false }) {
    if (!phone) return null;

    if (visibility === 'hr_only' && !canView) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 text-gray-500">
                <Phone className="w-5 h-5 shrink-0 opacity-50" />
                <span className="font-medium italic text-sm">Contact Number Private</span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 transition-all hover:bg-blue-50/50">
            <div className="flex items-center gap-3 text-gray-700 overflow-hidden">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <a
                    href={`tel:${phone}`}
                    className="font-medium hover:text-blue-600 transition-colors truncate"
                    title="Click to call"
                >
                    {phone}
                </a>
            </div>
        </div>
    );
}

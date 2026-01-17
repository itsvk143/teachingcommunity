'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationControls({ currentPage, totalPages, onPageChange, totalItems }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-2 border-t border-gray-100 mt-4">
      <div className="text-sm text-gray-500">
        Showing page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
        {totalItems && <span className="ml-1">({totalItems} total items)</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logic to show a window of pages around current page
            let p = i + 1;
            if (totalPages > 5) {
              if (currentPage > 3) p = currentPage - 2 + i;
              if (p > totalPages) p = totalPages - (4 - i);
            }

            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === p
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

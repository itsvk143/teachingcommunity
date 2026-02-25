import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Library | Teaching Community',
    description: 'Access study materials, books, and resources.',
};

export default function LibraryPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center relative pt-8">

                {/* Contribute Button - Absolute Top Right */}
                <div className="absolute top-4 right-4 z-20">
                    <Link
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfuTIpJ2jVxGTqXPjAKRZizZcph7Eo--BpUCR_fhHDmna2tPQ/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-full px-4 py-1.5 shadow-md transition-all text-xs"
                        >
                            Contribute Material
                        </Button>
                    </Link>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                <div className="p-10 pb-10 relative z-10 flex flex-col items-center">
                    {/* Icon Container with glowing effect */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative">
                            <BookOpen className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                            <Construction className="w-5 h-5 text-amber-600" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Library</span>
                    </h1>

                    <div className="bg-blue-50 text-blue-800 text-sm font-bold uppercase tracking-widest py-1.5 px-4 rounded-full mb-6 border border-blue-100 shadow-inner inline-block">
                        Coming Soon
                    </div>

                    <p className="text-gray-500 mb-8 max-w-[280px] mx-auto leading-relaxed">
                        We're building a comprehensive collection of e-books, study materials, and academic resources for our community.
                    </p>

                    {/* Category Buttons */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8 w-full">
                        {[
                            { label: 'NEET', href: 'https://cvksir.in/neetchemistry' },
                            { label: 'JEE MAINS', href: 'https://cvksir.in/jeemainschemistry' },
                            { label: 'JEE ADVANCE', href: 'https://cvksir.in/jeeadvancechemistry' },
                            { label: 'CBSE 10 BOARD' },
                            { label: 'CBSE 12 BOARD' },
                            { label: 'OLYMPIAD' },
                            { label: 'IMPORTANT BOOKS' },
                            { label: 'FIITJEE MATERIALS' },
                            { label: 'RESONANCE MATERIALS' },
                            { label: 'AAKASH MATERIALS' },
                            { label: 'NARAYANA MATERIALS' },
                            { label: 'ALLEN MATERIALS' }
                        ].map((category) => (
                            category.href ? (
                                <a
                                    key={category.label}
                                    href={category.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-white text-slate-800 text-sm font-bold rounded-full border border-gray-200 shadow-sm hover:border-blue-300 hover:text-blue-700 hover:shadow-md transition-all cursor-pointer"
                                >
                                    {category.label}
                                </a>
                            ) : (
                                <button
                                    key={category.label}
                                    className="px-5 py-2.5 bg-white text-slate-800 text-sm font-bold rounded-full border border-gray-200 shadow-sm hover:border-blue-300 hover:text-blue-700 hover:shadow-md transition-all cursor-default"
                                >
                                    {category.label}
                                </button>
                            )
                        ))}
                    </div>

                    <Link href="/" passHref>
                        <Button className="w-full sm:w-auto px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-semibold">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

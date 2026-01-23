"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Simplified popular categories
const CATEGORIES = [
    { name: "JEE Mains & Advanced", count: "1200+ Jobs", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { name: "NEET Medical", count: "1500+ Jobs", color: "bg-green-50 text-green-700 border-green-200" },
    { name: "CBSE / Board Exams", count: "900+ Jobs", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Foundation (Class 8-10)", count: "600+ Jobs", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { name: "UPSC / Civil Services", count: "300+ Jobs", color: "bg-red-50 text-red-700 border-red-200" },
    { name: "GATE / Engineering", count: "400+ Jobs", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

export default function CategoriesSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Categories</h2>
                        <p className="text-gray-600">Explore opportunities in high-demand sectors.</p>
                    </div>
                    <Link href="/vacancies" className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-800 transition">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat, idx) => (
                        <Link href="/vacancies" key={idx} className={`group p-4 rounded-xl border ${cat.color.split(' ')[2]} ${cat.color.split(' ')[0]} hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-32`}>
                            <div className="font-bold text-gray-900 group-hover:text-black transition-colors">{cat.name}</div>
                            <div className={`text-xs font-semibold ${cat.color.split(' ')[1]} opacity-80`}>{cat.count}</div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/vacancies" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition">
                        View All Categories <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

            </div>
        </section>
    );
}

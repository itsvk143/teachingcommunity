"use client";

import React from "react";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
    const TESTIMONIALS = [
        {
            text: "We hired 5 stellar faculty members within a week. The sorting features saved us hours of manual screening.",
            author: "Sanjay Gupta",
            role: "Director, Zenith Academy"
        },
        {
            text: "I found my dream job at a top coaching centre in Kota through this platform. The process was completely transparent.",
            author: "Rahul Verma",
            role: "Physics Faculty (JEE)"
        },
        {
            text: "A game changer for the education recruitment industry. Professional, fast, and reliable.",
            author: "Anjali Mehta",
            role: "HR Manager, Aakash Institute"
        }
    ];

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Success Stories</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Trusted by the Best</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, idx) => (
                        <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:bg-white hover:border-blue-200 group">
                            <Quote className="w-8 h-8 text-blue-200 mb-6 group-hover:text-blue-500 transition-colors" />
                            <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">&quot;{t.text}&quot;</p>
                            <div>
                                <p className="font-bold text-gray-900">{t.author}</p>
                                <p className="text-sm text-blue-600 font-medium">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

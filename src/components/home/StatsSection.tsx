"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Users2, CheckCircle, MapPin } from "lucide-react";

const STATS = [
    { label: "Registered Teachers", value: "5000+", icon: Users2, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Partner Institutes", value: "800+", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Active Vacancies", value: "1500+", icon: CheckCircle, color: "text-teal-600", bg: "bg-teal-100" },
    { label: "Cities Covered", value: "50+", icon: MapPin, color: "text-orange-600", bg: "bg-orange-100" },
];

const INSTITUTES = [
    "Aakash Institute", "Allen Career Institute", "Physics Wallah", "Unacademy", "FIITJEE", "Resonance", "Narayana Group", "Sri Chaitanya", "Vedantu"
];

export default function StatsSection() {
    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Trusted By Marquee (Simplified as static grid for now to avoid heavy libs) */}
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Trusted by Top Institutes</p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {INSTITUTES.map((name, i) => (
                            <span key={i} className="text-xl font-bold text-gray-400 hover:text-gray-800 transition-colors cursor-default">{name}</span>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                        >
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

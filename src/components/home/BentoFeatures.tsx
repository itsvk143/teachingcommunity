"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Zap, UserCheck, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BentoFeatures() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose TeachingCommunity?</h2>
                    <p className="text-lg text-gray-600">Built for speed, trust, and transparency. Whether you are hiring or looking for a job, we have optimized the process.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Smart Search (Large) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl overflow-hidden relative group"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 hover:opacity-10 transition-opacity">
                            <Search className="w-64 h-64 text-blue-600" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <Search className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Candidate Discovery</h3>
                                <p className="text-gray-600 max-w-md">Institutes can filter teachers by specific exams (JEE, NEET), experience, and location. Teachers can find jobs that match their exact expertise.</p>
                            </div>
                            <div className="mt-8">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 max-w-sm">
                                    <div className="flex gap-2 mb-2">
                                        <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-gray-600">Physics</span>
                                        <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-gray-600">JEE Advanced</span>
                                        <span className="bg-white border rounded px-2 py-1 text-xs font-semibold text-gray-600">5+ Years</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-blue-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Verified Profiles (Tall) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:row-span-2 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">100% Verified Profiles</h3>
                            <p className="text-blue-100 mb-8 leading-relaxed">
                                Trust is our currency. Every teacher and institute profile undergoes a strict verification process to ensure authenticity.
                            </p>

                            <div className="mt-auto bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                        <UserCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Verification Status</p>
                                        <p className="text-xs text-blue-200">Documents Checked</p>
                                    </div>
                                    <CheckCircle className="ml-auto w-5 h-5 text-green-400" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Identity</p>
                                        <p className="text-xs text-blue-200">Aadhaar/PAN Verified</p>
                                    </div>
                                    <CheckCircle className="ml-auto w-5 h-5 text-green-400" />
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* Card 3: Fast Hiring */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl"
                    >
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Commission</h3>
                        We don&apos;t charge a cut from your salary or hiring budget. A transparent subscription model for institutes, and free for teachers.
                    </motion.div>

                    {/* Card 4: CTA */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-xl cursor-pointer"
                    >
                        <h3 className="text-2xl font-bold text-white mb-2">Ready to Start?</h3>
                        <p className="text-gray-400 text-sm mb-6">Join thousands of others today.</p>
                        <Link href="/register">
                            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl py-6">
                                Get Started <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Users, UserCog, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <section className="relative min-h-[85vh] flex items-center pt-24 pb-12 overflow-hidden bg-white">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-3xl opacity-60 z-0 translate-x-1/2 -translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-left"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                            India&apos;s #1 Education Network
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                            Find Your Place in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Education.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                            Connecting 5000+ ambitious educators and staff with the best schools and coaching institutes across the nation.
                        </motion.p>

                        {/* Quick Access Bento */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3 max-w-md">
                            <Link href="/vacancies" className="contents">
                                <div className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">Find Jobs</h3>
                                        <p className="text-xs text-gray-500">For Teachers</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/teacherspublic" className="contents">
                                <div className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">Hire Faculty</h3>
                                        <p className="text-xs text-gray-500">For Institutes</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/nonteacherspublic" className="contents">
                                <div className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-teal-500 hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                        <UserCog className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">Hire Staff</h3>
                                        <p className="text-xs text-gray-500">Admins, HR...</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/hometuition" className="contents">
                                <div className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-orange-500 hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <HomeIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">Home Tuition</h3>
                                        <p className="text-xs text-gray-500">Local Tutors</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Visual/Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        {/* Abstract Composition */}
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            <div className="absolute top-[10%] right-[10%] w-[80%] h-[80%] bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-[2rem] transform rotate-3"></div>

                            {/* Floating Cards Simulation */}
                            <div className="absolute top-0 right-0 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 w-64 transform translate-x-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">JD</div>
                                    <div>
                                        <p className="font-bold text-sm">John Doe</p>
                                        <p className="text-xs text-gray-500">Physics Faculty</p>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full mb-2">
                                    <div className="h-full w-[80%] bg-green-500 rounded-full"></div>
                                </div>
                                <p className="text-xs text-gray-500">Profile Completeness: 80%</p>
                            </div>

                            <div className="absolute bottom-10 left-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 w-64 transform -translate-x-6 z-20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">NEET Chemistry</p>
                                        <p className="text-xs text-gray-500">₹12L - ₹18L PA</p>
                                    </div>
                                </div>
                                <Button size="sm" className="w-full bg-blue-600 text-xs h-8">Apply Now</Button>
                            </div>

                            {/* Center Element */}
                            <div className="absolute inset-0 m-auto w-48 h-48 bg-white/80 backdrop-blur-sm rounded-full border border-white/50 shadow-2xl flex items-center justify-center z-10">
                                <div className="text-center">
                                    <span className="block text-4xl font-extrabold text-blue-600">5k+</span>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teachers</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

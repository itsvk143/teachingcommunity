"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Users, UserCog, Home as HomeIcon } from "lucide-react";

const CAROUSEL_ITEMS = [
    {
        id: 1,
        title: "TEACHER",
        image: "/teacher.jpg",
        color: "from-blue-600 to-blue-900"
    },
    {
        id: 2,
        title: "STUDENT",
        image: "/student.jpg",
        color: "from-green-600 to-green-900"
    },
    {
        id: 3,
        title: "NON ACADEMIC STAFF",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        color: "from-teal-600 to-teal-900"
    },
    {
        id: 4,
        title: "HOMETUTION",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        color: "from-orange-600 to-orange-900"
    },
    {
        id: 5,
        title: "COACHING",
        image: "/teacher.jpg",
        color: "from-indigo-600 to-indigo-900"
    },
    {
        id: 6,
        title: "SCHOOL",
        image: "https://unsplash.com/illustrations/a-red-school-building-with-a-sign-that-says-school-DJljIquCNzc",
        color: "from-purple-600 to-purple-900"
    },
    {
        id: 7,
        title: "PARENTS",
        image: "/parent.jpg",
        color: "from-pink-600 to-pink-900"
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

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
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">

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

                    {/* Image Carousel Side */}
                    <div className="relative block h-[400px] lg:h-[500px] w-full mt-12 lg:mt-0">
                        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-gray-100">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0"
                                >
                                    {/* Image */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={CAROUSEL_ITEMS[currentSlide].image}
                                        alt={CAROUSEL_ITEMS[currentSlide].title}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${CAROUSEL_ITEMS[currentSlide].color} mix-blend-multiply opacity-60`}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                    {/* Text Content */}
                                    <div className="absolute bottom-10 left-10 right-10 z-10">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <h2 className="text-4xl font-black text-white tracking-wide uppercase mb-2 drop-shadow-lg">
                                                {CAROUSEL_ITEMS[currentSlide].title}
                                            </h2>
                                            <div className="h-1.5 w-24 bg-white rounded-full"></div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Progress Indicators */}
                            <div className="absolute top-8 right-8 flex gap-2 z-20">
                                {CAROUSEL_ITEMS.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Decorative floating elements */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -z-10 top-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-2xl opacity-50"></div>
                    </div>

                </div>
            </div>
        </section>
    );
}

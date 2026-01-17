"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Users, CheckCircle2, Quote, UserCog, Home as HomeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden">

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-white">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                #1 Platform for Education Professionals
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Bridging the Gap Between <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Talent & Opportunity</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                We connect aspiring educators and support staff with top-tier institutes. Build your career or build your faculty—start your journey today.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full px-4">
                <Link href="/vacancies" className="w-full">
                  <Button className="w-full h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Find Jobs
                  </Button>
                </Link>
                <Link href="/teacherspublic" className="w-full">
                  <Button variant="outline" className="w-full h-14 text-lg rounded-xl border-2 border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-all hover:scale-105">
                    <Users className="mr-2 h-5 w-5" />
                    Find Teachers
                  </Button>
                </Link>
                <Link href="/nonteacherspublic" className="w-full">
                  <Button variant="outline" className="w-full h-14 text-lg rounded-xl border-2 border-gray-200 bg-white hover:border-teal-600 hover:text-teal-600 transition-all hover:scale-105">
                    <UserCog className="mr-2 h-5 w-5" />
                    Find Staff
                  </Button>
                </Link>
                <Link href="/hometuition" className="w-full">
                  <Button variant="outline" className="w-full h-14 text-lg rounded-xl border-2 border-gray-200 bg-white hover:border-orange-500 hover:text-orange-600 transition-all hover:scale-105">
                    <HomeIcon className="mr-2 h-5 w-5" />
                    Find Tuition
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/80 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 max-w-5xl mx-auto transform translate-y-1/2"
            >
              <StatItem label="Registered Teachers" value="5,000+" />
              <StatItem label="Partner Institutes" value="800+" />
              <StatItem label="Active Vacancies" value="1,500+" />
              <StatItem label="Cities Covered" value="50+" />
            </motion.div>
          </div>
        </section>


        {/* ================= ROLES SECTION ================= */}
        <section className="py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
              <p className="text-lg text-gray-600">Tailored solutions for every stakeholder in the education ecosystem.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Institutes */}
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <GraduationCap className="w-48 h-48 text-blue-600" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">For Institutes</h3>
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    Streamline hiring. Access verified teachers & staff, and post vacancies to find your perfect match.
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                    <FeatureItem text="Verified Faculty & Staff" />
                    <FeatureItem text="Smart Candidate Filtering" />
                    <FeatureItem text="Zero Commission Hiring" />
                  </ul>
                  <div className="flex gap-4">
                    <Link href="/coaching/register">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base shadow-lg shadow-blue-600/20">Register Institute</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Teachers */}
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="w-48 h-48 text-indigo-600" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">For Teachers</h3>
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    Accelerate your career. Create a profile, get discovered by top institutes, and apply to premium jobs.
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                    <FeatureItem text="Professional Profile Builder" />
                    <FeatureItem text="Real-time Job Alerts" />
                    <FeatureItem text="Direct Application Tracking" />
                  </ul>
                  <div className="flex gap-4">
                    <Link href="/teachersadmin/new">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 text-base shadow-lg shadow-indigo-600/20">Teacher Profile</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Non-Teaching Staff (NEW) */}
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <UserCog className="w-48 h-48 text-teal-600" />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
                    <UserCog className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">For Non-Teaching</h3>
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    Find admin and support roles. Join as a Counselor, Accountant, HR, or other administrative staff.
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                    <FeatureItem text="Admin & Support Roles" />
                    <FeatureItem text="Connect with Top Institutes" />
                    <FeatureItem text="Career Growth Opportunities" />
                  </ul>
                  <div className="flex gap-4">
                    <Link href="/nonteachersadmin/new">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-6 text-base shadow-lg shadow-teal-600/20">Staff Profile</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS (NEW) ================= */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Success Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Trusted by the Best</h2>
          </div>

          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="We hired 5 stellar faculty members within a week. The sorting features saved us hours of manual screening."
              author="Director, Zenith Academy"
              role="Institute Partner"
            />
            <TestimonialCard
              quote="I found my dream job at a top coaching centre in Kota through this platform. The process was completely transparent."
              author="Rahul Verma"
              role="Physics Faculty"
            />
            <TestimonialCard
              quote="A game changer for the education recruitment industry. Professional, fast, and reliable."
              author="HR Manager, Aakash Institute"
              role="Recruiter"
            />
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section className="py-24 relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Future?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join the fastest-growing community of educators and institutes in India. It&apos;s free to get started.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={session ? "/dashboard" : "/login"}>
                <Button className="h-14 px-10 bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg rounded-full">
                  {session ? "Go to Dashboard" : "Sign Up Now"}
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Teaching<span className="text-blue-600">Community</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering educators and institutes to build a better future together.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/teacherspublic" className="hover:text-blue-600">Find Teachers</Link></li>
              <li><Link href="/vacancies" className="hover:text-blue-600">Find Jobs</Link></li>
              <li><Link href="/nonteacherspublic" className="hover:text-blue-600">Non-Teaching Staff</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Help Center</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
            <div className="flex gap-4">
              <SocialIcon>X</SocialIcon>
              <SocialIcon>in</SocialIcon>
              <SocialIcon>fb</SocialIcon>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TeachingCommunity. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

// --- SUBCOMPONENTS ---

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">{value}</div>
      <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 bg-green-100 p-0.5 rounded-full">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      </div>
      <span className="text-gray-700 font-medium">{text}</span>
    </li>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow relative">
      <Quote className="w-8 h-8 text-blue-200 mb-4" />
      <p className="text-gray-700 mb-6 italic leading-relaxed">&quot;{quote}&quot;</p>
      <div>
        <p className="font-bold text-gray-900">{author}</p>
        <p className="text-sm text-blue-600">{role}</p>
      </div>
    </div>
  )
}

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer font-bold text-sm">
      {children}
    </div>
  )
}

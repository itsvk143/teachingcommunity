"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";

import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import BentoFeatures from "@/components/home/BentoFeatures";
import CategoriesSection from "@/components/home/CategoriesSection";
import TestimonialsSection from "@/components/home/TestimonialSection";

import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

      <main>
        <HeroSection />
        <StatsSection />
        <BentoFeatures />
        <CategoriesSection />
        <TestimonialsSection />

        {/* ================= CALL TO ACTION ================= */}
        <section className="py-24 relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Future?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join the fastest-growing community of educators and institutes in India. It&apos;s free to get started.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={session ? "/dashboard" : "/register"}>
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
            <Link href="/contact" className="flex items-center gap-2 mb-4">
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

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer font-bold text-sm">
      {children}
    </div>
  )
}

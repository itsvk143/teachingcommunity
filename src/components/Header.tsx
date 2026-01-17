"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import { GraduationCap, User, LogOut, LayoutDashboard, Shield, ChevronDown } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="py-4 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">

        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
            <GraduationCap className="text-blue-600 h-6 w-6" />
          </div>
          <h1 className="text-xl xl:text-2xl font-bold text-gray-800 tracking-tight">
            Teaching<span className="text-blue-600">Community</span>
          </h1>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden xl:flex items-center gap-8">
          <Nav />
        </div>

        {/* USER ACTIONS (Desktop) */}
        <div className="hidden xl:flex items-center gap-4">
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                  {session.user?.name}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>

                  <div className="py-1">
                    {session.user?.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-semibold text-gray-600 hover:text-blue-600">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md rounded-full px-6">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
"use client";

import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, LogOut, LayoutDashboard, Shield, Mail, MessageSquare } from "lucide-react";
import { navLinks } from "./Nav";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

const MobileNav = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread messages
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/messages/unread')
        .then(res => res.json())
        .then(data => setUnreadCount(data.unread || 0))
        .catch(err => console.error(err));
    }
  }, [session]);

  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <Menu className="w-8 h-8 text-blue-600" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-white overflow-y-auto w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

        {/* Header / Logo */}
        <div className="mt-8 mb-8 text-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Teaching<span className="text-blue-600">Community</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4 mb-4">
          <SheetClose asChild>
            <Link
              href="/discussion"
              className={`${pathname === '/discussion'
                ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 pl-3"
                : "text-gray-600 hover:text-blue-600 pl-4"
                } text-lg font-medium py-2 transition-all flex items-center gap-3`}
            >
              <MessageSquare className="w-5 h-5" /> Community Forum
            </Link>
          </SheetClose>

          {navLinks.map((link, index) => {
            const isActive = link.path === pathname;
            return (
              <SheetClose asChild key={index}>
                <Link
                  href={link.path}
                  className={`${isActive
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 pl-3"
                    : "text-gray-600 hover:text-blue-600 pl-4"
                    } text-lg font-medium py-2 transition-all flex items-center`}
                >
                  {link.name}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-100 my-2"></div>

        {/* Auth Section */}
        <div className="mt-auto pb-8 space-y-4">
          {session ? (
            <div className="space-y-4">
              {/* User Info */}
              <div className="px-4 py-3 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-900 truncate">{session.user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
              </div>

              {/* User Actions */}
              <div className="space-y-2">
                <SheetClose asChild>
                  <Link href="/inbox">
                    <Button variant="outline" className="w-full justify-start gap-2 relative border-gray-200 hover:bg-gray-50">
                      <Mail className="w-4 h-4 text-gray-500" /> Inbox
                      {unreadCount > 0 && (
                        <span className="absolute right-4 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                      )}
                    </Button>
                  </Link>
                </SheetClose>

                {(session.user?.role === 'admin') && (
                  <SheetClose asChild>
                    <Link href="/admin">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Button>
                    </Link>
                  </SheetClose>
                )}

                <SheetClose asChild>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Button>
                  </Link>
                </SheetClose>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 px-2">
              <SheetClose asChild>
                <Link href="/login">
                  <Button variant="outline" className="w-full font-semibold border-gray-300">
                    Log In
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

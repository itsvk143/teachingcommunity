"use client";

import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { navLinks } from "./Nav";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

const MobileNav = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <Menu className="w-8 h-8 text-blue-600" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-white overflow-y-auto w-[300px] sm:w-[400px]">

        {/* Header / Logo */}
        <div className="mt-8 mb-8 text-center">
          <Link href="/contact">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Teaching<span className="text-blue-600">Community</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4 mb-8">
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

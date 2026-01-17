"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";
import { navLinks } from "./Nav"; // Import shared links

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-blue-600" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-white">
        <div className="mt-20 mb-10 text-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-800">
              Teaching<span className="text-blue-600">Community</span>
            </h1>
          </Link>
        </div>
        <nav className="flex flex-col justify-center items-center gap-6">
          {navLinks.map((link, index) => {
            return (
              <Link
                href={link.path}
                key={index}
                className={`${link.path === pathname &&
                  "text-blue-600 border-b-2 border-blue-600"
                  } text-lg capitalize font-medium hover:text-blue-600 transition-all`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

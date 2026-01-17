"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks = [
  {
    name: "HOME",
    path: "/",
  },
  {
    name: "INSTITUTE",
    path: "/coaching",
  },
  {
    name: "SCHOOL",
    path: "/schools",
  },
  {
    name: "VACANCY",
    path: "/vacancies",
  },
  {
    name: "HOME TUITION",
    path: "/hometuition",
  },
  {
    name: "TEACHER",
    path: "/teacherspublic",
  },
  {
    name: "NON TEACHER",
    path: "/nonteacherspublic",
  },
  {
    name: "ABOUT",
    path: "/contact",
  },
];

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 items-center">
      {navLinks.map((link, index) => {
        return (
          <Link
            href={link.path}
            key={index}
            className={`${link.path === pathname && "text-blue-600 border-b-2 border-blue-600"
              } capitalize font-medium hover:text-blue-600 transition-all text-sm xl:text-base`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks = [
  {
    name: "DISCUSSION",
    path: "/discussion",
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
    name: "SCHOOL",
    path: "/schools",
  },
  {
    name: "INSTITUTE",
    path: "/coaching",
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
    name: "CONSULTANT",
    path: "/consultants",
  },
  {
    name: "STUDENTS",
    path: "/students",
  },
  {
    name: "PARENTS",
    path: "/parents",
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

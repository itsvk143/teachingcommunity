"use client"; // Required for Next.js 13+ with App Router

import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

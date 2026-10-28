"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "@/lib/api";

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

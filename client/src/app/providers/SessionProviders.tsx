"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "@/lib/api";
import { ToastProvider } from "@/context/ToastContext";

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}

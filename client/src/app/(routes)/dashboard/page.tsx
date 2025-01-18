"use client";

import React, { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "CONTRACTOR") {
        router.push("/dashboard/contractor");
      } else {
        router.push("/dashboard/institution");
      }
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
          className="w-12 h-12 mx-auto mb-6 border-t-2 border-r-2 border-yellow-500 rounded-full"
        />
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
          Redirecting...
        </h2>
        <p className="mt-4 text-neutral-400">Please wait while we direct you to your dashboard</p>
      </motion.div>
    </div>
  );
};

export default Page;
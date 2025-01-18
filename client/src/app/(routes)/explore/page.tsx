"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import ExplorePage from "@/app/components/contractor/ExplorePage";
import ExplorePageColleges from "@/app/components/colleges/ExplorePageColleges";

const Page = () => {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    setRole(session?.user?.role);
  }, [status, session]);

  if (status === "loading" || role === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-full"
        >
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {role === "CONTRACTOR" ? <ExplorePage /> : <ExplorePageColleges />}
    </motion.div>
  );
};

export default Page;
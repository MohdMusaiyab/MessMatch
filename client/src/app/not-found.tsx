"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Diamond, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center p-8 bg-neutral-900/60 border border-yellow-900/30 rounded-2xl shadow-2xl backdrop-blur-md"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
            <Diamond className="w-12 h-12 text-yellow-500 animate-pulse" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
          The page or contract you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white text-sm font-medium transition-all shadow-lg shadow-yellow-900/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}


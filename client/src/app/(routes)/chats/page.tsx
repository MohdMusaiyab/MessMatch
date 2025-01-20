"use client"
import React from 'react';
import { motion } from 'framer-motion';

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md p-8 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-yellow-900/20 text-center"
      >
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-yellow-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-4">
          Coming Soon
        </h1>
        
        <p className="text-neutral-300 mb-6">
          The chat feature is currently under development. We're working hard to bring you a seamless communication experience.
        </p>

        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-700"
            initial={{ width: "0%" }}
            animate={{ width: "60%" }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
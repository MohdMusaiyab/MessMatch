"use client"
import React from "react";
import { motion } from "framer-motion";

// Functional component with TypeScript
const About: React.FC = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="container mx-auto text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"
        >
          About Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-neutral-300 mb-12 max-w-3xl mx-auto"
        >
          We are dedicated to bridging the gap between mess contractors and
          educational institutions as well as corporate clients. Our platform
          facilitates seamless connections, ensuring that everyone has access to
          quality catering services.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900/50 backdrop-blur p-8 rounded-lg border border-yellow-900/20 shadow-lg hover:shadow-yellow-500/10 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-white">Our Mission</h3>
            <p className="text-neutral-400">
              To provide a reliable and efficient platform that connects mess
              contractors with colleges and corporates, ensuring high-quality
              catering solutions tailored to diverse needs.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-neutral-900/50 backdrop-blur p-8 rounded-lg border border-yellow-900/20 shadow-lg hover:shadow-yellow-500/10 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-white">Our Vision</h3>
            <p className="text-neutral-400">
              To be the leading platform in the catering industry, recognized
              for our commitment to quality, reliability, and customer
              satisfaction.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;

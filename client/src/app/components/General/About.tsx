"use client"
"use client"
import React from "react";
import { motion } from "framer-motion";
import { Target, Globe, Users } from "lucide-react";

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div 
      id="about" 
      className="py-16 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 overflow-hidden"
    >
      <div className="container mx-auto text-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
            Transforming Institutional Dining
          </h2>
          <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
            Revolutionizing food service connections through technology, trust, and tailored solutions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-neutral-900/50 backdrop-blur p-8 rounded-lg border border-yellow-900/20 shadow-lg group"
          >
            <Target className="w-12 h-12 text-yellow-500 mx-auto mb-4 group-hover:rotate-12 transition-transform" />
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Precision Matching
            </h3>
            <p className="text-neutral-400">
              Advanced algorithm connecting mess contractors with perfect institutional partners.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-neutral-900/50 backdrop-blur p-8 rounded-lg border border-yellow-900/20 shadow-lg group"
          >
            <Globe className="w-12 h-12 text-yellow-500 mx-auto mb-4 group-hover:rotate-6 transition-transform" />
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Expansive Network
            </h3>
            <p className="text-neutral-400">
              Nationwide reach connecting top-tier contractors across diverse institutional landscapes.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-neutral-900/50 backdrop-blur p-8 rounded-lg border border-yellow-900/20 shadow-lg group"
          >
            <Users className="w-12 h-12 text-yellow-500 mx-auto mb-4 group-hover:-rotate-6 transition-transform" />
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Community Trust
            </h3>
            <p className="text-neutral-400">
              Building transparent, reliable ecosystem through verified profiles and real-time feedback.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
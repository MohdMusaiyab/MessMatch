"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, ArrowRight, Shield, Star, Award } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    {
      icon: Shield,
      title: "Dynamic Auction System",
      description:
        "Empower your institution to create competitive auctions where mess contractors can bid for your business Get the best value and quality by choosing from a range of tailored proposals!",
    },
    {
      icon: Star,
      title: "Showcase Menus",
      description:
        "Explore a diverse selection of mess contractors showcasing their menus and portfolios Make informed decisions by reviewing offerings that cater to your institution's unique dining needs!",
    },
    {
      icon: Award,
      title: "Connect Directly",
      description: "Facilitate seamless communication with our direct chat feature.Engage with contractors in real-time to discuss requirements, negotiate terms, and build strong partnerships!",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-yellow-600/5" />

      <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <div className="flex justify-center md:justify-start mb-6">
            <Diamond className="text-yellow-500 w-12 h-12" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-200 text-transparent bg-clip-text">
              Revolutionize Dining
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 mb-8 leading-relaxed">
            Bridging the Gap Between Institutions and Quality Food Providers.
            Together, let&#39;s elevate dining experiences and foster lasting
            partnerships!
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-12">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-lg flex items-center justify-center transition-all"
            >
              <span className="text-white font-semibold">Get Started</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#about"
              className="px-8 py-4 border border-yellow-700/50 hover:border-yellow-600 rounded-lg text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Content - Animated Features */}
        <div className="relative h-[400px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full"
            >
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 space-y-4">
                {React.createElement(features[activeFeature].icon, {
                  className: "text-yellow-500 w-12 h-12 mx-auto mb-4",
                })}
                <h3 className="text-2xl font-semibold text-yellow-500 text-center">
                  {features[activeFeature].title}
                </h3>
                <p className="text-neutral-300 text-center">
                  {features[activeFeature].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Hero;

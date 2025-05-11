"use client";
import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Network, Shield, MessageCircle, Bell, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
}

const Features: React.FC = () => {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);

  const features: Feature[] = useMemo(
    () => [
      {
        icon: Network,
        title: "Precision Contractor Matching",
        description:
          "Connects mess contractors with colleges/corporates based on menu expertise, pricing, and location.",
        details: [
          "Advanced filters (Ratings,State,Services Offered)",
          "Real-time contractor availability status",
          "Verified reviews from partnered institutions",
        ],
      },
      {
        icon: Shield,
        title: "Secure Ecosystem",
        description: "Comprehensive verification and trust-building platform.",
        details: [
          "Multi-layer contractor verification",
          "Transparent performance ratings",
          "Secure Chatting mechanisms",
        ],
      },
      {
        icon: MessageCircle,
        title: "Interactive Communication",
        description:
          "Seamless communication bridge between contractors and institutions.",
        details: [
          "Instant messaging platform",
          "Negotiation and proposal tools",
          "Performance feedback system",
        ],
      },
      {
        icon: Bell,
        title: "Smart Notifications",
        description: "Proactive updates and intelligent alert system.",
        details: [
          "Customizable notification preferences",
          "Real-time auction and bidding alerts",
          "Performance milestone tracking",
        ],
      },
    ],
    []
  );

  const handleFeatureClick = useCallback((index: number) => {
    setActiveFeature(index);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (custom: number) => ({
      opacity: activeFeature === custom ? 1 : 0.5,
      x: 0,
      transition: { duration: 0.5 },
    }),
  };

  return (
    <div className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-24 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent text-center md:col-span-2">
          Features
        </h1>

        {/* Features List */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.button
              key={feature.title}
              type="button"
              onClick={() => handleFeatureClick(index)}
              aria-label={`View ${feature.title} details`}
              aria-current={activeFeature === index}
              custom={index}
              variants={itemVariants}
              className={`
                w-full text-left cursor-pointer p-6 rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-yellow-500
                ${
                  activeFeature === index
                    ? "bg-neutral-900/70 border border-yellow-500/30"
                    : "hover:bg-neutral-900/40"
                }
              `}
            >
              <div className="flex items-center space-x-4">
                {React.createElement(feature.icon, {
                  className: `
                    w-10 h-10 
                    ${
                      activeFeature === index
                        ? "text-yellow-500 ring-2 ring-yellow-500/50 rounded-full"
                        : "text-neutral-600"
                    }
                  `,
                })}
                <h3
                  className={`
                  text-xl font-semibold 
                  ${
                    activeFeature === index
                      ? "text-yellow-500"
                      : "text-neutral-300"
                  }
                `}
                >
                  {feature.title}
                </h3>
              </div>
              {activeFeature === index && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-2"
                >
                  <p className="text-neutral-400">{feature.description}</p>
                  <ul className="text-neutral-500 list-disc list-inside">
                    {feature.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Interactive Feature Visualization */}
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900/50 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/20"
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {React.createElement(features[activeFeature].icon, {
              className: "w-24 h-24 text-yellow-500 mb-4",
            })}
            <h2 className="text-3xl font-bold text-yellow-500 text-center">
              {features[activeFeature].title}
            </h2>
            <p className="text-neutral-300 text-center max-w-md">
              {features[activeFeature].description}
            </p>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/explore`
                )
              }
              className="
                flex items-center space-x-2 
                bg-gradient-to-r from-yellow-600 to-yellow-700 
                text-white px-6 py-3 rounded-lg 
                hover:from-yellow-700 hover:to-yellow-800 
                transition-all
              "
            >
              <span>Explore {features[activeFeature].title}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* SEO Hidden Content for First Feature */}
        <div className="sr-only" aria-hidden="true">
          <h2>{features[0].title}</h2>
          <p>{features[0].description}</p>
          <ul>
            {features[0].details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Features;

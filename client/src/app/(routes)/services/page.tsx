"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Services: React.FC = () => {
  const services = [
    {
      title: "Mess Contractor Bidding",
      description:
        "Colleges and institutions can host auctions for mess services, receiving competitive bids from verified contractors.",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      features: [
        "Transparent bidding process",
        "Verified contractor profiles",
        "Deadline tracking",
      ],
    },
    {
      title: "Contract Management",
      description:
        "Digital tools to create, sign, and monitor mess service agreements between institutions and contractors.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      features: [
        "E-signature support",
        "Automated reminders",
        "Performance clauses",
      ],
    },
    {
      title: "Menu Planning",
      description:
        "Contractors can showcase meal plans with nutritional information and specialty diets.",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      features: [
        "Dietary filters (veg/non-veg)",
        "Weekly rotation planner",
        "Cost breakdowns",
      ],
    },
    {
      title: "Quality Assurance",
      description:
        "Institutions can rate contractors based on hygiene, taste, and service quality.",
      image:
        "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      features: [
        "Star ratings system",
        "Feedback reports",
        "FSSAI compliance tracking",
      ],
    },
    {
      title: "Payment Escrow",
      description:
        "Secure payment handling with milestone-based releases to protect both parties.",
      image:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      features: [
        "Payment protection",
        "Automated invoicing",
        "Dispute resolution",
      ],
    },
    {
      title: "Direct Messaging",
      description:
        "Built-in communication for real-time negotiations and issue resolution.",
      image:
        "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      features: [
        "Encrypted messaging",
        "File sharing (PDF menus)",
        "Notification alerts",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[40vh] md:h-[50vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
            alt="Institutional Dining Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 to-neutral-950"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
              Institutional Mess Solutions
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl max-w-2xl mx-auto">
              Streamlining connections between educational institutions and
              quality food service providers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-md bg-neutral-900/30 rounded-xl overflow-hidden border border-yellow-900/20 shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-yellow-500">
                  {service.title}
                </h2>
                <p className="text-neutral-300 mb-4">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-neutral-400"
                    >
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <div className="backdrop-blur-md bg-neutral-900/30 rounded-xl p-8 border border-yellow-900/20 shadow-xl text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-500">
            Ready to Modernize Your Mess Services?
          </h3>
          <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
            Join our platform to discover qualified contractors or bid on new
            institutional contracts.
          </p>
          <Link
            href={"/explore"}
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-100 rounded-lg font-medium transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Services;

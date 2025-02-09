"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Shield, CheckCircle, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  const stats = [
    { number: "500+", label: "Trusted Contractors" },
    { number: "200+", label: "Partner Institutions" },
    { number: "1000+", label: "Successful Matches" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Excellence",
      description: "Every contractor undergoes thorough verification and quality assessment to ensure top-tier service delivery."
    },
    {
      icon: Building2,
      title: "Institution-Focused",
      description: "Tailored solutions meeting the unique needs of educational institutions, hospitals, and corporate facilities."
    },
    {
      icon: TrendingUp,
      title: "Smart Matching",
      description: "Advanced algorithms ensure perfect matches between contractor expertise and institution requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-24 md:px-6">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-6">
            Connecting Excellence
          </h1>
          <p className="text-neutral-300 text-lg max-w-3xl mx-auto">
            We bridge the gap between premier mess contractors and prestigious institutions, 
            creating partnerships that elevate dining experiences to new heights.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-lg p-6 text-center"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-2">
                {stat.number}
              </h3>
              <p className="text-neutral-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-lg p-8 md:p-12 mb-24"
          {...fadeIn}
        >
          <h2 className="text-3xl font-bold text-neutral-300 mb-6">Our Mission</h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            We're revolutionizing institutional dining services by creating seamless connections 
            between quality-focused mess contractors and forward-thinking institutions. Our platform 
            ensures that every partnership we facilitate leads to exceptional dining experiences, 
            operational efficiency, and mutual growth.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-lg p-6 hover:bg-neutral-900/70 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-300 mb-3">{feature.title}</h3>
              <p className="text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <motion.div 
          className="bg-gradient-to-r from-yellow-900/10 to-neutral-900/50 backdrop-blur-lg rounded-lg p-8 md:p-12"
          {...fadeIn}
        >
          <h2 className="text-3xl font-bold text-neutral-300 mb-8">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Quality-Verified Contractors",
              "Streamlined Matching Process",
              "Comprehensive Support System",
              "Performance Monitoring",
              "Transparent Communication",
              "Long-term Partnership Focus"
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span className="text-neutral-300">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Gavel, UtensilsCrossed, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const pillars = [
    {
      step: "01",
      icon: Gavel,
      title: "Reverse Auction Engine",
      subtitle: "Optimal Pricing & Bidding",
      description:
        "Institutions publish dining specifications and budget ceilings. Approved contractors submit competitive bids in transparent, timed auctions.",
      benefits: [
        "Real-time price discovery",
        "Clear ceiling budget caps",
        "Transparent bidder rankings",
      ],
    },
    {
      step: "02",
      icon: UtensilsCrossed,
      title: "Curated Menu Showcases",
      subtitle: "Dietary Quality & Variety",
      description:
        "Mess operators present 7-day cyclical menus, regional specialties, nutrition plans, and verified institution reviews before contracts are finalized.",
      benefits: [
        "Full dietary transparency",
        "Standardized meal plans",
        "Verified student taste ratings",
      ],
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Direct Partnership Hub",
      subtitle: "Trust & Governance",
      description:
        "Eliminate opaque middlemen. Built-in instant messaging, custom negotiation terms, and milestone tracking ensure seamless dining operations.",
      benefits: [
        "Direct admin-to-caterer chat",
        "FSSAI & hygiene compliance",
        "Digital contract finalization",
      ],
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-neutral-950 border-t border-neutral-800/80 relative">
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none from-yellow-500/5 via-transparent to-transparent -z-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            The MessMatch Advantage
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Replacing Antiquated Tenders with{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
              Smart Transparency
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal"
          >
            A unified procurement platform purpose-built for universities, residential colleges, and corporate campuses to manage dining contracts seamlessly.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.step}
                variants={itemVariants}
                className="group relative bg-neutral-900/40 hover:bg-neutral-900/70 border border-neutral-800 hover:border-yellow-500/40 rounded-2xl p-8 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/40 flex items-center justify-center transition-all">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <span className="font-mono text-2xl font-black text-neutral-700 group-hover:text-yellow-500/40 transition-colors">
                      {pillar.step}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-1">
                    {pillar.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-800/80 space-y-2.5">
                  {pillar.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-16 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300 group"
          >
            <span>Explore all verified contractors and public auctions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;

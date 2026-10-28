"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, HeartHandshake } from "lucide-react";
import Link from "next/link";

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none from-yellow-500/10 via-transparent to-transparent -z-0" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-900/60 to-neutral-950/90 border border-yellow-500/30 p-8 sm:p-12 lg:p-16 text-center max-w-5xl mx-auto shadow-2xl backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs sm:text-sm font-medium mb-6">
              <span>Modernize Campus Dining</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 max-w-3xl mx-auto">
              Ready to Transform Your Dining Procurement?
            </h2>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Join leading universities and accredited caterers standardizing institutional dining. 
              Start reverse bidding, manage contracts, and guarantee meal satisfaction today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/auth/login"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-neutral-950 font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/explore"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-yellow-500/30 hover:border-yellow-400/60 bg-neutral-900/80 hover:bg-neutral-800 text-yellow-400 hover:text-yellow-300 font-semibold transition-all duration-200 backdrop-blur-sm text-center"
              >
                Explore Live Market
              </Link>
            </div>

            <div className="pt-8 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Vetted Caterers</h4>
                  <p className="text-[11px] text-neutral-400">Strict FSSAI compliance</p>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Reverse Bidding</h4>
                  <p className="text-[11px] text-neutral-400">Competitive pricing</p>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Direct Contracts</h4>
                  <p className="text-[11px] text-neutral-400">Zero middleman fees</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;


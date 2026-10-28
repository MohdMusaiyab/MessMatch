"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SlidersHorizontal, 
  Gavel, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  TrendingDown, 
  Clock, 
  Building2, 
  Utensils, 
  Check, 
  FileText 
} from "lucide-react";
import Link from "next/link";

interface FeatureItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  description: string;
  highlights: string[];
}

const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const features: FeatureItem[] = [
    {
      id: "matching",
      icon: SlidersHorizontal,
      tag: "Discovery & Fit",
      title: "Precision Matching & Search",
      description: "Connect institutions with accredited mess operators tailored by cuisine specialty, pricing tier, daily student capacity, and geographic proximity.",
      highlights: [
        "Granular filtering by state, dietary specialization, and capacity",
        "Transparent pricing tiers from budget to premium hostels",
        "Verified portfolios with multi-week sample menus"
      ]
    },
    {
      id: "auction",
      icon: Gavel,
      tag: "Price Discovery",
      title: "Live Reverse Auction Engine",
      description: "Institutions publish meal schedules and set price ceilings. Contractors submit bids in real-time, driving procurement savings without sacrificing nutrition.",
      highlights: [
        "Ceiling budget caps guarantee cost containment",
        "Timed competitive rounds with real-time outbid notifications",
        "Automated contract generation upon auction closure"
      ]
    },
    {
      id: "chat",
      icon: MessageSquare,
      tag: "Direct Communication",
      title: "Direct Negotiation & Chat Hub",
      description: "Communicate directly without intermediaries. Agree on weekly special items, festive meals, hygiene protocols, and terms in a unified workspace.",
      highlights: [
        "Instant two-way messaging between wardens and caterers",
        "Proposal adjustments and custom dietary term negotiations",
        "Digital contract review and sign-off within the portal"
      ]
    },
    {
      id: "trust",
      icon: ShieldCheck,
      tag: "Accountability",
      title: "Verified Trust & Quality Metrics",
      description: "Every caterer undergoes multi-point credential checks. Authentic institution reviews and performance tracking maintain high dining standards.",
      highlights: [
        "FSSAI accreditation & institutional background checks",
        "Authentic post-service ratings and student satisfaction metrics",
        "Audit history and continuous quality compliance"
      ]
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-neutral-900/50 border-t border-neutral-800/80 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Designed for Modern Dining{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
              Operations
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
            Everything universities, corporate parks, and catering contractors need to manage dining tenders transparently.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    isActive
                      ? "bg-neutral-900 border-yellow-500/50 shadow-lg shadow-yellow-500/5 ring-1 ring-yellow-500/30"
                      : "bg-neutral-950/40 border-neutral-800/70 hover:bg-neutral-900/50 hover:border-neutral-700"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isActive 
                      ? "bg-yellow-500 text-neutral-950 font-bold" 
                      : "bg-neutral-800/80 text-neutral-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-yellow-500">
                        {feature.tag}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      )}
                    </div>
                    <h3 className={`text-base font-bold mb-1.5 transition-colors ${
                      isActive ? "text-white" : "text-neutral-300"
                    }`}>
                      {feature.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 relative min-h-[440px] flex flex-col justify-between shadow-2xl">
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="tab-matching"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                      <div>
                        <h4 className="text-xl font-bold text-white">Smart Match Finder</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">Custom filters applied: Delhi NCR • 1000+ Capacity</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                        34 Matches Available
                      </span>
                    </div>

                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-base">Annapurna Campus Dining</h5>
                              <span className="flex items-center gap-0.5 text-xs font-bold text-yellow-400">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 4.9
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400">New Delhi • 2,500 daily meals capacity</p>
                          </div>
                        </div>
                        <span className="self-start sm:self-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                          Available for Bidding
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md">North Indian</span>
                        <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md">South Indian</span>
                        <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md">Continental Breakfast</span>
                        <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md">Jain Options</span>
                      </div>

                      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Average Meal Rate: <strong className="text-yellow-400">₹45 - ₹55</strong></span>
                        <span className="text-neutral-400">Partnered Campuses: <strong className="text-white">6 Universities</strong></span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Key Highlights</p>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                        {features[0].highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="tab-auction"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                      <div>
                        <h4 className="text-xl font-bold text-white">Reverse Auction Console</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">IIT Roorkee Hostel Dining Contract 2026-27</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-mono bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        <span>01h : 42m : 18s</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl">
                        <span className="text-xs text-neutral-400">Budget Ceiling</span>
                        <p className="text-xl font-bold text-neutral-300 line-through">₹52.00</p>
                        <span className="text-[11px] text-neutral-500">Max permissible price</span>
                      </div>
                      <div className="bg-neutral-950/80 border border-yellow-500/30 p-4 rounded-xl">
                        <span className="text-xs text-yellow-400 font-medium">Current Lowest Bid</span>
                        <p className="text-2xl font-black text-yellow-400">₹44.20</p>
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" /> 15% budget savings
                        </span>
                      </div>
                    </div>

                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-neutral-300">Live Bidding Log</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center p-2 rounded bg-neutral-900 border border-yellow-500/20">
                          <span className="text-white font-medium">1. Royal Hospitality Group</span>
                          <span className="text-yellow-400 font-bold">₹44.20 / meal</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-neutral-900/50 border border-neutral-800">
                          <span className="text-neutral-400">2. Kitchen Krafts Caterers</span>
                          <span className="text-neutral-400">₹45.00 / meal</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-neutral-900/30 border border-neutral-800/60">
                          <span className="text-neutral-500">3. Premier Campus Food Co.</span>
                          <span className="text-neutral-500">₹46.80 / meal</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Key Highlights</p>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                        {features[1].highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="tab-chat"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                      <div>
                        <h4 className="text-xl font-bold text-white">Direct Negotiation Hub</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">Encrypted in-app messaging between contractor & institution</p>
                      </div>
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
                        Live Connected
                      </span>
                    </div>

                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 space-y-3">
                      <div className="flex flex-col items-start max-w-[85%]">
                        <span className="text-[10px] text-neutral-400 ml-1 mb-1">Chief Warden (Hostel 4)</span>
                        <div className="bg-neutral-800 text-neutral-200 text-xs p-3 rounded-xl rounded-tl-none border border-neutral-700 leading-relaxed">
                          We reviewed your auction bid. Can you provide sweet dessert items on Wednesdays and Sundays without increasing the rate?
                        </div>
                      </div>

                      <div className="flex flex-col items-end max-w-[85%] ml-auto">
                        <span className="text-[10px] text-yellow-500 mr-1 mb-1">Kitchen Krafts (Contractor)</span>
                        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-950 text-xs font-medium p-3 rounded-xl rounded-tr-none shadow leading-relaxed">
                          Confirmed! We will include Gulab Jamun and Kheer rotations on Wed/Sun within the agreed ₹45 rate. Contract terms updated.
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-900 border border-yellow-500/30 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-medium">Contract Term Sheet V2.pdf</span>
                        </div>
                        <span className="text-emerald-400 font-semibold">Accepted</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Key Highlights</p>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                        {features[2].highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 3 && (
                  <motion.div
                    key="tab-trust"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                      <div>
                        <h4 className="text-xl font-bold text-white">Trust & Quality Scorecard</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">Continuous audit and institutional feedback loop</p>
                      </div>
                      <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full font-medium">
                        Accredited Vendor
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-xl text-center">
                        <span className="text-xs text-neutral-400 block mb-1">Hygiene Audit</span>
                        <span className="text-xl font-black text-emerald-400">98.5%</span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">FSSAI Compliant</span>
                      </div>
                      <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-xl text-center">
                        <span className="text-xs text-neutral-400 block mb-1">Punctuality</span>
                        <span className="text-xl font-black text-yellow-400">99.2%</span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">On-time Meal Serves</span>
                      </div>
                      <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-xl text-center">
                        <span className="text-xs text-neutral-400 block mb-1">Overall Rating</span>
                        <span className="text-xl font-black text-white flex items-center justify-center gap-1">
                          4.9 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">140+ Reviews</span>
                      </div>
                    </div>

                    <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 text-xs text-neutral-300 space-y-2">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span className="font-semibold text-white">National Institute of Tech (NIT)</span>
                        <span>Verified Institution Review</span>
                      </div>
                      <p className="italic text-neutral-400 leading-relaxed">
                        &quot;MessMatch completely changed how we contract our hostel dining. We cut dining costs by 18% while student satisfaction scores hit an all-time high.&quot;
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Key Highlights</p>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                        {features[3].highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Ready to experience the platform firsthand?
                </span>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-4 py-2 rounded-lg transition-all"
                >
                  <span>Explore Live Demos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

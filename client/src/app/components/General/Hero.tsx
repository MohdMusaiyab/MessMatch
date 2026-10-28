"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Gavel, 
  UtensilsCrossed, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  TrendingDown, 
  Building2, 
  Users 
} from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-16 sm:py-24 lg:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-yellow-500/10 blur-[130px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-yellow-600/5 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>Next-Gen Institutional Dining Marketplace</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]"
            >
              Where Premier Campuses &{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                Elite Caterers
              </span>{" "}
              Connect
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal"
            >
              Transform institutional dining procurement. Launch competitive reverse auctions, 
              discover verified catering menus, negotiate directly, and secure quality dining at optimal pricing.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Link
                href="/explore"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/auth/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-yellow-500/30 hover:border-yellow-400/60 bg-neutral-900/60 hover:bg-neutral-800/80 text-yellow-400 hover:text-yellow-300 font-semibold transition-all duration-200 backdrop-blur-sm text-center"
              >
                Sign In / Demo Access
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-neutral-800/80 text-left"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">50+</p>
                <p className="text-xs sm:text-sm text-neutral-400">Campus Partners</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-yellow-400">10k+</p>
                <p className="text-xs sm:text-sm text-neutral-400">Daily Meals</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">₹1.5Cr+</p>
                <p className="text-xs sm:text-sm text-neutral-400">Tenders Awarded</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-yellow-400">99.4%</p>
                <p className="text-xs sm:text-sm text-neutral-400">Verified Rating</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="flex items-center justify-between gap-2 p-1.5 mb-4 bg-neutral-900/90 border border-neutral-800 rounded-xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActiveTab(0)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 0
                      ? "bg-yellow-500 text-neutral-950 shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Live Auction</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 1
                      ? "bg-yellow-500 text-neutral-950 shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Menu Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 2
                      ? "bg-yellow-500 text-neutral-950 shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Negotiations</span>
                </button>
              </div>

              <div className="relative bg-gradient-to-b from-neutral-900/90 via-neutral-900/60 to-neutral-950/90 border border-yellow-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl min-h-[380px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activeTab === 0 && (
                    <motion.div
                      key="tab0"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Reverse Auction Active
                          </span>
                        </div>
                        <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2.5 py-0.5 rounded-full font-mono font-medium">
                          Closes in 02h 45m
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                          <Building2 className="w-3.5 h-3.5 text-yellow-500" />
                          <span>Delhi Institute of Technology</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">
                          Central Boys Hostel Mess (1,200 Students)
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1">
                          Breakfast, Lunch, Evening Snack & Dinner • 7-Day Cycle
                        </p>
                      </div>

                      <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-neutral-400">Current Lowest Bid</p>
                          <p className="text-2xl font-black text-yellow-400 flex items-center gap-1">
                            ₹46.50
                            <span className="text-xs font-normal text-neutral-400">/ meal</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-400">Ceiling Budget</p>
                          <p className="text-sm font-semibold text-neutral-300 line-through">₹55.00</p>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <TrendingDown className="w-3 h-3" /> 15.4% saved
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <p className="text-xs font-medium text-neutral-400">Recent Competitive Bids</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs px-3 py-2 bg-neutral-800/40 rounded-lg border border-neutral-800">
                            <span className="text-neutral-200 font-medium">Royal Caterers Ltd.</span>
                            <span className="text-yellow-400 font-bold">₹46.50</span>
                          </div>
                          <div className="flex items-center justify-between text-xs px-3 py-2 bg-neutral-800/20 rounded-lg border border-neutral-800/60">
                            <span className="text-neutral-400">Annapurna Food Services</span>
                            <span className="text-neutral-400">₹48.00</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 1 && (
                    <motion.div
                      key="tab1"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Verified Contractor Portfolio
                          </span>
                        </div>
                        <span className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full font-medium">
                          FSSAI Certified
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 border border-yellow-500/30 flex items-center justify-center shrink-0">
                          <UtensilsCrossed className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-white">Spice & Grain Culinary</h4>
                            <span className="flex items-center gap-0.5 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> 4.9
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Specializing in Multi-Regional Indian, Healthy & Special Diets
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-neutral-950/70 border border-neutral-800 p-2.5 rounded-lg">
                          <span className="text-neutral-400 block">Daily Capacity</span>
                          <span className="text-white font-bold text-sm">3,500+ Meals</span>
                        </div>
                        <div className="bg-neutral-950/70 border border-neutral-800 p-2.5 rounded-lg">
                          <span className="text-neutral-400 block">Partner Campuses</span>
                          <span className="text-white font-bold text-sm">8 Universities</span>
                        </div>
                      </div>

                      <div className="bg-neutral-950/70 border border-neutral-800 p-3 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-300 font-medium">Standard 4-Meal Plan</span>
                          <span className="text-yellow-400 font-bold">₹110 / day / student</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          Paneer Butter Masala, Dal Makhani, Seasonal Veg, Steamed Rice, Tandoori Roti, Salad & Sweet.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 2 && (
                    <motion.div
                      key="tab2"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                            Real-Time Negotiation
                          </span>
                        </div>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                          Online
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-col items-start max-w-[85%]">
                          <span className="text-[10px] text-neutral-400 mb-1 ml-1">College Mess Warden</span>
                          <div className="bg-neutral-800 text-neutral-200 text-xs p-3 rounded-2xl rounded-tl-sm border border-neutral-700/60 leading-relaxed">
                            Can you accommodate a Sunday continental breakfast menu within the ₹48/meal bid?
                          </div>
                        </div>

                        <div className="flex flex-col items-end max-w-[85%] ml-auto">
                          <span className="text-[10px] text-yellow-500 mb-1 mr-1">Apex Caterers (You)</span>
                          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-950 font-medium text-xs p-3 rounded-2xl rounded-tr-sm shadow-md leading-relaxed">
                            Yes, absolutely. We can provide weekly Sunday special brunch with live counters at no added cost!
                          </div>
                        </div>

                        <div className="p-3 bg-neutral-950/70 border border-yellow-500/30 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-semibold text-white">Proposal Finalized</span>
                          </div>
                          <span className="text-xs text-yellow-400 font-medium">Ready for Contract</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Instant digital contract agreement</span>
                  </div>
                  <Link
                    href="/explore"
                    className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-1 group"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-700/80 shadow-xl backdrop-blur-md">
                <Users className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-medium text-neutral-200">50+ Active Caterers Ready to Bid</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

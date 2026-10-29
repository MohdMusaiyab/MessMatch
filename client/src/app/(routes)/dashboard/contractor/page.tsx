"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import SideBarDashBoard from "@/app/components/contractor/SideBarDashBoard";
import { Loader2, AlertCircle, Plus, ChevronRight, Gavel, ArrowRight, FileText } from "lucide-react";

interface Menu {
  id: string;
  name: string;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    address: string;
  };
}

interface Contract {
  id: string;
  status?: string;
  auction: {
    title: string;
  };
}

interface DashboardData {
  menus: Menu[];
  auctions: Auction[];
}

const Page = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, contractsRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/latest-things`,
            { withCredentials: true }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/my-contracts`,
            { withCredentials: true }
          ).catch(() => ({ data: { data: [] } })),
        ]);

        if (latestRes.status === 200) {
          setData(latestRes.data.data);
        } else {
          setError(latestRes.data.message);
        }

        if (contractsRes?.data?.data) {
          setContracts(contractsRes.data.data);
        }
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <div className="bg-red-950/50 text-red-200 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 overflow-hidden">
      <SideBarDashBoard />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-6 md:mb-8"
        >
          Contractor Dashboard Overview
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-xl p-4 md:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-neutral-300">Your Menus</h2>
                <Link href="/dashboard/contractor/menu/create-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-950 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs md:text-sm font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Menu</span>
                  </motion.button>
                </Link>
              </div>
              
              {data?.menus.length ? (
                <div className="space-y-3">
                  {data.menus.map((menu) => (
                    <motion.div
                      key={menu.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-800/40 hover:bg-neutral-800/70 p-3 md:p-4 rounded-lg flex items-center justify-between group transition-all duration-200 border border-neutral-800 hover:border-yellow-500/30"
                    >
                      <Link href={`/dashboard/contractor/menu/${menu.id}`} className="flex items-center justify-between w-full">
                        <span className="text-neutral-300 text-sm md:text-base font-medium">{menu.name}</span>
                        <ChevronRight className="w-4 h-4 text-yellow-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500 text-sm">No menus created yet.</p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-800/80">
              <Link 
                href="/dashboard/contractor/menu"
                className="text-xs text-yellow-500 hover:text-yellow-400 font-medium flex items-center gap-1"
              >
                <span>View all menus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-xl p-4 md:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg md:text-xl font-semibold text-neutral-300">Recent Auctions</h2>
                </div>
                <Link href="/explore">
                  <span className="text-xs text-yellow-500 hover:text-yellow-400 font-medium flex items-center gap-1">
                    Explore All <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>

              {data?.auctions.length ? (
                <div className="space-y-3">
                  {data.auctions.map((auction) => (
                    <motion.div
                      key={auction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-800/40 hover:bg-neutral-800/70 p-3 md:p-4 rounded-lg flex items-center justify-between group transition-all duration-200 border border-neutral-800 hover:border-yellow-500/30"
                    >
                      <Link 
                        href={`/dashboard/institution/auction/${auction.id}`}
                        className="flex flex-col gap-1 w-full"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-200 text-sm md:text-base font-semibold group-hover:text-yellow-400 transition-colors">
                            {auction.title || "Campus Dining Tender"}
                          </span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            auction.isOpen !== false
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-neutral-800 text-neutral-400"
                          }`}>
                            {auction.isOpen !== false ? "Open" : "Closed"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span>{auction.creator?.name || "Institution"}</span>
                          <span>{new Date(auction.createdAt).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500 text-sm">No recent auctions available.</p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-800/80">
              <Link 
                href="/dashboard/contractor/my-auctions"
                className="text-xs text-yellow-500 hover:text-yellow-400 font-medium flex items-center gap-1"
              >
                <span>View my auction bids</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 md:mt-8 bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-xl p-4 md:p-6"
        >
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg md:text-xl font-semibold text-neutral-300">My Contracts</h2>
            </div>
          </div>
          {contracts.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-neutral-800/40 hover:bg-neutral-800/70 p-3 md:p-4 rounded-lg flex items-center justify-between group transition-all duration-200 border border-neutral-800 hover:border-yellow-500/30"
                >
                  <Link
                    href={`/dashboard/contract/${contract.id}`}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-200 text-sm font-semibold group-hover:text-yellow-400 transition-colors">
                        {contract.auction.title}
                      </span>
                      {contract.status && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium w-fit ${
                          contract.status === "ACCEPTED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : contract.status === "TERMINATED"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        }`}>
                          {contract.status}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-yellow-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-500 text-sm">
              No active or pending contracts yet. When an institution accepts your bid and issues a contract, it will appear here.
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Page;

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import SideBarDashboard from "@/app/components/colleges/SideBarDashboard";
import { Loader2, AlertCircle, Plus, ChevronRight } from "lucide-react";

interface Contract {
  id: string;
  auction: {
    title: string;
  };
}

const Page: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contracts from the backend
  const getMyContracts = async () => {
    try {
      const response = await axios.get<{
        message: string;
        success: boolean;
        data: Contract[];
      }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/my-contracts`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setContracts(response.data.data);
      } else {
        setError("Failed to fetch contracts.");
      }
    } catch (err) {
      setError("Failed to load contracts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyContracts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  // Error state
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
      <SideBarDashboard />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-6 md:mb-8"
        >
          My Contracts
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {contracts.length ? (
            contracts.map((contract) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900/50 hover:bg-neutral-800/70 p-3 md:p-4 rounded-lg flex flex-col gap-2 transition-all duration-300"
              >
                <Link
                  href={`/dashboard/contract/${contract.id}`}
                  className="text-lg font-semibold text-neutral-200"
                >
                  {contract.auction.title}
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-16 px-4 bg-neutral-900/30 rounded-xl border border-yellow-900/20">
              <div className="w-12 h-12 mx-auto mb-4 p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-500 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">No Contracts Yet</h3>
              <p className="text-sm text-neutral-400 max-w-sm mx-auto mb-6">
                Create an auction to invite bids from verified mess contractors, or explore active caterers in your region.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/dashboard/institution/auction/create"
                  className="px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white text-sm font-medium rounded-lg transition-all"
                >
                  Create Auction
                </Link>
                <Link
                  href="/explore"
                  className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg transition-colors"
                >
                  Explore Contractors
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

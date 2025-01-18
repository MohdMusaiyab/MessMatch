"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

const MyBids = () => {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBids = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/my-bids`,
          { withCredentials: true }
        );
        setBids(response.data.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Something went wrong.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-full"
      />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 bg-red-500/10 px-6 py-4 rounded-lg border border-red-500/20"
      >
        {error}
      </motion.div>
    </div>
  );

  if (!bids.length) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-neutral-300 bg-neutral-900 px-6 py-4 rounded-lg border border-yellow-900/20"
      >
        No bids found.
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"
        >
          My Bids
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {bids.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-b from-neutral-900 to-neutral-950 
                       border border-yellow-900/20 rounded-lg p-6 
                       hover:shadow-lg hover:shadow-yellow-900/10 
                       transition-all duration-300"
            >
              <Link 
                href={`/dashboard/institution/auction/${bid.auction.id}`}
                className="text-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-200 
                         bg-clip-text text-transparent hover:from-yellow-400 
                         hover:to-yellow-100 transition-all duration-300"
              >
                {bid.auction.title}
              </Link>
              <p className="mt-2 text-neutral-300">{bid.auction.description}</p>
              <div className="mt-4 flex items-center">
                <span className="text-neutral-400">Bid Amount:</span>
                <span className="ml-2 text-yellow-500 font-semibold">₹{bid.amount.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MyBids;
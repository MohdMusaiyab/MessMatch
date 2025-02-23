"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { State } from "@/app/types/States";

interface Auction {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
  creator: {
    name: string;
    email: string;
    role: string;
  };
  winner?: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
  bidCount: number;
  highestBid: number | null;
  highestBidder: string | null;
  createdAt: string;
}

const ExplorePage = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [maxBids, setMaxBids] = useState("");
  const [state, setState] = useState(""); // Add state filter
  const [loading, setLoading] = useState(false);

  const fetchAuctions = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/filters`,
        {
          params: {
            page,
            search,
            auctionStatus: status === "all" ? undefined : status,
            maxBids,
            state: state || undefined, // Include state in the query parameters
          },
          withCredentials: true,
        }
      );

      setAuctions(response.data.data.auctions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleMaxBidsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxBids(e.target.value);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(e.target.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "No bids";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    fetchAuctions(pagination.page);
  }, [pagination.page, search, status, maxBids, state]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between gap-6 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/50"
                size={20}
              />
              <input
                type="text"
                className="pl-10 pr-4 py-3 w-full md:w-64 bg-neutral-900 border border-yellow-900/20 rounded-lg
                         text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40
                         transition-all duration-300"
                placeholder="Search auctions or creators"
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <select
              className="px-4 py-3 bg-neutral-900 border border-yellow-900/20 rounded-lg
                       text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40
                       transition-all duration-300"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            <select
              className="px-4 py-3 bg-neutral-900 border border-yellow-900/20 rounded-lg
                       text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40
                       transition-all duration-300"
              value={maxBids}
              onChange={handleMaxBidsChange}
            >
              <option value="">All Bid Counts</option>
              <option value="5">Up to 5 Bids</option>
              <option value="10">Up to 10 Bids</option>
              <option value="15">Up to 15 Bids</option>
              <option value="20">Up to 20 Bids</option>
              <option value="20+">More than 20 Bids</option>
            </select>

            <select
              className="px-4 py-3 bg-neutral-900 border border-yellow-900/20 rounded-lg
           text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40
           transition-all duration-300"
              value={state}
              onChange={handleStateChange}
            >
              <option value="">All States</option>
              {Object.entries(State).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-medium
                     rounded-lg hover:shadow-lg hover:shadow-yellow-600/20 transition-all duration-300
                     flex items-center justify-center gap-2"
            onClick={() => fetchAuctions(1)}
          >
            <Filter size={20} />
            Apply Filters
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-full"
            />
          </div>
        ) : (
          <div>
            {auctions.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {auctions.map((auction, index) => (
                    <motion.div
                      key={auction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-b from-neutral-900 to-neutral-950 
                               border border-yellow-900/20 rounded-lg p-6 
                               hover:shadow-xl hover:shadow-yellow-900/10 
                               transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <Link
                          href={`/dashboard/institution/auction/${auction?.id}`}
                          className="text-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-200 
                                     bg-clip-text text-transparent"
                        >
                          {auction.title}
                        </Link>
                        <span
                          className={`px-4 py-1 rounded-full text-sm ${
                            auction.isOpen
                              ? "bg-green-900/20 text-green-500"
                              : "bg-red-900/20 text-red-500"
                          }`}
                        >
                          {auction.isOpen ? "Open" : "Closed"}
                        </span>
                      </div>

                      <p className="text-neutral-400 mb-6">
                        {auction.description}
                      </p>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-t border-yellow-900/10">
                          <span className="text-neutral-500">Created by</span>
                          <span className="text-neutral-300">
                            {auction.creator.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-yellow-900/10">
                          <span className="text-neutral-500">Total Bids</span>
                          <span className="text-neutral-300">
                            {auction.bidCount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-yellow-900/10">
                          <span className="text-neutral-500">Highest Bid</span>
                          <span className="text-yellow-500 font-medium">
                            {formatCurrency(auction.highestBid)}
                          </span>
                        </div>
                        {auction.highestBidder && (
                          <div className="flex justify-between items-center py-2 border-t border-yellow-900/10">
                            <span className="text-neutral-500">
                              Highest Bidder
                            </span>
                            <span className="text-neutral-300">
                              {auction.highestBidder}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-t border-yellow-900/10">
                          <span className="text-neutral-500">Created</span>
                          <span className="text-neutral-300">
                            {formatDate(auction.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-12">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-neutral-800 text-neutral-300 rounded-lg
                             hover:bg-neutral-700 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => fetchAuctions(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </motion.button>
                  <span className="text-neutral-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-neutral-800 text-neutral-300 rounded-lg
                             hover:bg-neutral-700 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => fetchAuctions(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-neutral-500"
              >
                No auctions found matching your criteria
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;

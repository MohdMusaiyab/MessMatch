"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SideBarDashBoard from '@/app/components/contractor/SideBarDashBoard';
import { Loader2, AlertCircle, Plus, ChevronRight } from 'lucide-react';

interface Menu {
  id: number;
  name: string;
}

interface Auction {
  id: number;
  createdAt: string;
  creator: {
    id: number;
    name: string;
    email: string;
    contactNumber: string;
    address: string;
  };
}

interface DashboardData {
  menus: Menu[];
  auctions: Auction[];
}

const Page = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/latest-things`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <div className="bg-red-950/50 text-red-200 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-950 overflow-hidden">
      <SideBarDashBoard />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-6 md:mb-8"
        >
          Dashboard Overview
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/50 backdrop-blur-lg border border-yellow-900/20 rounded-lg p-4 md:p-6"
          >
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-neutral-300">Your Menus</h2>
                <Link href="/dashboard/contractor/menu/create-menu">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-950 px-2 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-1 md:gap-2 text-xs md:text-sm hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  Add Menu
                </motion.button>
                </Link>
            </div>
            
            {data?.menus.length ? (
              <div className="space-y-3 md:space-y-4">
                {data.menus.map((menu) => (
                  <motion.div
                    key={menu.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-800/50 hover:bg-neutral-800/70 p-3 md:p-4 rounded-lg flex items-center justify-between group transition-all duration-300"
                  >
                    <Link href={`/dashboard/contractor/menu/${menu.id}`} className="flex items-center justify-between w-full">
                      <span className="text-neutral-300 text-sm md:text-base">{menu.name}</span>
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-4 md:py-8">No menus created yet.</p>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Page 
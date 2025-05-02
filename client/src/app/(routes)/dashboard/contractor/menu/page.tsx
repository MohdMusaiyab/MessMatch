"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Menu {
  id: string;
  name: string;
  items: string[];
  pricePerHead: number;
  type: "VEG" | "NON_VEG" | "BOTH";
}

const Page = () => {
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = React.useCallback(async () => {
    if (session?.user) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/your-menus`,
          { withCredentials: true }
        );
        setMenus(response.data.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Error fetching menus");
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  const deleteMenu = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this menu? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/delete-menu/${id}`,
        { withCredentials: true }
      );
      setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== id));
      alert("Menu deleted successfully!");
    } catch (error: any) {
      alert(`Failed to delete menu. ${error.response?.data?.message || "Please try again."}`);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchMenus();
    }
  }, [fetchMenus, status]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <span className="text-red-400 text-lg font-medium">
          Please sign in to view your menus
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"
        >
          Your Menus
        </motion.h1>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 mb-4"
          >
            {error}
          </motion.p>
        )}

        {menus.length === 0 && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neutral-300"
          >
            No menus available.
          </motion.p>
        )}

        <AnimatePresence>
          <div className="space-y-6">
            {menus.map((menu) => (
              <motion.div
                key={menu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-neutral-900/50 backdrop-blur border border-yellow-900/20 rounded-lg p-6 shadow-lg hover:shadow-yellow-500/5 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/dashboard/contractor/menu/update-menu/${menu.id}`}
                    >
                      <h3 className="text-xl font-semibold text-neutral-100 hover:text-yellow-500 transition-colors duration-300">
                        {menu.name}
                      </h3>
                    </Link>
                    <p className="text-neutral-300 mt-2">
                      Price per head:{" "}
                      <span className="text-yellow-500">
                        ${menu.pricePerHead.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-neutral-400 mb-4">Type: {menu.type}</p>
                    <ul className="space-y-2 pl-5">
                      {menu.items.map((item, index) => (
                        <li key={index} className="text-neutral-300 list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteMenu(menu.id)}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-2 px-6 rounded-md hover:from-red-700 hover:to-red-800 transition-all duration-300 self-start"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <Link
            href="/dashboard/contractor/menu/create-menu"
            className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
          >
            Create New Menu
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;

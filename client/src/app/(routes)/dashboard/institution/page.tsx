"use client";
import React, { useEffect, useState } from "react";
import SideBarDashboard from "@/app/components/colleges/SideBarDashboard";
import axios from "axios";
import Link from "next/link";

// Define menu type based on the backend response
interface Menu {
  id: number;
  name: string;
  pricePerHead: number;
}

const Page: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getLatestMenus = async () => {
    try {
      console.log("Fetching latest menus...");
      const response = await axios.get<{ message: string; success: boolean; data: Menu[] }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/dashboard-latest-menus`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMenus(response.data.data);
      } else {
        setError("Failed to fetch menus.");
      }
    } catch (err) {
      setError("Failed to load menus. Please try again.");
      console.error("Error fetching menus:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLatestMenus();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-300">
      <SideBarDashboard />
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 text-transparent bg-clip-text mb-12">
          Latest Menus
        </h1>

        {loading && <p className="text-yellow-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-6">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-gradient-to-b from-neutral-900 to-neutral-950 backdrop-blur-md border border-yellow-900/20 shadow-lg rounded-lg p-6 transition-all duration-300 hover:border-yellow-700 hover:shadow-yellow-600/20"
            >
              <Link href={`/dashboard/contractor/menu/${menu.id}`} className="text-2xl font-semibold text-neutral-200">
                {menu.name}
              </Link>
              <p className="text-lg text-neutral-400 mt-2">
                Price Per Head:{" "}
                <span className="font-bold text-yellow-500">
                  ${menu.pricePerHead}
                </span>
              </p>
            </div>
          ))}
        </div>

        {!loading && menus.length === 0 && (
          <p className="text-neutral-400 mt-6">No menus available.</p>
        )}
      </div>
    </div>
  );
};

export default Page;

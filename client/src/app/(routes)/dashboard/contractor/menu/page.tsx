"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";

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

  useEffect(() => {
    const fetchMenus = async () => {
      if (session?.user) {
        setLoading(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/your-menus`,
            { withCredentials: true }
          );
          setMenus(response.data.data);
        } catch (error) {
          setError("Error fetching menus");
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === "authenticated") {
      fetchMenus();
    }
  }, [session, status]);

  if (status === "loading") {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-red-500 text-center">
        Please sign in to view your menus
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Menus</h1>
      {loading && <p>Loading menus...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {menus.length === 0 && !loading && <p>No menus available.</p>}
      <div className="space-y-4">
        {menus.map((menu) => (
          <div key={menu.id} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-semibold">{menu.name}</h3>
            <p>Price per head: ${menu.pricePerHead.toFixed(2)}</p>
            <p>Type: {menu.type}</p>
            <ul className="list-disc pl-5">
              {menu.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link
        href="/dashboard/contractor/menu/create-menu"
        className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create New Menu
      </Link>
    </div>
  );
};

export default Page;

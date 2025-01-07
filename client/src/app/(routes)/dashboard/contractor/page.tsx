"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBarDashBoard from '@/app/components/contractor/SideBarDashBoard';

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
          withCredentials: true, // Include credentials in the request
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex">
      <SideBarDashBoard />
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4">Dashboard</h1>
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold">Your Menus</h2>
          {data?.menus.length ? (
            <ul className="list-disc pl-5">
              {data.menus.map(menu => (
                <li key={menu.id} className="mt-2">{menu.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You have no menus created.</p>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Latest Auctions</h2>
          {data?.auctions.length ? (
            <ul className="list-disc pl-5">
              {data.auctions.map(auction => (
                <li key={auction.id} className="mt-2">
                  {auction.creator.name} - Created on {new Date(auction.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No latest auctions available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Page;


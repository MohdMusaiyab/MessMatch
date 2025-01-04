"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const MyBids = () => {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch My Bids
  useEffect(() => {
    const fetchMyBids = async () => {
      setLoading(true);
      setError(null); // Reset error
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/my-bids`,
          { withCredentials: true }
        );
        setBids(response.data.data); // Populate bids
      } catch (err: any) {
        // Extract message from error response
        const errorMessage =
          err.response?.data?.message || "Something went wrong.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!bids.length) return <div>No bids found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bids</h1>
      <ul>
        {bids.map((bid) => (
          <li key={bid.id} className="border p-4 mb-2">
            <Link href={`/dashboard/institution/auction/${bid.auction.id}`} className="font-semibold">{bid.auction.title}</Link>
            <p>{bid.auction.description}</p>
            <p className="text-gray-500">Bid Amount: ₹{bid.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBids;

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const MyAuctions = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/my-auctions`,
          {
            withCredentials: true,
          }
        );
        setAuctions(response.data.data);
      } catch (err) {
        setError("Failed to fetch auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="text-yellow-500 text-lg">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="text-red-500 bg-neutral-900/50 p-6 rounded-lg border border-red-500/20">
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
          My Auctions
        </h1>
        
        {auctions.length === 0 ? (
          <div className="backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-6">
            <p className="text-neutral-300">No auctions found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {auctions.map((auction) => (
              <div 
                key={auction.id} 
                className="backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-6 transition-all duration-300 hover:bg-neutral-900/70"
              >
                <Link
                  href={`/dashboard/institution/auction/update/${auction?.id}`}
                  className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent hover:from-yellow-400 hover:to-yellow-100 transition-all duration-300"
                >
                  {auction.title}
                </Link>
                
                <p className="text-neutral-300 mt-3 mb-4">
                  {auction.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <p className="text-neutral-400">
                    Created on: {new Date(auction.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="flex items-center">
                    <span className="text-neutral-400 mr-2">Status:</span>
                    {auction.isOpen === true ? (
                      <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-semibold">
                        Open
                      </span>
                    ) : (
                      <span className="bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full text-sm font-semibold">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAuctions;
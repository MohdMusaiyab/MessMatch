"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AuctionDetail = () => {
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Fetch auction details
  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/get/${id}`,
          { withCredentials: true }
        );
        setAuction(response.data.data);
        setTitle(response.data.data.title);
        setDescription(response.data.data.description);
      } catch (err) {
        setError("Failed to fetch auction. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  // [Previous handlers remain unchanged]
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/update/${id}`,
        { title, description },
        { withCredentials: true }
      );
      alert(response.data.message);
      setAuction(response.data.data);
    } catch (err) {
      setError("Failed to update auction. Please try again later.");
    }
  };

  const handleCloseAuction = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/delete/${id}`,
        { withCredentials: true }
      );
      alert(response.data.message);
      setAuction({ ...auction, isOpen: false });
    } catch (err) {
      setError("Failed to close auction. Please try again later.");
    }
  };

  const handleOpenAuction = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/open-auction/${id}`,
        {},
        { withCredentials: true }
      );
      alert(response.data.message);
      setAuction({ ...auction, isOpen: true });
    } catch (err) {
      setError("Failed to open auction. Please try again later.");
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/accept-bid`,
        { auctionId: id, bidId },
        { withCredentials: true }
      );
      alert(response.data.message);
      setAuction({ ...auction, isOpen: false, winnerId: response.data.data.winnerId });
    } catch (err) {
      setError("Failed to accept bid. Please try again later.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="text-yellow-500 text-lg">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="text-red-500 bg-neutral-900/50 p-6 rounded-lg backdrop-blur-sm border border-red-500/20">
        {error}
      </div>
    </div>
  );
  
  if (!auction) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="text-neutral-300 bg-neutral-900/50 p-6 rounded-lg backdrop-blur-sm border border-yellow-900/20">
        No auction found.
      </div>
    </div>
  );

  const isCreator = session?.user.id === auction.creatorId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-300">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {isCreator && (
          <form onSubmit={handleUpdate} className="mb-8 bg-neutral-900/50 p-6 rounded-lg backdrop-blur-sm border border-yellow-900/20">
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
              Manage Auction
            </h2>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-yellow-900/20 rounded-md p-3 text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/20 transition-all duration-300"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full bg-neutral-950 border border-yellow-900/20 rounded-md p-3 text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/20 transition-all duration-300"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-950 px-6 py-3 rounded-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 font-medium"
              >
                Update Auction
              </button>
              {auction.isOpen ? (
                <button
                  type="button"
                  onClick={handleCloseAuction}
                  className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-md hover:bg-red-500/20 transition-all duration-300 font-medium"
                >
                  Close Auction
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenAuction}
                  className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-6 py-3 rounded-md hover:bg-emerald-500/20 transition-all duration-300 font-medium"
                >
                  Open Auction Again
                </button>
              )}
            </div>
          </form>
        )}

        <div className="bg-neutral-900/50 p-6 rounded-lg backdrop-blur-sm border border-yellow-900/20">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
            Auction Details
          </h2>
          <div className="space-y-4">
            <p className="flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-yellow-500 font-semibold min-w-[120px]">Title:</span>
              <span>{auction.title}</span>
            </p>
            <p className="flex flex-col md:flex-row gap-2">
              <span className="text-yellow-500 font-semibold min-w-[120px]">Description:</span>
              <span>{auction.description}</span>
            </p>
            <p className="flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-yellow-500 font-semibold min-w-[120px]">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                auction.isOpen 
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}>
                {auction.isOpen ? "Open" : "Closed"}
              </span>
            </p>
            <p className="flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-yellow-500 font-semibold min-w-[120px]">Winner:</span>
              <span>{auction.winner
                ? `${auction.winner.user.name} (${auction.winner.user.email})`
                : "No winner yet"}</span>
            </p>
            <p className="flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-yellow-500 font-semibold min-w-[120px]">Total Bids:</span>
              <span>{auction.bids?.length || 0}</span>
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-neutral-100">Bids</h3>
          <div className="space-y-4">
            {auction.bids && auction.bids.length > 0 ? (
              auction.bids.map((bid: any) => (
                <div
                  key={bid.id}
                  className="flex flex-col md:flex-row justify-between gap-4 bg-neutral-950/50 p-4 rounded-lg border border-yellow-900/10"
                >
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-yellow-500 font-semibold">Bid Amount:</span>
                      <span>{bid.amount}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-yellow-500 font-semibold">Bidder:</span>
                      <Link
                        href={`/profile/${bid.bidder.id}`}
                        className="text-neutral-300 hover:text-yellow-500 transition-colors duration-300"
                      >
                        {bid.bidder.name || "N/A"}
                      </Link>
                    </p>
                  </div>
                  {isCreator && auction.isOpen && (
                    <button
                      onClick={() => handleAcceptBid(bid.id)}
                      className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-950 px-4 py-2 rounded-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 font-medium whitespace-nowrap"
                    >
                      Accept Bid
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-neutral-400 italic">No bids available for this auction.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
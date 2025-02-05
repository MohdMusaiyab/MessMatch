"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AuctionDetail = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [placingBid, setPlacingBid] = useState(false);
  const [updatingBid, setUpdatingBid] = useState(false);
  const [deletingBid, setDeletingBid] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/get-auction/${id}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data.data;
        setAuction(data);
        if (data.userBid) setBidAmount(data.userBid.amount);
      } catch (err) {
        setError("Failed to fetch auction. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  const handlePlaceBid = async () => {
    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    setPlacingBid(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/place-bid/${id}`,
        { amount: bidAmount },
        { withCredentials: true }
      );
      alert("Bid placed successfully!");
      setAuction((prev: any) => ({
        ...prev,
        userBid: { amount: bidAmount },
        totalBids: prev.totalBids + 1,
      }));
    } catch (err) {
      alert("Failed to place bid. Please try again.");
    } finally {
      setPlacingBid(false);
    }
  };

  const handleUpdateBid = async () => {
    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    setUpdatingBid(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/update-bid/${id}`,
        { amount: bidAmount },
        { withCredentials: true }
      );
      alert("Bid updated successfully!");
      setAuction((prev: any) => ({
        ...prev,
        userBid: { amount: response.data.data.amount },
      }));
    } catch (err) {
      alert("Failed to update bid. Please try again.");
    } finally {
      setUpdatingBid(false);
    }
  };

  const handleDeleteBid = async () => {
    if (!auction?.userBid) {
      alert("No bid to delete.");
      return;
    }

    setDeletingBid(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/delete-bid/${auction.userBid.id}`,
        { withCredentials: true }
      );
      alert("Bid deleted successfully!");
      setAuction((prev: any) => ({
        ...prev,
        userBid: null,
        totalBids: Math.max(prev.totalBids - 1, 0),
      }));
      setBidAmount("");
    } catch (err) {
      alert("Failed to delete bid. Please try again.");
    } finally {
      setDeletingBid(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-yellow-500 text-lg">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-red-500 bg-neutral-900/50 p-6 rounded-lg border border-red-500/20">
          {error}
        </div>
      </div>
    );

  if (!auction)
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-neutral-300 bg-neutral-900/50 p-6 rounded-lg border border-yellow-500/20">
          No auction found.
        </div>
      </div>
    );

  const isUserWinner = auction.winner && session?.user.id === auction.winner.id;

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Section */}
          <div className="flex-grow backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-6 lg:p-8">
            {/* Header Section */}
            <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
              {auction.title}
            </h1>

            <p className="text-neutral-300 mb-6">{auction.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <p className="text-neutral-400">
                Created on: {new Date(auction.createdAt).toLocaleDateString()}
              </p>
              <p className="text-neutral-400">
                Total Bids: {auction.totalBids}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-8">
              {auction.isOpen ? (
                <span className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full text-sm font-semibold">
                  Status: Open
                </span>
              ) : (
                <span className="bg-neutral-800 text-neutral-400 px-4 py-2 rounded-full text-sm font-semibold">
                  Status: Closed
                </span>
              )}
            </div>

            {/* Winner Section */}
            <div className="bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-neutral-200">
                Winner Information
              </h2>
              {isUserWinner ? (
                <div className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg">
                  🏆 Congratulations! You won this auction!
                  {auction.contract ? (
                    auction.contract.institutionAccepted ? (
                      <Link
                        href={`/dashboard/contract/${auction.id}`}
                        className="bg-green-500/10 text-green-500 p-4 rounded-lg"
                      >
                        ✅ Contract Accepted by Institution
                      </Link>
                    ) : auction.contract.contractorAccepted ? (
                      <Link
                        href={`/dashboard/contract/${auction.id}`}
                        className="bg-blue-500/10 text-blue-500 p-4 rounded-lg"
                      >
                        🛠 Contract Accepted by Mess
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/contract/${auction.contract.id}`}
                        className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg"
                      >
                        ⏳ Contract Pending Acceptance
                      </Link>
                    )
                  ) : (
                    <Link
                      href={`/dashboard/contract/create-contract/${id}`}
                      className="block w-full text-center bg-yellow-600 text-neutral-200 px-2 py-2 mt-1 rounded-lg transition-all duration-300 hover:bg-yellow-500"
                    >
                      Create Contract
                    </Link>
                  )}
                </div>
              ) : auction.winner ? (
                <div className="space-y-2">
                  <p className="text-neutral-300">
                    Name: {auction.winner.name}
                  </p>
                  <p className="text-neutral-300">
                    Email: {auction.winner.email}
                  </p>
                </div>
              ) : (
                <p className="text-neutral-400">No winner declared yet.</p>
              )}
            </div>

            {/* Bidding Section */}
            {auction.isOpen ? (
              auction.userBid ? (
                <div className="bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-6">
                  <h2 className="text-xl font-bold mb-4 text-neutral-200">
                    Manage Your Bid
                  </h2>
                  <p className="text-yellow-500 font-semibold mb-4">
                    Your current bid: ₹{auction.userBid.amount}
                  </p>
                  <input
                    type="number"
                    className="w-full mb-6 bg-neutral-800 border border-yellow-900/20 rounded-lg p-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                    placeholder="Enter new bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                  />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleUpdateBid}
                      disabled={updatingBid}
                      className={`flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-200 px-6 py-3 rounded-lg transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingBid ? "Updating Bid..." : "Update Bid"}
                    </button>
                    <button
                      onClick={handleDeleteBid}
                      disabled={deletingBid}
                      className={`flex-1 bg-neutral-800 text-neutral-300 px-6 py-3 rounded-lg transition-colors hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {deletingBid ? "Deleting Bid..." : "Delete Bid"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-6">
                  <h2 className="text-xl font-bold mb-4 text-neutral-200">
                    Place Your Bid
                  </h2>
                  <input
                    type="number"
                    className="w-full mb-6 bg-neutral-800 border border-yellow-900/20 rounded-lg p-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                    placeholder="Enter bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                  />
                  <button
                    onClick={handlePlaceBid}
                    disabled={placingBid}
                    className={`w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-200 px-6 py-3 rounded-lg transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {placingBid ? "Placing Bid..." : "Place Bid"}
                  </button>
                </div>
              )
            ) : (
              <div className="bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-6">
                {auction.userBid ? (
                  <>
                    <h2 className="text-xl font-bold mb-4 text-neutral-200">
                      Your Bid
                    </h2>
                    <p className="text-neutral-300">
                      Your final bid was ₹{auction.userBid.amount}
                    </p>
                  </>
                ) : (
                  <h2 className="text-xl font-bold text-neutral-300">
                    No Bid Placed By You
                  </h2>
                )}
              </div>
            )}
          </div>

          {/* Creator Details Sidebar */}
          <div className="lg:w-1/4 h-fit backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-6">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
              Creator Details
            </h2>
            <div className="space-y-4">
              <Link
                href={`/profile/${auction.creator.id}`}
                className="block text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
              >
                {auction.creator.name}
              </Link>
              <p className="text-neutral-400">Email: {auction.creator.email}</p>
              <p className="text-neutral-400">Phone: {auction.creator.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;

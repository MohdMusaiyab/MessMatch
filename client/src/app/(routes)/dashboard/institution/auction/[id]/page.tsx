"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AuctionDetail = () => {
  const { id } = useParams(); // Extract auction ID
  const { data: session } = useSession(); // Use session for user authentication
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [placingBid, setPlacingBid] = useState(false); // For placing bid loader
  const [updatingBid, setUpdatingBid] = useState(false); // For updating bid loader
  const [deletingBid, setDeletingBid] = useState(false); // For deleting bid loader

  // Fetch auction details when the component mounts or when ID changes
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
        if (data.userBid) setBidAmount(data.userBid.amount); // Pre-fill bid amount if user has already placed a bid
      } catch (err) {
        setError("Failed to fetch auction. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  // Handle placing a new bid
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
        userBid: { amount: bidAmount }, // Update bid details locally
        totalBids: prev.totalBids + 1, // Increment total bids count
      }));
    } catch (err) {
      alert("Failed to place bid. Please try again.");
    } finally {
      setPlacingBid(false);
    }
  };

  // Handle updating an existing bid
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
        userBid: { amount: response.data.data.amount }, // Update bid details locally
      }));
    } catch (err) {
      alert("Failed to update bid. Please try again.");
    } finally {
      setUpdatingBid(false);
    }
  };

  // Handle deleting a bid
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
        userBid: null, // Remove user bid from state
        totalBids: Math.max(prev.totalBids - 1, 0), // Decrement total bids count
      }));
      setBidAmount(""); // Reset bid input field
    } catch (err) {
      alert("Failed to delete bid. Please try again.");
    } finally {
      setDeletingBid(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!auction) return <div>No auction found.</div>;

  return (
    <div className="container mx-auto p-4 flex">
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">{auction.title}</h1>
        <p>{auction.description}</p>
        <p className="text-gray-500">Created on: {new Date(auction.createdAt).toLocaleDateString()}</p>
        <p className="text-gray-500">Total Bids: {auction.totalBids}</p>
        
        {/* Auction Status */}
        {auction.isOpen ? (
          <p className="text-green-500 font-semibold">Status: Open</p>
        ) : (
          <p className="text-red-500 font-semibold">Status: Closed</p>
        )}

        {/* Bid Management Section */}
        {auction.isOpen ? (
          auction.userBid ? (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2">Manage Your Bid</h2>
              <p className="text-green-500 font-semibold">
                Your current bid: ₹{auction.userBid.amount}
              </p>
              <input
                type="number"
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter new bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdateBid}
                  className={`bg-blue-500 text-white px-4 py-2 rounded ${
                    updatingBid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={updatingBid}
                >
                  {updatingBid ? "Updating Bid..." : "Update Bid"}
                </button>
                <button
                  onClick={handleDeleteBid}
                  className={`bg-red-500 text-white px-4 py-2 rounded ${
                    deletingBid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={deletingBid}
                >
                  {deletingBid ? "Deleting Bid..." : "Delete Bid"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2">Place Your Bid</h2>
              <input
                type="number"
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
              />
              <button
                onClick={handlePlaceBid}
                className={`bg-blue-500 text-white px-4 py-2 rounded ${
                  placingBid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={placingBid}
              >
                {placingBid ? "Placing Bid..." : "Place Bid"}
              </button>
            </div>
          )
        ) : (
          <div className="mt-6">
            {auction.userBid ? (
              <>
                <h2 className="text-lg font-bold mb-2">Your Bid</h2>
                <p>Your current bid was ₹{auction.userBid.amount}.</p>
              </>
            ) : (
              <h2 className="text-lg font-bold mb-2">No Bid Placed By You </h2>
            )}
          </div>
        )}
      </div>

      {/* Creator Details Card */}
      <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md ml-4">
        <h2 className="text-lg font-bold mb-2">Creator Details</h2>
        <Link href={`/profile/${auction.creator.id}`} className="font-semibold">
          Name: {auction.creator.name}
        </Link>
        <p>Email: {auction.creator.email}</p>
      </div>
    </div>
  );
};

export default AuctionDetail;

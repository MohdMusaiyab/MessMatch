"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react"; // Import useSession
import Link from "next/link";

const AuctionDetail = () => {
  const params = useParams(); // Get parameters from the URL
  const { id } = params; // Extract auction ID from params
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number | "">(""); // For placing a bid
  const [placingBid, setPlacingBid] = useState(false); // Loading state for placing a bid
  const [userBids, setuserBids] = useState(false); // Track if the user has placed a bid

  // Fetch auction details when the component mounts or when ID changes
  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return; // If no ID is present, do nothing

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/get-auction/${id}`,
          {
            withCredentials: true,
          }
        );
        setAuction(response.data.data);
        setuserBids(response.data.data.userBids); // Set userBids
      } catch (err) {
        setError("Failed to fetch auction. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  // Handle placing a bid
  const handlePlaceBid = async () => {
    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    setPlacingBid(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/place-bid/${id}`,
        { amount: bidAmount },
        { withCredentials: true }
      );
      alert("Bid placed successfully!");
      setuserBids(true); // Update state to reflect the bid
      setBidAmount(""); // Clear the bid amount input
    } catch (err) {
      alert("Failed to place bid. Please try again.");
    } finally {
      setPlacingBid(false);
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
        <p className="text-gray-500">Created on: {auction.createdAt}</p>

        {/* Place Bid Section */}
        {!userBids ? (
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
        ) : (
          <div className="mt-6 text-green-500 font-semibold">
            Bid already placed for this auction.
          </div>
        )}
      </div>

      {/* Creator Details Card */}
      <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md ml-4">
        <h2 className="text-lg font-bold mb-2">Creator Details</h2>
        <Link
          href={`/profile/${auction?.creator.id}`}
          className="font-semibold"
        >
          Name: {auction.creator.name}
        </Link>
        <p>Email: {auction.creator.email}</p>
      </div>
    </div>
  );
};

export default AuctionDetail;

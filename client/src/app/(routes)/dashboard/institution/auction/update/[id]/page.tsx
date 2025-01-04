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

  // Handle auction update
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

  // Handle close auction
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

  // Handle open auction
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

  // Handle accepting bid
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!auction) return <div>No auction found.</div>;

  const isCreator = session?.user.id === auction.creatorId;

  return (
    <div className="container mx-auto p-4">
      {isCreator && (
        <form onSubmit={handleUpdate} className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Manage Auction</h2>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Update Auction
            </button>
            {auction.isOpen ? (
              <button
                type="button"
                onClick={handleCloseAuction}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Close Auction
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAuction}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Open Auction Again
              </button>
            )}
          </div>
        </form>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-2">Auction Details</h2>
        <p>
          <span className="font-semibold">Title:</span> {auction.title}
        </p>
        <p>
          <span className="font-semibold">Description:</span> {auction.description}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {auction.isOpen ? "Open" : "Closed"}
        </p>
        <p>
          <span className="font-semibold">Winner:</span>{" "}
          {auction.winner
            ? `${auction.winner.user.name} (${auction.winner.user.email})`
            : "No winner till now"}
        </p>
        <p>
          <span className="font-semibold">Total Bids:</span> {auction.bids?.length || 0}
        </p>

        <h3 className="text-lg font-semibold mt-4">Bids</h3>
        {auction.bids && auction.bids.length > 0 ? (
          auction.bids.map((bid: any) => (
            <div
              key={bid.id}
              className="flex justify-between items-center border p-2 mb-2"
            >
              <div>
                <p>
                  <span className="font-semibold">Bid Amount:</span> {bid.amount}
                </p>
                <p>
                  <span className="font-semibold">Bidder Name:</span>{" "}
                  <Link
                    href={`/profile/${bid.bidder.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {bid.bidder.name || "N/A"}
                  </Link>
                </p>
              </div>
              {isCreator && auction.isOpen && (
                <button
                  onClick={() => handleAcceptBid(bid.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Accept Bid
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No bids available for this auction.</p>
        )}
      </div>
    </div>
  );
};

export default AuctionDetail;

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react"; // Import useSession

const AuctionDetail = () => {
  const params = useParams(); // Get parameters from the URL
  const { id } = params; // Extract auction ID from params
  const { data: session } = useSession(); // Get session data
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Fetch auction details when the component mounts or when ID changes
  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return; // If no ID is present, do nothing

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/get/${id}`,
          {
            withCredentials: true,
          }
        );
        setAuction(response.data.data);
        setTitle(response.data.data.title); // Set initial title
        setDescription(response.data.data.description); // Set initial description
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
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/update/${id}`,
        {
          title,
          description,
        },
        {
          withCredentials: true,
        }
      );
      alert(response.data.message); // Show success message
      setAuction(response.data.data); // Update local auction data
    } catch (err) {
      setError("Failed to update auction. Please try again later.");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!auction) return <div>No auction found.</div>;

  // Check if the current user is the creator of the auction
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
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Close Auction
            </button>
          </div>
        </form>
      )}

      <div>
        
        <p className="font-semibold mb-4">
          Total Bids: {auction.bids?.length || 0}
        </p>

        {/* Render Bids */}
        <div>
          {auction.bids && auction.bids.length > 0 ? (
            auction.bids.map((bid: any) => (
              <div
                key={bid.id}
                className="flex justify-between items-center border p-2 mb-2"
              >
                <div>
                  <p>
                    <span className="font-semibold">Bid Amount:</span>{" "}
                    {bid.amount}
                  </p>
                  <p>
                    <span className="font-semibold">Bidder ID:</span>{" "}
                    {bid.bidderId}
                  </p>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                  Accept Bid
                </button>
              </div>
            ))
          ) : (
            <p>No bids available for this auction.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;

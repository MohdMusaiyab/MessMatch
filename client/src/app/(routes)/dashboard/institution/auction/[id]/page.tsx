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
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!auction) return <div>No auction found.</div>;

  return (
    <div className="container mx-auto p-4 flex">
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">{auction.title}</h1>
        <p>{auction.description}</p>
        <p className="text-gray-500">
          Created on: {new Date(auction.createdAt).toLocaleDateString()}
        </p>
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

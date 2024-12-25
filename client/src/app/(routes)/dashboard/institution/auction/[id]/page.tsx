"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const AuctionDetail = () => {
  const params = useParams(); // Get parameters from the URL
  const { id } = params; // Extract auction ID from params
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Fetch auction details when the component mounts or when ID changes
  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return; // If no ID is present, do nothing

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/get/${id}`, {
          withCredentials: true,
        });
        setAuction(response.data.data);
        setTitle(response.data.data.title); // Set initial title
        setDescription(response.data.data.description); // Set initial description
      } catch (err) {
        setError('Failed to fetch auction. Please try again later.');
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
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/update/${id}`, {
        title,
        description,
      }, {
        withCredentials: true,
      });
      alert(response.data.message); // Show success message
      setAuction(response.data.data); // Update local auction data
    } catch (err) {
      setError('Failed to update auction. Please try again later.');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!auction) return <div>No auction found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{auction.title}</h1>
      <p>{auction.description}</p>
      <p className="text-gray-500">Created on: {new Date(auction.createdAt).toLocaleDateString()}</p>

      {/* Update Form */}
      <form onSubmit={handleUpdate} className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Update Auction</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Update Auction
        </button>
      </form>
    </div>
  );
};

export default AuctionDetail;

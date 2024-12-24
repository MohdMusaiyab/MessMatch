"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const MyAuctions = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/my-auctions`, {
          withCredentials: true,
        });
        setAuctions(response.data.data);
      } catch (err) {
        setError('Failed to fetch auctions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleDeleteAuction = async (id: string) => {
    if (confirm("Are you sure you want to delete this auction?")) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/delete/${id}`, {
          withCredentials: true,
        });
        // Update the state to remove the deleted auction
        setAuctions((prevAuctions) => prevAuctions.filter((auction) => auction.id !== id));
      } catch (err) {
        setError('Failed to delete auction. Please try again later.');
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Auctions</h1>
      {auctions.length === 0 ? (
        <p>No auctions found.</p>
      ) : (
        <ul className="space-y-4">
          {auctions.map((auction) => (
            <li key={auction.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{auction.title}</h2>
              <p>{auction.description}</p>
              <p className="text-gray-500">Created on: {new Date(auction.createdAt).toLocaleDateString()}</p>
              <button
                onClick={() => handleDeleteAuction(auction.id)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Delete Auction
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAuctions;

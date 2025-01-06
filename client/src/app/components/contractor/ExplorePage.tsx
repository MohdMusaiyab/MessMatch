"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Auction {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
  creator: {
    name: string;
    email: string;
    role: string;
  };
  winner?: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
  bidCount: number;
  highestBid: number | null;
  highestBidder: string | null;
  createdAt: string;
}

const ExplorePage = () => {
  // State management
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [maxBids, setMaxBids] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Auctions
  const fetchAuctions = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/filters`, {
        params: {
          page,
          search,
          auctionStatus: status === 'all' ? undefined : status,
          maxBids,
        },
        withCredentials: true,
      });

      setAuctions(response.data.data.auctions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleMaxBidsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxBids(e.target.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'No bids';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  useEffect(() => {
    fetchAuctions(pagination.page);
  }, [pagination.page, search, status, maxBids]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            className="px-4 py-2 border rounded-md w-full md:w-64"
            placeholder="Search auctions or creators"
            value={search}
            onChange={handleSearchChange}
          />
          
          <select
            className="px-4 py-2 border rounded-md"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>

          <select
            className="px-4 py-2 border rounded-md"
            value={maxBids}
            onChange={handleMaxBidsChange}
          >
            <option value="">All Bid Counts</option>
            <option value="5">Up to 5 Bids</option>
            <option value="10">Up to 10 Bids</option>
            <option value="15">Up to 15 Bids</option>
            <option value="20">Up to 20 Bids</option>
            <option value="20+">More than 20 Bids</option>
          </select>
        </div>
        
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => fetchAuctions(1)}
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {auctions.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {auctions.map((auction) => (
                  <div key={auction.id} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{auction.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        auction.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {auction.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{auction.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Created by:</span>
                        <span className="font-medium">{auction.creator.name}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Total Bids:</span>
                        <span className="font-medium">{auction.bidCount}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Highest Bid:</span>
                        <span className="font-medium">{formatCurrency(auction.highestBid)}</span>
                      </p>
                      {auction.highestBidder && (
                        <p className="flex justify-between">
                          <span className="text-gray-500">Highest Bidder:</span>
                          <span className="font-medium">{auction.highestBidder}</span>
                        </p>
                      )}
                      <p className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium">{formatDate(auction.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-8">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => fetchAuctions(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => fetchAuctions(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </button>
              </div>

            </div>
          ) : (
            // No auctions found message
            <div className="text-center py-12 text-gray-500">No auctions found matching your criteria</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;

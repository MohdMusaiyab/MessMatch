"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

const CreateContractPage = () => {
  const [contractDetails, setContractDetails] = useState<{
    winnerId?: string;
    creatorId?: string;
    contract?: { id: string }; // Existing contract details
    message?: string;
  } | null>(null);
  const [terms, setTerms] = useState(""); // State for terms input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { auctionId } = useParams();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/${auctionId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setContractDetails(response.data);
        } else {
          setError(response.data.message || "Failed to fetch contract details");
        }
      } catch (error) {
        console.error("Error fetching contract details:", error);
        setError("Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [auctionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/create-contract/${auctionId}`,
        { terms }, // Only sending terms
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Contract created successfully!");
        setContractDetails({ contract: response.data.data }); // Update contract state
      } else {
        setError(response.data.message || "Failed to create contract");
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      setError("Internal Server Error");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Contract</h1>

        {/* If contract already exists, show the link */}
        {contractDetails?.contract ? (
          <div className="text-center text-green-600">
            <p className="mb-4">A contract already exists for this auction.</p>
            <Link
              href={`/dashboard/contract/${contractDetails.contract.id}`}
              className="text-blue-500 underline"
            >
              View Contract
            </Link>
          </div>
        ) : (
          <>
            {/* Display Winner ID and Creator ID */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Winner ID:</strong> {contractDetails?.winnerId}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Creator ID:</strong> {contractDetails?.creatorId}
              </p>
            </div>

            {/* Show form to create a contract */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="terms"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Terms and Conditions
                </label>
                <textarea
                  id="terms"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Enter your terms and conditions here..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Create Contract
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateContractPage;

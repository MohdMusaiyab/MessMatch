"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Contract {
  id: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
  auctionId: string;
  contractorId: string;
  institutionId: string;
  status: string;
  contractorAccepted: boolean;
  institutionAccepted: boolean;
}

interface ContractResponse {
  success: boolean;
  message?: string;
  winnerId?: string;
  creatorId?: string;
  data?: {
    contract: Contract | null;
  };
}

const CreateContractPage = () => {
  const [contractDetails, setContractDetails] = useState<ContractResponse | null>(null);
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { auctionId } = useParams();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await axios.get<ContractResponse>(
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
    setLoading(true);

    try {
      const response = await axios.post<ContractResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/create-contract/${auctionId}`,
        { terms },
        { withCredentials: true }
      );

      if (response.data.success) {
        setContractDetails(response.data);
      } else {
        setError(response.data.message || "Failed to create contract");
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      setError("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-yellow-500 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-red-500 bg-neutral-900/50 p-6 rounded-lg border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  if (!contractDetails) {
    return null; // Or a loading state, or some other fallback
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent text-center">
            Create Contract
          </h1>

          {contractDetails.data && contractDetails.data.contract ? (
            <div className="text-center space-y-4">
              <p className="text-yellow-500 mb-4">
                A contract already exists for this auction.
              </p>
              <div className="p-4 bg-neutral-950/50 rounded-lg border border-yellow-900/20 mb-4">
                <p className="text-neutral-300">
                  <span className="text-yellow-500">Contract Status:</span>{" "}
                  {contractDetails.data.contract.status}
                </p>
                <p className="text-neutral-300">
                  <span className="text-yellow-500">Created:</span>{" "}
                  {new Date(contractDetails.data.contract.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/dashboard/contract/${contractDetails.data.contract.id}`}
                className="inline-block px-6 py-3 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all duration-200"
              >
                View Contract
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-4">
                <p className="text-neutral-300 mb-2">
                  <span className="text-yellow-500">Winner ID:</span>{" "}
                  {contractDetails?.winnerId}
                </p>
                <p className="text-neutral-300">
                  <span className="text-yellow-500">Creator ID:</span>{" "}
                  {contractDetails?.creatorId}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="terms"
                    className="block text-yellow-500 text-sm font-medium mb-2"
                  >
                    Terms and Conditions
                  </label>
                  <textarea
                    id="terms"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full p-3 bg-neutral-950/50 border border-yellow-900/20 rounded-lg
                             text-neutral-300 placeholder-neutral-600
                             focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                    rows={6}
                    placeholder="Enter your terms and conditions here..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg font-medium
                           bg-yellow-500/10 text-yellow-500
                           hover:bg-yellow-500/20
                           transition-all duration-200"
                >
                  Create Contract
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContractPage;

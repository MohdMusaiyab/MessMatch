"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const ContractDetailsPage = () => {
  const { contractId } = useParams(); // Get contractId from URL
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/get-contract/${contractId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setContract(response.data.data);
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
  }, [contractId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Contract Details
        </h1>

        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Contract ID:</strong> {contract?.id}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Created At:</strong>{" "}
            {new Date(contract?.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Updated At:</strong>{" "}
            {new Date(contract?.updatedAt).toLocaleString()}
          </p>
        </div>

        {/* Auction Details */}
        <div className="mb-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Auction Details</h2>
          <p className="text-sm text-gray-700">
            <strong>Title:</strong> {contract?.auction?.title}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Description:</strong> {contract?.auction?.description}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Status:</strong>{" "}
            {contract?.auction?.isOpen ? "Open" : "Closed"}
          </p>
        </div>

        {/* Institution (Owner) Details */}
        <div className="mb-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">
            Institution (Owner) Details
          </h2>
          <p className="text-sm text-gray-700">
            <strong>Name:</strong> {contract?.institution?.name}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> {contract?.institution?.email}
          </p>
          <p>
            {
              // Display two buttons of green/red accoridng to status of acceptanc eby contractotr and insitution
              contract?.institutionAccepted ? (
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2">
                  Accepted
                </button>
              ) : (
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Not Accepted
                </button>
              )

            }
          </p>
        </div>

        {/* Contractor Details */}
        <div className="mb-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Contractor Details</h2>
          <p className="text-sm text-gray-700">
            <strong>Name:</strong> {contract?.contractor?.user?.name}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> {contract?.contractor?.user?.email}
          </p>
          <p>
            {
              // Display two buttons of green/red accoridng to status of acceptanc eby contractotr and insitution
              contract?.contractorAccepted ? (
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2">
                  Accepted
                </button>
              ) : (
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
                  Not Accepted
                </button>
              )

            }
          </p>
        </div>

        {/* Contract Terms */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Terms & Conditions</h2>
          <p className="text-sm text-gray-700">{contract?.terms}</p>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsPage;

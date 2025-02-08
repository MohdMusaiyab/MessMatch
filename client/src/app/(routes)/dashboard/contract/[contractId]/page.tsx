"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from 'react-modal'; // Install: npm install react-modal

interface User {
  id: string;
  name: string;
  email: string;
}

interface Contractor {
  id: string;
  user: User;
  userId: string;
}

interface Institution {
  id: string;
  name: string;
  email: string;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
}

interface Contract {
  id: string;
  createdAt: string;
  updatedAt: string;
  terms: string;
  status: string;
  auction: Auction;
  contractor: Contractor;
  institution: Institution;
  contractorAccepted: boolean;
  institutionAccepted: boolean;
}

interface StatusBadgeProps {
  accepted: boolean;
}

const ContractDetailsPage = () => {
  const { contractId } = useParams();
  const { data: session } = useSession();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isTerminating, setIsTerminating] = useState<boolean>(false);
  const [showTerminationModal, setShowTerminationModal] = useState<boolean>(false);
  const [terminationError, setTerminationError] = useState<string>("");

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          data: Contract;
          message?: string;
        }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/get-contract/${contractId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setContract(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch contract details");
        }
      } catch (error) {
        setError("Failed to load contract details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [contractId]);

  const handleToggleStatus = async () => {
    if (!contract) return;

    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/toggle-status/${contractId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setContract(prevContract => {
          if (!prevContract) return null;
          return {
            ...prevContract,
            ...response.data.data,
          };
        });
      }
    } catch (error) {
      setError("Failed to update contract status. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const pollContractStatus = async () => {
    try {
      const response = await axios.get<{
        success: boolean;
        data: {
          status: string;
          institutionAccepted: boolean;
          contractorAccepted: boolean;
        };
      }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/status/${contractId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setContract(prevContract => prevContract ? {
          ...prevContract,
          status: response.data.data.status,
          institutionAccepted: response.data.data.institutionAccepted,
          contractorAccepted: response.data.data.contractorAccepted,
        } : null);
      }
    } catch (error) {
      console.error("Failed to fetch contract status:", error);
    }
  };

  useEffect(() => {
    if (contract && contract.status !== "ACCEPTED" && contract.status !== "TERMINATED") {
      const intervalId = setInterval(pollContractStatus, 5000); // Poll every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [contract]);

  const StatusBadge: React.FC<StatusBadgeProps> = ({ accepted }) => (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
        accepted
          ? "bg-green-500/10 text-green-500 border border-green-500/20"
          : "bg-red-500/10 text-red-500 border border-red-500/20"
      }`}
    >
      {accepted ? "Accepted" : "Not Accepted"}
    </span>
  );

  const canToggleStatus = () => {
    if (!contract || !session?.user) return false;

    if (session.user.role === "CONTRACTOR") {
      return session.user.id === contract.contractor.userId && contract.status !== "ACCEPTED";
    }

    return session.user.id === contract.institution.id && contract.status !== "ACCEPTED";
  };

  const canTerminateContract = () => {
    if (!contract || !session?.user) return false;

    // Only allow termination if the contract is ACCEPTED and the user is either
    // the institution or the contractor.
    if (contract.status === "ACCEPTED") {
      return (session.user.id === contract.institution.id || session.user.id === contract.contractor.userId);
    }

    return false;
  };

  const handleOpenTerminationModal = () => {
    setShowTerminationModal(true);
  };

  const handleCloseTerminationModal = () => {
    setShowTerminationModal(false);
    setTerminationError("");
  };

  const handleTerminateContract = async () => {
    if (!contract) return;

    setIsTerminating(true);
    setTerminationError("");

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/terminate/${contractId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the contract status after successful termination
        setContract({ ...contract, status: "TERMINATED" });
        handleCloseTerminationModal();
      } else {
        setTerminationError(response.data.message || "Failed to terminate contract.");
      }
    } catch (error) {
      console.error("Error terminating contract:", error);
      setTerminationError("Failed to terminate contract. Please try again later.");
    } finally {
      setIsTerminating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-yellow-500 text-lg animate-pulse">Loading contract details...</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent text-center">
            Contract Details
          </h1>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-neutral-400">
                <span className="text-yellow-500">Contract ID:</span> {contract?.id}
              </p>
              <p className="text-neutral-400">
                <span className="text-yellow-500">Created:</span>{" "}
                {new Date(contract?.createdAt ?? "").toLocaleString()}
              </p>
              <p className="text-neutral-400">
                <span className="text-yellow-500">Status:</span>{" "}
                <span className={`px-3 py-1 rounded-full text-sm ${
                  contract?.status === "ACCEPTED"
                    ? "bg-green-500/10 text-green-500"
                  : contract?.status === "TERMINATED"
                      ? "bg-red-500/10 text-red-500" // Show red for terminated
                    : "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {contract?.status}
                </span>
              </p>
            </div>

            <div className="bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-500">Auction Details</h2>
              <div className="space-y-3">
                <p className="text-neutral-300">
                  <span className="text-yellow-500">Title:</span> {contract?.auction.title}
                </p>
                <p className="text-neutral-300">
                  <span className="text-yellow-500">Description:</span> {contract?.auction.description}
                </p>
                <p className="text-neutral-300">
                  <span className="text-yellow-500">Status:</span>{" "}
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    contract?.auction.isOpen
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-neutral-800 text-neutral-400"
                  }`}>
                    {contract?.auction.isOpen ? "Open" : "Closed"}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-6">
                <h2 className="text-xl font-bold mb-4 text-yellow-500">Institution Details</h2>
                <div className="space-y-3">
                  <p className="text-neutral-300">
                    <span className="text-yellow-500">Name:</span> {contract?.institution.name}
                  </p>
                  <p className="text-neutral-300">
                    <span className="text-yellow-500">Email:</span> {contract?.institution.email}
                  </p>
                  <div className="mt-4">
                    <StatusBadge accepted={contract?.institutionAccepted ?? false} />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-6">
                <h2 className="text-xl font-bold mb-4 text-yellow-500">Contractor Details</h2>
                <div className="space-y-3">
                  <p className="text-neutral-300">
                    <span className="text-yellow-500">Name:</span> {contract?.contractor.user.name}
                  </p>
                  <p className="text-neutral-300">
                    <span className="text-yellow-500">Email:</span> {contract?.contractor.user.email}
                  </p>
                  <div className="mt-4">
                    <StatusBadge accepted={contract?.contractorAccepted ?? false} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950/50 rounded-lg border border-yellow-900/20 p-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-500">Terms & Conditions</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-neutral-300 whitespace-pre-wrap">{contract?.terms}</p>
              </div>
            </div>

            {canToggleStatus() && (
              <div className="flex justify-center">
                <button
                  onClick={handleToggleStatus}
                  disabled={isUpdating}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${session?.user.role === "CONTRACTOR"
                      ? contract?.contractorAccepted
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      : contract?.institutionAccepted
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                    }
                    ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {isUpdating ? "Updating..." :
                    (session?.user.role === "CONTRACTOR"
                      ? (contract?.contractorAccepted ? "Revoke Acceptance" : "Accept Contract")
                      : (contract?.institutionAccepted ? "Revoke Acceptance" : "Accept Contract")
                    )
                  }
                </button>
              </div>
            )}

            {canTerminateContract() && (
              <div className="flex justify-center">
                <button
                  onClick={handleOpenTerminationModal}
                  disabled={isTerminating}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-red-600 hover:bg-red-700 text-white
                    ${isTerminating ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {isTerminating ? "Terminating..." : "Terminate Contract"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showTerminationModal}
        onRequestClose={handleCloseTerminationModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#2D3748',
            color: 'white',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #4A5568'
          }
        }}
        contentLabel="Termination Confirmation"
      >
        <h2>Confirm Termination</h2>
        <p>Are you sure you want to terminate this contract? This action cannot be undone.</p>
        {terminationError && <p className="text-red-500">{terminationError}</p>}
        <div className="mt-4 flex justify-end">
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleCloseTerminationModal}>
            Cancel
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleTerminateContract} disabled={isTerminating}>
            {isTerminating ? "Terminating..." : "Terminate"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ContractDetailsPage;

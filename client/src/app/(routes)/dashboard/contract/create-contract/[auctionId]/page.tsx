"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Utensils, ArrowLeft } from "lucide-react";
import { useToast } from "@/context/ToastContext";

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

interface ContractDataExisting {
  contract: Contract;
}

interface ContractDataCreated {
  id: string;
}

interface ContractResponseSuccessExisting {
  success: true;
  message?: string;
  winnerId?: string;
  creatorId?: string;
  winnerName?: string;
  winnerEmail?: string;
  data: ContractDataExisting;
}

interface ContractResponseSuccessCreated {
  success: true;
  message?: string;
  winnerId?: string;
  creatorId?: string;
  winnerName?: string;
  winnerEmail?: string;
  data: ContractDataCreated;
}

interface ContractResponseFailure {
  success: false;
  message: string;
}

type ContractResponse =
  | ContractResponseSuccessExisting
  | ContractResponseSuccessCreated
  | ContractResponseFailure;

const CreateContractPage = () => {
  const [contractDetails, setContractDetails] =
    useState<ContractResponse | null>(null);
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatingContract, setCreatingContract] = useState(false);
  const [error, setError] = useState("");
  const { auctionId } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await axios.get<ContractResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/${auctionId}`,
          { withCredentials: true }
        );

        setContractDetails(response.data);
      } catch (err) {
        console.error("Error fetching contract details:", err);
        setError("Failed to fetch contract information.");
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [auctionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingContract(true);
  
    try {
      const response = await axios.post<ContractResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/create-contract/${auctionId}`,
        { terms },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        toast.success("Contract created and issued successfully!");
        if ("id" in response.data.data) {
          router.push(`/dashboard/contract/${response.data.data.id}`);
          return;
        } else if ("contract" in response.data.data) {
          router.push(`/dashboard/contract/${response.data.data.contract.id}`);
          return;
        }
      } else {
        const msg = response.data.message || "Failed to create contract";
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create contract";
      setError(msg);
      toast.error(msg);
    } finally {
      setCreatingContract(false);
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
        <div className="text-red-400 bg-neutral-900/50 p-6 rounded-xl border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  if (!contractDetails || !("success" in contractDetails)) {
    return null;
  }

  if (!contractDetails.success) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-red-400 bg-neutral-900/50 p-6 rounded-xl border border-red-500/20">
          {contractDetails.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="backdrop-blur-lg bg-neutral-900/50 rounded-2xl border border-yellow-900/20 p-6 lg:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
              Draft Dining Contract
            </h1>
            <Link
              href={`/dashboard/institution/auction/${auctionId}`}
              className="text-xs text-neutral-400 hover:text-yellow-400 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Auction</span>
            </Link>
          </div>

          {contractDetails.data && "contract" in contractDetails.data ? (
            <div className="text-center space-y-4">
              <p className="text-yellow-400 font-semibold mb-4">
                A contract already exists for this auction.
              </p>
              <div className="p-4 bg-neutral-950/70 rounded-xl border border-neutral-800 mb-4 text-sm">
                <p className="text-neutral-300">
                  <span className="text-yellow-500">Contract Status:</span>{" "}
                  {contractDetails.data.contract.status}
                </p>
                <p className="text-neutral-300 mt-1">
                  <span className="text-yellow-500">Created:</span>{" "}
                  {new Date(
                    contractDetails.data.contract.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/dashboard/contract/${contractDetails.data.contract.id}`}
                className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-neutral-950 font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all text-sm"
              >
                View Contract
              </Link>
            </div>
          ) : (
            <>
              {(!contractDetails?.winnerId || !contractDetails?.creatorId) && (
                <div className="text-center space-y-4 mb-6">
                  <p className="text-red-400 text-sm">
                    No winner has been selected for this auction yet. Please select a winning bidder before drafting terms.
                  </p>
                  <Link
                    href={`/dashboard/institution/auction/update/${auctionId}`}
                    className="inline-block px-6 py-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-medium text-sm hover:bg-yellow-500/20 transition-all"
                  >
                    Select Winning Bidder
                  </Link>
                </div>
              )}

              {contractDetails?.winnerId && contractDetails?.creatorId && (
                <>
                  <div className="mb-6 bg-neutral-950/70 rounded-xl border border-neutral-800 p-4 grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                        <Utensils className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block">Awarded Caterer</span>
                        <span className="text-white font-semibold text-sm">
                          {contractDetails.winnerName || "Winning Contractor"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block">Issuing Authority</span>
                        <span className="text-white font-semibold text-sm">Your Institution</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="terms"
                        className="block text-yellow-400 text-sm font-semibold mb-2"
                      >
                        Contract Terms & Specifications
                      </label>
                      <textarea
                        id="terms"
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                        className="w-full p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-500/60 transition-colors text-sm leading-relaxed"
                        rows={7}
                        placeholder="Detail meal timings, hygiene standards, payment milestones, penalty clauses, and dietary rotations..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-neutral-950 hover:from-yellow-400 hover:to-yellow-500 transition-all text-sm shadow-md disabled:opacity-50"
                      disabled={creatingContract}
                    >
                      {creatingContract ? "Issuing Contract..." : "Create & Issue Contract"}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContractPage;

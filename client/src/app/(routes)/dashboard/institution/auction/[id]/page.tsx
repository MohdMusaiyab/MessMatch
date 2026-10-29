"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { CheckCircle2, Clock, FileText, ArrowRight, Gavel, Building2 } from "lucide-react";

const AuctionDetail = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [placingBid, setPlacingBid] = useState(false);
  const [updatingBid, setUpdatingBid] = useState(false);
  const [deletingBid, setDeletingBid] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/get-auction/${id}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data.data;
        setAuction(data);
        if (data.userBid) setBidAmount(data.userBid.amount);
      } catch (err) {
        setError("Failed to fetch auction. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  const handlePlaceBid = async () => {
    if (!bidAmount || bidAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    setPlacingBid(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/place-bid/${id}`,
        { amount: bidAmount },
        { withCredentials: true }
      );
      toast.success("Bid placed successfully!");
      setAuction((prev: any) => ({
        ...prev,
        userBid: { amount: bidAmount },
        totalBids: (prev?.totalBids || 0) + 1,
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to place bid. Please try again.");
    } finally {
      setPlacingBid(false);
    }
  };

  const handleUpdateBid = async () => {
    if (!bidAmount || bidAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    setUpdatingBid(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/update-bid/${id}`,
        { amount: bidAmount },
        { withCredentials: true }
      );
      toast.success("Bid updated successfully!");
      setAuction((prev: any) => ({
        ...prev,
        userBid: { amount: bidAmount },
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update bid. Please try again.");
    } finally {
      setUpdatingBid(false);
    }
  };

  const handleDeleteBid = async () => {
    if (!auction?.userBid) {
      toast.error("No bid to delete.");
      return;
    }

    setDeletingBid(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/delete-bid/${id}`,
        { withCredentials: true }
      );
      toast.success("Bid deleted successfully!");
      setAuction((prev: any) => ({
        ...prev,
        userBid: null,
        totalBids: Math.max((prev?.totalBids || 1) - 1, 0),
      }));
      setBidAmount("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete bid. Please try again.");
    } finally {
      setDeletingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-yellow-500 text-lg">Loading auction...</div>
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

  if (!auction) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="text-neutral-300 bg-neutral-900/50 p-6 rounded-xl border border-yellow-500/20">
          No auction found.
        </div>
      </div>
    );
  }

  const isUserWinner = Boolean(auction.winner && session?.user?.id === auction.winner.id);
  const isUserCreator = Boolean(auction.creator && session?.user?.id === auction.creator.id);
  const isContractor = session?.user?.role === "CONTRACTOR";

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-6 lg:p-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
                {auction.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  auction.isOpen
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {auction.isOpen ? "Status: Open" : "Status: Closed"}
              </span>
            </div>

            <p className="text-neutral-300 mb-6 leading-relaxed">{auction.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 mb-8 text-sm">
              <p className="text-neutral-400">
                Created on: <span className="text-neutral-200">{new Date(auction.createdAt).toLocaleDateString()}</span>
              </p>
              <p className="text-neutral-400">
                Total Bids Placed: <span className="text-yellow-400 font-semibold">{auction.totalBids}</span>
              </p>
            </div>

            <div className="bg-neutral-950/60 rounded-xl border border-yellow-900/20 p-6 mb-8">
              <h2 className="text-lg font-bold mb-4 text-neutral-200 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-yellow-500" />
                <span>Winner & Contract Status</span>
              </h2>

              {isUserWinner ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-5 rounded-xl space-y-3">
                  <p className="font-semibold text-base">
                    🏆 Congratulations! You won this auction!
                  </p>
                  {auction.contract ? (
                    <div className="pt-2">
                      <Link
                        href={`/dashboard/contract/${auction.contract.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-sm hover:bg-emerald-500/30 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>View Contract ({auction.contract.institutionAccepted ? "Accepted by Institution" : "Pending Acceptance"})</span>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">
                      Waiting for the institution to draft and issue the digital contract terms.
                    </p>
                  )}
                </div>
              ) : isUserCreator ? (
                <div className="space-y-4">
                  {auction.winner ? (
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-neutral-400">Declared Winner: </span>
                        <strong className="text-white">{auction.winner.name}</strong> ({auction.winner.email})
                      </div>
                      {auction.contract ? (
                        <div className="pt-2">
                          <Link
                            href={`/dashboard/contract/${auction.contract.id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-semibold text-sm hover:bg-yellow-500/30 transition-all"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Existing Contract</span>
                          </Link>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <Link
                            href={`/dashboard/contract/create-contract/${id}`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-neutral-950 font-bold text-sm shadow-md hover:from-yellow-400 hover:to-yellow-500 transition-all"
                          >
                            <span>Create Contract with Winner</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-neutral-400 text-sm">No winner declared yet for this auction.</p>
                      <Link
                        href={`/dashboard/institution/auction/update/${id}`}
                        className="text-xs text-yellow-500 hover:text-yellow-400 font-semibold flex items-center gap-1"
                      >
                        <span>Review bids & select winner</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : auction.winner ? (
                <div className="space-y-2 text-sm">
                  <p className="text-neutral-300">
                    <span className="text-neutral-500">Winner:</span> {auction.winner.name}
                  </p>
                  <p className="text-neutral-400 text-xs">
                    Contract has been awarded for this dining requirement.
                  </p>
                </div>
              ) : (
                <p className="text-neutral-400 text-sm">No winner declared yet. Bidding is open to active contractors.</p>
              )}
            </div>

            {isUserCreator ? (
              <div className="bg-neutral-950/60 rounded-xl border border-neutral-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">You Created This Auction</h3>
                  <p className="text-xs text-neutral-400">
                    To review all competitive bids from contractors, edit specifications, or declare a winner, open your management console.
                  </p>
                </div>
                <Link
                  href={`/dashboard/institution/auction/update/${id}`}
                  className="px-5 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                >
                  Manage Auction
                </Link>
              </div>
            ) : auction.isOpen ? (
              auction.userBid ? (
                <div className="bg-neutral-950/60 rounded-xl border border-yellow-900/20 p-6">
                  <h2 className="text-lg font-bold mb-3 text-neutral-200">
                    Manage Your Bid
                  </h2>
                  <p className="text-yellow-400 font-semibold mb-4 text-sm">
                    Your current submitted bid: ₹{auction.userBid.amount} / meal
                  </p>
                  <input
                    type="number"
                    className="w-full mb-4 bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-neutral-200 focus:outline-none focus:border-yellow-500/60 transition-all text-sm"
                    placeholder="Enter revised bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleUpdateBid}
                      disabled={updatingBid}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-neutral-950 font-bold px-6 py-2.5 rounded-lg transition-all text-sm disabled:opacity-50"
                    >
                      {updatingBid ? "Updating Bid..." : "Update Bid"}
                    </button>
                    <button
                      onClick={handleDeleteBid}
                      disabled={deletingBid}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold px-6 py-2.5 rounded-lg transition-all text-sm disabled:opacity-50"
                    >
                      {deletingBid ? "Deleting Bid..." : "Delete Bid"}
                    </button>
                  </div>
                </div>
              ) : isContractor ? (
                <div className="bg-neutral-950/60 rounded-xl border border-yellow-900/20 p-6">
                  <h2 className="text-lg font-bold mb-3 text-neutral-200">
                    Place Your Bid
                  </h2>
                  <input
                    type="number"
                    className="w-full mb-4 bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-neutral-200 focus:outline-none focus:border-yellow-500/60 transition-all text-sm"
                    placeholder="Enter competitive bid amount per meal (₹)"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                  />
                  <button
                    onClick={handlePlaceBid}
                    disabled={placingBid}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-neutral-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-50 text-sm"
                  >
                    {placingBid ? "Submitting Bid..." : "Place Bid"}
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-950/60 rounded-xl border border-neutral-800 p-6">
                  <p className="text-neutral-400 text-sm">
                    This tender is open for bidding by verified catering contractors.
                  </p>
                </div>
              )
            ) : (
              <div className="bg-neutral-950/60 rounded-xl border border-neutral-800 p-6">
                {auction.userBid ? (
                  <>
                    <h2 className="text-base font-bold mb-1 text-neutral-200">
                      Your Final Bid
                    </h2>
                    <p className="text-yellow-400 font-semibold text-sm">
                      ₹{auction.userBid.amount} / meal
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                      This auction is now closed. Bidding is complete.
                    </p>
                  </>
                ) : (
                  <p className="text-neutral-400 text-sm">
                    This auction is closed. No further bids can be accepted.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="lg:w-1/4 h-fit backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-6">
            <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-yellow-500" />
              <span>Institution Details</span>
            </h2>
            <div className="space-y-3 text-sm">
              <Link
                href={`/profile/${auction.creator.id}`}
                className="block text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
              >
                {auction.creator.name}
              </Link>
              <p className="text-neutral-400 text-xs">Email: <span className="text-neutral-200">{auction.creator.email}</span></p>
              {auction.creator.contactNumber && (
                <p className="text-neutral-400 text-xs">
                  Phone: <span className="text-neutral-200">{auction.creator.contactNumber}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;

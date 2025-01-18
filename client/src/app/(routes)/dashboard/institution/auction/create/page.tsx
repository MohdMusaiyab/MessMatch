"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const CreateAuctionPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const requestData = {
      ...formData,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/create`,
        requestData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        router.push("/dashboard/institution/my-auctions");
      } else {
        throw new Error(response.data.message || "Failed to create auction");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4">
      <div className="max-w-2xl mx-auto backdrop-blur-lg bg-neutral-900/50 rounded-xl border border-yellow-900/20 p-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent text-center">
          Create Auction
        </h1>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full bg-neutral-800 border border-yellow-900/20 rounded-lg p-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full bg-neutral-800 border border-yellow-900/20 rounded-lg p-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
              rows={4}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-200 px-6 py-3 rounded-lg transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
          >
            {loading ? "Creating..." : "Create Auction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
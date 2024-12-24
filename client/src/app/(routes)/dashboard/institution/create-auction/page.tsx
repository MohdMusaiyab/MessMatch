"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const CreateAuctionPage = () => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const requestData = {
      ...formData,
    };

    try {
      setLoading(true);

      // Send data to the backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/create`,
        requestData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        // Redirect to the auctions list page
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
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Create Auction</h1>

      {error && (
        <div className="mb-4 text-red-600 border border-red-400 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Creating..." : "Create Auction"}
        </button>
      </form>
    </div>
  );
};

export default CreateAuctionPage;

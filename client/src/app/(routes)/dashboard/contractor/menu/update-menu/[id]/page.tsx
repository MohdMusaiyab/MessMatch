"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Edit, AlertCircle } from "lucide-react";

interface Menu {
  id: string;
  name: string;
  items: string[];
  pricePerHead: number;
  type: "VEG" | "NON_VEG" | "BOTH";
}

const UpdateMenuPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Menu>>({
    name: "",
    items: [],
    pricePerHead: 0,
    type: "VEG",
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/menu/${id}`,
            { withCredentials: true }
          );
          setMenu(response.data.data);
          setFormData({
            name: response.data.data.name,
            items: response.data.data.items,
            pricePerHead: response.data.data.pricePerHead,
            type: response.data.data.type,
          });
        }
      } catch (error) {
        setError("Failed to fetch menu data");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, items: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/update-menu/${id}`,
        formData,
        { withCredentials: true }
      );
      alert("Menu updated successfully!");
      router.push("/dashboard/contractor/menu");
    } catch (error) {
      setError("Failed to update menu. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 text-red-400 mt-12">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent flex items-center gap-3"
        >
          <Edit className="w-8 h-8" />
          Update Menu
        </motion.h1>

        {menu && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleFormSubmit}
            className="space-y-6 bg-neutral-900/50 backdrop-blur border border-yellow-900/20 rounded-lg p-6 shadow-lg"
          >
            <div>
              <label className="block text-neutral-200 font-medium mb-2">Menu Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-yellow-900/20 rounded-md px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-200 font-medium mb-2">
                Items (comma-separated)
              </label>
              <input
                type="text"
                name="items"
                value={formData.items?.join(", ") || ""}
                onChange={handleItemsChange}
                className="w-full bg-neutral-800 border border-yellow-900/20 rounded-md px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-200 font-medium mb-2">Price Per Head</label>
              <input
                type="number"
                name="pricePerHead"
                value={formData.pricePerHead || 0}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-yellow-900/20 rounded-md px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-neutral-200 font-medium mb-2">Menu Type</label>
              <select
                name="type"
                value={formData.type || "VEG"}
                onChange={handleInputChange}
                className="w-full bg-neutral-800 border border-yellow-900/20 rounded-md px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              >
                <option value="VEG">VEG</option>
                <option value="NON_VEG">NON_VEG</option>
                <option value="BOTH">BOTH</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
            >
              Update Menu
            </motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default UpdateMenuPage;
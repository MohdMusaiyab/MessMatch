"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Utensils } from "lucide-react";

const CreateMenuPage: React.FC = () => {
  const [name, setName] = useState("");
  const [items, setItems] = useState<string[]>([""]);
  const [pricePerHead, setPricePerHead] = useState<number | string>("");
  const [type, setType] = useState<"VEG" | "NON_VEG" | "BOTH">("VEG");

  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/create-menu`,
        {
          name,
          items,
          pricePerHead: Number(pricePerHead),
          type,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        alert("Menu created successfully!");
        setName("");
        setItems([""]);
        setPricePerHead("");
        setType("VEG");
      } else {
        alert("Failed to create menu.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
      console.error("Error creating menu:", error.response.data);
      alert(error.response.data.message || "Something went wrong.");
      } else {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent flex items-center gap-3"
        >
          <Utensils className="w-8 h-8" />
          Create Menu
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-neutral-900/50 backdrop-blur border border-yellow-900/20 rounded-lg p-6 shadow-lg"
        >
          <div>
            <label className="block text-neutral-200 font-medium mb-2">
              Menu Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-800 border border-yellow-900/20 rounded-md px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-200 font-medium mb-2">
              Menu Items
            </label>
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    className="flex-1 bg-neutral-800 border border-yellow-900/20 rounded-md px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-medium transition-colors mt-2"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </motion.button>
          </div>

          <div>
            <label className="block text-neutral-200 font-medium mb-2">
              Price Per Head
            </label>
            <input
              type="number"
              value={pricePerHead}
              onChange={(e) => setPricePerHead(e.target.value)}
              className="w-full bg-neutral-800 border border-yellow-900/20 rounded-md px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-200 font-medium mb-2">
              Menu Type
            </label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "VEG" | "NON_VEG" | "BOTH")
              }
              className="w-full bg-neutral-800 border border-yellow-900/20 rounded-md px-4 py-2 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              required
            >
              <option value="VEG">Veg</option>
              <option value="NON_VEG">Non-Veg</option>
              <option value="BOTH">Both</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
          >
            Create Menu
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateMenuPage;

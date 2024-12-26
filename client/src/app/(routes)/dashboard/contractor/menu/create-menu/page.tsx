"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const CreateMenuPage: React.FC = () => {
  const { data: session } = useSession();
  // State for form inputs

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
        {
          withCredentials: true, // Include cookies in the request
        }
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
    } catch (error: any) {
      console.error("Error creating menu:", error.response?.data || error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Menu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold">Menu Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-4 py-2 w-full"
            required
          />
        </div>

        {/* Items */}
        <div>
          <label className="block font-semibold">Menu Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className="border rounded px-4 py-2 flex-1"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 font-bold"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="text-blue-500 font-bold"
          >
            + Add Item
          </button>
        </div>

        {/* Price per head */}
        <div>
          <label className="block font-semibold">Price Per Head</label>
          <input
            type="number"
            value={pricePerHead}
            onChange={(e) => setPricePerHead(e.target.value)}
            className="border rounded px-4 py-2 w-full"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-semibold">Menu Type</label>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "VEG" | "NON_VEG" | "BOTH")
            }
            className="border rounded px-4 py-2 w-full"
            required
          >
            <option value="VEG">Veg</option>
            <option value="NON_VEG">Non-Veg</option>
            <option value="BOTH">Both</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded"
        >
          Create Menu
        </button>
      </form>
    </div>
  );
};

export default CreateMenuPage;

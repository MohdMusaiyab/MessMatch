"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Menu {
  id: string;
  name: string;
  items: string[];
  pricePerHead: number;
  type: "VEG" | "NON_VEG" | "BOTH";
}

const UpdateMenuPage = () => {
  const { id } = useParams(); // Access the dynamic route parameter
  const router = useRouter(); // Use for navigation
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
          console.log(response.data.data);
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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/update-menu/${id}`,
        formData,
        { withCredentials: true }
      );

      alert("Menu updated successfully!");
      router.push("/dashboard/contractor/menu"); // Navigate back to the menu list
    } catch (error) {
      setError("Failed to update menu. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Menu</h1>
      {menu && (
        <form
          onSubmit={handleFormSubmit}
          className="space-y-4 border p-4 rounded-lg shadow-md"
        >
          <div>
            <label className="block font-semibold mb-2">Menu Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Items (comma-separated):</label>
            <input
              type="text"
              name="items"
              value={formData.items?.join(", ") || ""}
              onChange={handleItemsChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Price Per Head:</label>
            <input
              type="number"
              name="pricePerHead"
              value={formData.pricePerHead || 0}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Menu Type:</label>
            <select
              name="type"
              value={formData.type || "VEG"}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="VEG">VEG</option>
              <option value="NON_VEG">NON_VEG</option>
              <option value="BOTH">BOTH</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Menu
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateMenuPage;

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Menu {
  id: string;
  name: string;
  pricePerHead: number;
  type: string;
}

interface ShowMenuProps {
  contractorId?: string;
}

const ShowMenu: React.FC<ShowMenuProps> = ({ contractorId }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const url = contractorId
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/menus/${contractorId}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/your-menus`;

        const response = await axios.get(url, { withCredentials: true });

        if (response.data.success) {
          setMenus(response.data.data);
        } else {
          setError(response.data.message || "No menus available.");
        }
      } catch (err) {
        console.error(err);
        if (axios.isAxiosError(err)) {
          // Axios specific error handling
          setError("Network error: Unable to fetch menus. Please try again later.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [contractorId]);

  if (loading) {
    return <div>Loading your menus...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (menus.length === 0) {
    return <div>No menus found for this contractor.</div>;
  }

  return (
    <div>
      <h2>Menu List</h2>
      <ul>
        {menus.map((menu) => (
          <li key={menu.id}>
            <h3>{menu.name}</h3>
            <p>Price per head: ${menu.pricePerHead}</p>
            <p>Type: {menu.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowMenu;

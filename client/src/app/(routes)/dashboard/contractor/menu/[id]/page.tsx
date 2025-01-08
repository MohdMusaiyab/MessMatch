"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface ContractorUser {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
}

interface Contractor {
  user: ContractorUser;
}

interface MenuData {
  id: string;
  name: string;
  type: string;
  pricePerHead: number;
  createdAt: string;
  updatedAt: string;
  contractor: Contractor;
}

const Page: React.FC = () => {
  const { id } = useParams() as { id: string }; // Extract `id` from the route parameters
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      // Send a request to the backend route to fetch menu data
      axios
        .get<{ data: MenuData }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/menus/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setMenuData(response.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to fetch data");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Menu Details</h1>
      {menuData ? (
        <div>
          <h1>{menuData.name}</h1>
          <p>Type: {menuData.type}</p>
          <p>Price Per Head: {menuData.pricePerHead}</p>
          <p>Created At: {new Date(menuData.createdAt).toLocaleString()}</p>
          <p>Updated At: {new Date(menuData.updatedAt).toLocaleString()}</p>
          <h3>Contractor Details</h3>
          <Link href={`/profile/${menuData.contractor.user.id}`}>Name: {menuData.contractor.user.name}</Link>
          <p>Email: {menuData.contractor.user.email}</p>
          <p>Contact: {menuData.contractor.user.contactNumber}</p>
          <p>Address: {menuData.contractor.user.address}</p>
        </div>
      ) : (
        <div>No menu details found</div>
      )}
    </div>
  );
};

export default Page;

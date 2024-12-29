"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // For accessing URL parameters
import axios from "axios";
import Link from "next/link";

interface Menu {
  id: string;
  name: string;
  pricePerHead: number;
  type: string;
  items: string[];
}

interface Auction {
  id: string;
  title: string;
  description: string;
}

interface Contractor {
  numberOfPeople?: number;
  services?: string[];
  menus?: Menu[];
}

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  contactNumber: string;
  role: string;
  contractor?: Contractor; // Optional contractor details
  auctionsCreated?: Auction[]; // Add auctionsCreated to User interface
}

const UserProfilePage = () => {
  const router = useRouter();
  const { id } = useParams(); // Extracting ID from URL parameters
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`, // Adjust the endpoint as needed
            { withCredentials: true }
          );

          if (response.data.success) {
            setUser(response.data.data);
          } else {
            setError(
              response.data.message || "Unable to fetch user information."
            );
          }
        } catch (err) {
          console.error(err);
          setError("An error occurred while fetching user information.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading user profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!user) {
    return <div className="text-center">User not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>Contact Number:</strong> {user.contactNumber}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>

        {/* Render contractor details if applicable */}
        {user.role === "CONTRACTOR" && user.contractor && (
          <>
            <h3 className="mt-4 text-lg font-semibold">Contractor Details</h3>
            <p>
              <strong>Number of People:</strong>{" "}
              {user.contractor.numberOfPeople}
            </p>
            <p>
              <strong>Services:</strong> {user.contractor.services?.join(", ")}
            </p>

            {/* Render menus if they exist */}
            {user.contractor.menus && user.contractor.menus.length > 0 && (
              <>
                <h4 className="mt-4 text-md font-semibold">Menu List</h4>
                <ul className="list-disc list-inside">
                  {user.contractor.menus.map((menu) => (
                    <li key={menu.id}>
                      <h5 className="font-medium">{menu.name}</h5>
                      <p>Price per head: ${menu.pricePerHead}</p>
                      <p>Type: {menu.type}</p>
                      <p>Items: {menu.items.join(", ")}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}

        {/* Render auctions created by the user if they are not a contractor */}
        {user.role !== "CONTRACTOR" && user.auctionsCreated && (
          <>
            <h3 className="mt-4 text-lg font-semibold">Auctions Created</h3>
            {user.auctionsCreated.length > 0 ? (
              <ul className="list-disc list-inside">
                {user.auctionsCreated.map((auction) => (
                  <li key={auction.id}>
                    <Link
                      href={`/dashboard/institution/auction/${auction?.id}`}
                      className="font-medium"
                    >
                      {auction.title}
                    </Link>
                    <p>{auction.description}</p>
                    {/* You can add more auction details or links here */}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No auctions created by this user.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;

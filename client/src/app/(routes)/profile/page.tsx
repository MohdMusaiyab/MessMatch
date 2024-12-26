"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";

interface Menu {
  id: string;
  name: string;
  pricePerHead: number;
  type: string;
  items: string[];
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
  securityQuestion: string;
  contactNumber: string;
  role: string;
  contractor?: Contractor; // Optional contractor details
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  // Fetch user information
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/my-profile`,
            { withCredentials: true }
          );

          if (response.data.success) {
            setUser(response.data.data);
          } else {
            setErrorUser(response.data.message || "Unable to fetch user information.");
          }
        } catch (err) {
          console.error(err);
          setErrorUser("An error occurred while fetching user information.");
        } finally {
          setLoadingUser(false);
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  if (loadingUser) {
    return <div>Loading user profile...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <h2>User Information</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Contact Number:</strong> {user.contactNumber}</p>
      <p><strong>Role:</strong> {user.role}</p>

      {user.role === "CONTRACTOR" && user.contractor && (
        <>
          <h3>Contractor Details</h3>
          <p><strong>Number of People:</strong> {user.contractor.numberOfPeople}</p>
          <p><strong>Services:</strong> {user.contractor.services?.join(", ")}</p>

          <h2>Menu List</h2>
          {user.contractor.menus && user.contractor.menus.length > 0 ? (
            <ul>
              {user.contractor.menus.map((menu) => (
                <li key={menu.id}>
                  <h3>{menu.name}</h3>
                  <p>Price per head: ${menu.pricePerHead}</p>
                  <p>{menu.items.join(", ")}</p>
                  <p>Type: {menu.type}</p>
                  <Link href={`/dashboard/contractor/menu/update-menu/${menu.id}`}>
                    Update Menu
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div>No menus found for this contractor.</div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;

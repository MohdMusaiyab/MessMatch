"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Contractor {
  id: string;
  menus: {
    id: string;
    name: string;
    items: string[];
    pricePerHead: number;
    type: string;
  }[];
  numberOfPeople?: number;
  services: string[];
  ratings?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  contractor?: Contractor | null;
}

const RandomUserPage = () => {
  const params = useParams(); // Use this to access route parameters
  const id = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
          {
            credentials: "include", // Send cookies with the request
          }
        );
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch user data.");
        } else {
          setUser(data.data);
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <h1>User Details</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      {user.role === "CONTRACTOR" && user.contractor && (
        <div>
          <h2>Contractor Details</h2>
          <p>
            <strong>Number of People Served:</strong>{" "}
            {user.contractor.numberOfPeople || "N/A"}
          </p>
          <p>
            <strong>Services:</strong> {user.contractor.services.join(", ")}
          </p>
          <p>
            <strong>Ratings:</strong> {user.contractor.ratings || "Not Rated"}
          </p>

          <h3>Menus</h3>
          {user.contractor &&
          user.contractor.menus &&
          user.contractor.menus.length > 0 ? (
            user.contractor.menus.map((menu) => (
              <div key={menu.id}>
                <h4>{menu.name}</h4>
                <p>
                  <strong>Items:</strong> {menu.items.join(", ")}
                </p>
                <p>
                  <strong>Price per Head:</strong> ₹{menu.pricePerHead}
                </p>
                <p>
                  <strong>Type:</strong> {menu.type}
                </p>
              </div>
            ))
          ) : (
            <p>No menus available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RandomUserPage;

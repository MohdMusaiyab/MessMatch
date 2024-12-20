"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";

interface UserInformationProps {
  id: string;
}

const UserInformation = ({ id }: UserInformationProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
          {
            withCredentials: true, // Send cookies with the request
          }
        );

        if (!response.data.success) {
          setError(response.data.message || "Failed to fetch user data.");
        } else {
          setUser(response.data.data);
        }
      } catch (err) {
        setError("An error occurred while fetching the user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>User Information</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      {/* Render more user info as needed */}
    </div>
  );
};

export default UserInformation;

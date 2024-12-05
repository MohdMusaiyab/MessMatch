"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const Page = () => {
  const { data: session, status } = useSession();
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to the backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
          {
            withCredentials: true, // Include cookies in the request
          }
        );
        setResponse(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setResponse(error.response?.data || "Error occurred");
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  return (
    <div>
      <h1>User Session</h1>
      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
      <h2>Backend Response</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default Page;

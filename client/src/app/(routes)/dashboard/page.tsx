"use client";

import React, { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      // Show loading state while fetching session
      return;
    }

    if (status === "unauthenticated") {
      // Redirect to login if user is not authenticated
      router.push("/auth/login");
    } else if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "CONTRACTOR") {
        // Redirect to contractor dashboard if the role is CONTRACTOR
        router.push("/dashboard/contractor");
      } else {
        // Redirect to institution dashboard if the role is not CONTRACTOR
        router.push("/dashboard/institution");
      }
    }
  }, [status, session, router]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default Page;

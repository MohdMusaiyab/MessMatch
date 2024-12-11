"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ExplorePage from "@/app/components/contractor/ExplorePage";
import ExplorePageColleges from "@/app/components/colleges/ExplorePageColleges";

const Page = () => {
  const { data: session, status } = useSession();

  // Initialize the role state with the correct type
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    setRole(session?.user?.role); // Set role from session
  }, [status, session]);

  if (status === "loading" || role === undefined) {
    return <div>Loading...</div>;
  }

  if (role === "CONTRACTOR") {
    return <ExplorePage />; // Render the contractor ExplorePage component
  } else {
    return <ExplorePageColleges></ExplorePageColleges>;
  }
};

export default Page;

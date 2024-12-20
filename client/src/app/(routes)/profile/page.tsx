"use client";
import React, { useEffect, useState } from "react";
import UserInformation from "@/app/components/profile/UserInformation";
import { useSession } from "next-auth/react";

interface ProfilePageProps {
  paramsId?: string;
}

const ProfilePage = ({ paramsId }: ProfilePageProps) => {
  const { data: session } = useSession();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      setId(session.user.id);
    }
  }, [session]);

  if (!id) {
    // Optionally render a loading state until the id is available
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <UserInformation id={id} />
    </div>
  );
};

export default ProfilePage;

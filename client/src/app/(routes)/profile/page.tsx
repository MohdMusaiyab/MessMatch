"use client";
import React, { useEffect, useState } from "react";
import UserInformation from "@/app/components/profile/UserInformation";
import { useSession } from "next-auth/react";
import ShowMenu from "@/app/components/profile/ShowMenu";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [id, setId] = useState<string | null>(null);
  const [isContractor, setIsContractor] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user?.id) {
      setId(session.user.id);
      setIsContractor(session.user.role === "CONTRACTOR"); // Assuming user role is available in the session
    }
  }, [session]);

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <UserInformation id={id} />
      {isContractor && <ShowMenu contractorId={id} isOwner={true} />}
    </div>
  );
};

export default ProfilePage;

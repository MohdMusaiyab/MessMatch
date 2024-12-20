"use client";
import React from "react";
import UserInformation from "@/app/components/profile/UserInformation";

import { useParams } from "next/navigation";

interface ProfilePageProps {
  paramsId?: string;
}

const ProfilePage = ({ paramsId }: ProfilePageProps) => {
  //Get the id from the params using enxt navigation
  const { id } = useParams();

  return (
    <div>
      <h1>Profile Page</h1>
      <UserInformation id={id as string} />
    </div>
  );
};

export default ProfilePage;

"use client";
import React from "react";
import ShowMenu from "@/app/components/profile/ShowMenu";
import { useParams } from "next/navigation";
import UserInformation from "@/app/components/profile/UserInformation";

const ProfileByIdPage = () => {
  const { id } = useParams(); // Get the contractor ID from the URL

  if (!id) {
    return <div>Invalid contractor ID</div>;
  }

  return (
    <div>
      <UserInformation id={id as string} />
      <ShowMenu contractorId={id as string} />
    </div>
  );
};

export default ProfileByIdPage;

"use client";
import React from "react";
import ShowMenu from "@/app/components/profile/ShowMenu";
import { useParams } from "next/navigation";

const ProfileByIdPage = () => {
  const { id } = useParams(); // Get the contractor ID from the URL

  if (!id) {
    return <div>Invalid contractor ID</div>;
  }

  return (
    <div>
      <h1>Contractor Profile</h1>
      <ShowMenu contractorId={id as string} />
    </div>
  );
};

export default ProfileByIdPage;

"use client";
import React from "react";
import UpdateUserInformation from "@/app/components/profile/UpdateUserInformation";

import ShowMenu from "@/app/components/profile/ShowMenu";

const ProfileUpdatePage = () => {
  return (
    <div>
      <h1>Profile Update</h1>
      <UpdateUserInformation />
      <ShowMenu />
    </div>
  );
};

export default ProfileUpdatePage;

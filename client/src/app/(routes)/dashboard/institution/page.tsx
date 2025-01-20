"use client";
import React from "react";
import SideBarDashboard from "@/app/components/colleges/SideBarDashboard";

const Page = () => {
  return (
    <div style={{ display: "flex" }}>
      <SideBarDashboard />
      <div style={{ marginLeft: "20px" }}>
        Main Content
      </div>
    </div>
  );
};

export default Page;

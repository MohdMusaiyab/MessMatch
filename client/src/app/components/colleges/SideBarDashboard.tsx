import React from "react";
import Link from "next/link";
const SideBarDashboard = () => {
  return (
    <div>
      <ul>
        <Link href="/dashboard/institution/auction/">My Auctions</Link>
        <Link href="/dashboard/institution/auction/create">Create Auction</Link>
        <li>My Chats</li>
      </ul>
    </div>
  );
};

export default SideBarDashboard;

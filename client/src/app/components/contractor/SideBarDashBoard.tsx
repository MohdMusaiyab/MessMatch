import React from "react";
import Link from "next/link";
const SideBarDashBoard = () => {
  return (
    <div>
      SideBarDashBoard
      <ul>
        <Link href="/dashboard/contractor/menu">My Menu</Link>
        <Link href="/chats">My Chats</Link>
        {/* For The Page for My Auctions */}
        <Link href="/dashboard/contractor/my-auctions">My Auctions</Link>
      </ul>
    </div>
  );
};

export default SideBarDashBoard;

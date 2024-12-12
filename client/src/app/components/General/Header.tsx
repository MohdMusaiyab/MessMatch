"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center px-4 py-2 shadow-md bg-white">
      <div className="text-xl font-bold">Your App</div>

      {session ? (
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition">
            <span>{session.user?.name}</span>
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
            <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition">Profile</Link>
            <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition">Dashboard</Link>
            <Link href="/explore" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition">Explore</Link>
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <Link href="/auth/login">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            Login
          </button>
        </Link>
      )}
    </header>
  );
};

export default Header;

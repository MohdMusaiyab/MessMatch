"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

interface Menu {
  id: string;
  name: string;
  pricePerHead: number;
  type: string;
  items: string[];
}

interface Auction {
  id: string;
  title: string;
  description: string;
  bids: any[];
}

interface Contractor {
  numberOfPeople?: number;
  services?: string[];
  menus?: Menu[];
}

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  securityQuestion: string;
  contactNumber: string;
  role: string;
  contractor?: Contractor;
  auctionsCreated?: Auction[];
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/my-profile`,
            { withCredentials: true }
          );

          if (response.data.success) {
            setUser(response.data.data);
          } else {
            setErrorUser(response.data.message || "Unable to fetch user information.");
          }
        } catch (err) {
          console.error(err);
          setErrorUser("An error occurred while fetching user information.");
        } finally {
          setLoadingUser(false);
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-yellow-500 text-xl font-medium"
        >
          Loading user profile...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-neutral-300 text-xl">User not found.</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-6 md:p-12"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"
        >
          Profile
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-md bg-neutral-900/50 rounded-xl p-6 border border-yellow-900/20 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-neutral-300 mb-6">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Name" value={user.name} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Address" value={user.address} />
            <InfoItem label="Contact" value={user.contactNumber} />
            <InfoItem label="Role" value={user.role} />
          </div>
          <Link
            href="/profile/update"
            className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-100 rounded-lg font-medium transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg"
          >
            Update Profile
          </Link>
        </motion.div>

        {user.role === "CONTRACTOR" && user.contractor && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-md bg-neutral-900/50 rounded-xl p-6 border border-yellow-900/20 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-semibold text-neutral-300 mb-6">Contractor Details</h2>
            <InfoItem label="Team Size" value={user.contractor.numberOfPeople?.toString()} />
            <InfoItem label="Services" value={user.contractor.services?.join(", ")} />

            <h3 className="text-xl font-semibold text-neutral-300 mt-8 mb-6">Menu List</h3>
            {user.contractor.menus && user.contractor.menus.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.contractor.menus.map((menu) => (
                  <motion.div
                    key={menu.id}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-sm bg-neutral-900/30 rounded-lg p-4 border border-yellow-900/20"
                  >
                    <h4 className="text-lg font-medium text-yellow-500 mb-2">{menu.name}</h4>
                    <p className="text-neutral-300 mb-2">
                      Price per head: <span className="text-yellow-500">${menu.pricePerHead}</span>
                    </p>
                    <p className="text-neutral-400 mb-2 line-clamp-2">{menu.items.join(", ")}</p>
                    <p className="text-neutral-400 mb-4">Type: {menu.type}</p>
                    <Link
                      href={`/dashboard/contractor/menu/update-menu/${menu.id}`}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
                    >
                      Update Menu →
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-400">No menus found for this contractor.</div>
            )}
          </motion.div>
        )}

        {user.role !== "CONTRACTOR" && user.auctionsCreated && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-md bg-neutral-900/50 rounded-xl p-6 border border-yellow-900/20 shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-neutral-300 mb-6">Auctions Created</h2>
            {user.auctionsCreated.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.auctionsCreated.map((auction) => (
                  <motion.div
                    key={auction.id}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-sm bg-neutral-900/30 rounded-lg p-4 border border-yellow-900/20"
                  >
                    <Link
                      href={`/dashboard/institution/auction/update/${auction.id}`}
                      className="text-lg font-medium text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
                    >
                      {auction.title}
                    </Link>
                    <p className="text-neutral-400 mt-2 mb-4 line-clamp-2">{auction.description}</p>
                    <Link
                      href={`/auctions/${auction.id}`}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
                    >
                      View Auction →
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-400">No auctions created by this user.</div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string | undefined }) => (
  <div>
    <span className="text-neutral-400 block mb-1">{label}</span>
    <div className="inline-block bg-neutral-900/50 backdrop-blur p-4 rounded-lg border border-yellow-900/20 shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
      <span className="text-neutral-300">{value}</span>
    </div>
  </div>
);


export default ProfilePage;
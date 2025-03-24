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
  state: string;
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
            setErrorUser(
              response.data.message || "Unable to fetch user information."
            );
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
  if (errorUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-red-500 text-xl">{errorUser}</div>
      </div>
    );
  }
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
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"
        >
          Your Profile
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-md bg-neutral-900/50 rounded-xl p-6 border border-yellow-900/20 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-neutral-300 mb-6">
            Your Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-1">
              <InfoItem label="Name" value={user.name} />
            </div>
            <div className="col-span-1">
              <InfoItem label="Email" value={user.email} />
            </div>
            <div className="col-span-1">
              <InfoItem label="Contact" value={user.contactNumber} />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <InfoItem label="Address" value={user.address} />
            </div>
            <div className="col-span-1">
              <InfoItem label="Role" value={user.role} />
            </div>
            <div className="col-span-1">
              <InfoItem label="State" value={user.state} />
            </div>
          </div>
          <Link
            href="/profile/update"
            className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-100 rounded-lg font-medium transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg"
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
            <h2 className="text-2xl font-semibold text-neutral-300 mb-6">
              Other Details
            </h2>
            <InfoItem
              label="Team Size"
              value={user.contractor.numberOfPeople?.toString()}
            />
            <InfoItem
              label="Services"
              value={user.contractor.services?.join(", ")}
            />

            <h3 className="text-xl font-semibold text-neutral-300 mt-8 mb-6">
              Menu List
            </h3>
            {user.contractor.menus && user.contractor.menus.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.contractor.menus.map((menu) => (
                  <motion.div
                    key={menu.id}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-sm bg-neutral-900/30 rounded-lg p-4 border border-yellow-900/20"
                  >
                    <h4 className="text-lg font-medium text-yellow-500 mb-2">
                      {menu.name}
                    </h4>
                    <p className="text-neutral-300 mb-2">
                      Price per head:{" "}
                      <span className="text-yellow-500">
                        ${menu.pricePerHead}
                      </span>
                    </p>
                    <p className="text-neutral-400 mb-2 line-clamp-2">
                      {menu.items.join(", ")}
                    </p>
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
              <div className="text-neutral-400">No menus found for You.</div>
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
            <h2 className="text-2xl font-semibold text-neutral-300 mb-6">
              Auctions Created
            </h2>
            {user.auctionsCreated.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.auctionsCreated.map((auction) => (
                  <motion.div
                    key={auction.id}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-sm bg-neutral-900/30 rounded-lg p-4 border border-yellow-900/20"
                  >
                    <h1 className="text-lg font-medium text-yellow-500 hover:text-yellow-400 transition-colors duration-300">
                      {auction.title}
                    </h1>
                    <p className="text-neutral-400 mt-2 mb-4 line-clamp-2">
                      {auction.description}
                    </p>
                    <Link
                      href={`dashboard/institution/auction/update/${auction.id}`}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
                    >
                      View Auction →
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-400">
                No auctions created by You.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="bg-neutral-900/30 backdrop-blur-sm rounded-lg p-4 border border-yellow-900/20 h-full">
    <span className="text-neutral-400 text-sm block mb-1">{label}</span>
    <span className="text-neutral-300 break-words">{value}</span>
  </div>
);

export default ProfilePage;

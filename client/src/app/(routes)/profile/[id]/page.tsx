"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  contactNumber: string;
  role: string;
  contractor?: Contractor;
  auctionsCreated?: Auction[];
}

const UserProfilePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
            { withCredentials: true }
          );

          if (response.data.success) {
            setUser(response.data.data);
          } else {
            setError(
              response.data.message || "Unable to fetch user information."
            );
          }
        } catch (err) {
          console.error(err);
          setError("An error occurred while fetching user information.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [id]);

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 bg-red-900/20 px-6 py-4 rounded-lg border border-red-500/20"
        >
          {error}
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
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"
        >
          {user.name}&apos;s Profile
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-md bg-neutral-900/30 rounded-xl p-6 border border-yellow-900/20 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoItem label="Name" value={user.name} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Address" value={user.address} />
            <InfoItem label="Contact" value={user.contactNumber} />
            <InfoItem label="Role" value={user.role} />
          </div>

          {user.role === "CONTRACTOR" && user.contractor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 pt-8 border-t border-yellow-900/20"
            >
              <h3 className="text-2xl font-semibold mb-6 text-yellow-500">
                Contractor Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <InfoItem
                  label="Team Size"
                  value={user.contractor.numberOfPeople?.toString()}
                />
                <InfoItem
                  label="Services"
                  value={user.contractor.services?.join(", ")}
                />
              </div>

              {user.contractor.menus && user.contractor.menus.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-semibold mb-6 text-neutral-300">
                    Menu List
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.contractor.menus.map((menu) => (
                      <motion.div
                        key={menu.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-neutral-900/30 rounded-lg p-4 border border-yellow-900/20 hover:shadow-lg transition-shadow"
                      >
                        <Link href={`/dashboard/contractor/menu/${menu.id}`}>
                          <h5 className="text-lg font-medium text-yellow-500 mb-2">
                            {menu.name}
                          </h5>
                          <p className="text-neutral-300 mb-2">
                            Price per head:{" "}
                            <span className="text-yellow-500">
                              ${menu.pricePerHead}
                            </span>
                          </p>
                          <p className="text-neutral-400 mb-2">
                            Type: {menu.type}
                          </p>
                          <p className="text-neutral-400 line-clamp-2">
                            Items: {menu.items.join(", ")}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {user.role !== "CONTRACTOR" && user.auctionsCreated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 pt-8 border-t border-yellow-900/20"
            >
              <h3 className="text-2xl font-semibold mb-6 text-yellow-500">
                Auctions Created
              </h3>
              {user.auctionsCreated.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.auctionsCreated.map((auction) => (
                    <motion.div
                      key={auction.id}
                      whileHover={{ scale: 1.02 }}
                      className="backdrop-blur-sm bg-neutral-900/30 rounded-lg p-4 border border-yellow-900/20"
                    >
                      <Link
                        href={`/dashboard/institution/auction/${auction.id}`}
                        className="text-lg font-medium text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
                      >
                        {auction.title}
                      </Link>
                      <p className="text-neutral-400 mt-2 line-clamp-2">
                        {auction.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-400">
                  No auctions created by this user.
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
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
  <div>
    <span className="text-neutral-400 block mb-1">{label}</span>
    <span className="text-neutral-300">{value}</span>
  </div>
);

export default UserProfilePage;

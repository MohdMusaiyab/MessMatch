"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Phone, MapPin, Calendar, Tag, DollarSign } from "lucide-react";

interface ContractorUser {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
}

interface Contractor {
  user: ContractorUser;
}

interface MenuData {
  id: string;
  name: string;
  type: string;
  pricePerHead: number;
  createdAt: string;
  updatedAt: string;
  contractor: Contractor;
}

const Page: React.FC = () => {
  const { id } = useParams() as { id: string };
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      axios
        .get<{ data: MenuData }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/menus/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setMenuData(response.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to fetch data");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4">
        <div className="max-w-4xl mx-auto text-red-400 text-center mt-12">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"
        >
          Menu Details
        </motion.h1>

        {menuData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-neutral-900/50 backdrop-blur border border-yellow-900/20 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-neutral-100 mb-6">{menuData.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-yellow-500" />
                  <span className="text-neutral-300">Type: {menuData.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                  <span className="text-neutral-300">Price Per Head: ${menuData.pricePerHead}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <span className="text-neutral-300">
                    Created: {new Date(menuData.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <span className="text-neutral-300">
                    Updated: {new Date(menuData.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/50 backdrop-blur border border-yellow-900/20 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-neutral-100 mb-6">Contractor Details</h3>
              <div className="space-y-4">
                <Link 
                  href={`/profile/${menuData.contractor.user.id}`}
                  className="flex items-center gap-3 text-neutral-300 hover:text-yellow-500 transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                  <span>{menuData.contractor.user.name}</span>
                </Link>
                <div className="flex items-center gap-3 text-neutral-300">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  <span>{menuData.contractor.user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-300">
                  <Phone className="w-5 h-5 text-yellow-500" />
                  <span>{menuData.contractor.user.contactNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-300">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                  <span>{menuData.contractor.user.address}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neutral-300 text-center mt-12"
          >
            No menu details found
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Page;
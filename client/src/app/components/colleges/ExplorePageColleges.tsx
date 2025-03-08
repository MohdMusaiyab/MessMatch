"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { State } from "@/app/types/States";
import Link from "next/link";

enum ServiceType {
  HOSTELS = "HOSTELS",
  CORPORATE_EVENTS = "CORPORATE_EVENTS",
  CORPORATE_OFFICES = "CORPORATE_OFFICES",
  WEDDINGS = "WEDDINGS",
  PARTIES = "PARTIES",
  OTHER = "OTHER",
}

interface Menu {
  id: string;
  name: string;
  items: string[];
  pricePerHead: number;
  type: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  state: string; // Add state to the User interface
}

interface Contractor {
  id: string;
  user: User;
  menus: Menu[];
}

const ContractorsPage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [menuType, setMenuType] = useState<string>("");
  const [state, setState] = useState<string>(""); // Add state filter
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);

  const fetchContractors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/filters`,
        {
          params: {
            page,
            limit,
            search,
            serviceType: serviceTypes.length > 0 ? serviceTypes : undefined,
            menuType,
            state, // Include state in the query parameters
            sortBy,
            sortOrder,
          },
          withCredentials: true,
        }
      );

      if (response.data.data.length === 0) {
        setError("No contractors found.");
      }

      setContractors(response.data.data);
      setTotal(response.data.pagination.total);
    } catch (err) {
      console.error("Error fetching contractors:", err);
      setError("Failed to fetch contractors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, [page, serviceTypes, menuType, state, sortBy, sortOrder]);

  const handleServiceTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setServiceTypes((prev) =>
      prev.includes(value)
        ? prev.filter((type) => type !== value)
        : [...prev, value]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContractors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="flex flex-col lg:flex-row">
        {/* Filters Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`lg:w-1/4 p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 border-r border-yellow-900/20
                     ${isFilterOpen ? "block" : "hidden lg:block"}`}
        >
          <div className="sticky top-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-6">
              Filters
            </h2>

            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/50"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search contractors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-yellow-900/20 rounded-lg
                           text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40
                           transition-all duration-300"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700
                         text-white font-medium rounded-lg hover:shadow-lg hover:shadow-yellow-600/20
                         transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Filter size={20} />
                Apply Filters
              </motion.button>
            </form>

            <div className="space-y-6">
              {/* Service Type Filter */}
              <div>
                <h3 className="text-neutral-300 font-semibold mb-3">
                  Service Type
                </h3>
                <div className="space-y-2">
                  {Object.values(ServiceType).map((service) => (
                    <div key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        id={service}
                        value={service}
                        checked={serviceTypes.includes(service)}
                        onChange={handleServiceTypeChange}
                        className="w-4 h-4 rounded border-yellow-900/20 text-yellow-600 
                                 focus:ring-yellow-500/20 bg-neutral-900"
                      />
                      <label
                        htmlFor={service}
                        className="ml-3 text-sm text-neutral-400"
                      >
                        {service.replace(/_/g, " ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu Type Filter */}
              <div>
                <h3 className="text-neutral-300 font-semibold mb-3">
                  Menu Type
                </h3>
                <select
                  value={menuType}
                  onChange={(e) => setMenuType(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-yellow-900/20 rounded-lg
                           text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40
                           transition-all duration-300"
                >
                  <option value="">All Types</option>
                  <option value="VEG">Vegetarian</option>
                  <option value="NON_VEG">Non-Vegetarian</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>

              {/* State Filter */}
              {/* State Filter */}
              <div>
                <h3 className="text-neutral-300 font-semibold mb-3">State</h3>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-yellow-900/20 rounded-lg
             text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40
             transition-all duration-300"
                >
                  <option value="">All States</option>
                  {Object.entries(State).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Filter */}
              <div>
                <h3 className="text-neutral-300 font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-yellow-900/20 rounded-lg
                           text-neutral-300 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40
                           transition-all duration-300"
                >
                  <option value="">Default</option>
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-grow p-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent mb-8"
          >
            Premium Contractors
          </motion.h1>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-full"
              />
            </div>
          ) : error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center py-12"
            >
              {error}
            </motion.p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {contractors.map((contractor, index) => (
                  <motion.div
                    key={contractor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 
                             border border-yellow-900/20 rounded-lg shadow-xl 
                             hover:shadow-2xl hover:shadow-yellow-900/10 
                             transition-all duration-300"
                  >
                    <Link
                      href={`/profile/${contractor.user.id}`}
                      className="text-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-200 
                                 bg-clip-text text-transparent"
                    >
                      {contractor.user.name}
                    </Link>
                    <div className="mt-4 space-y-2 text-neutral-400">
                      <p>Email: {contractor.user.email}</p>
                      <p>Contact: {contractor.user.contactNumber}</p>
                      <p>Address: {contractor.user.address}</p>
                      <p>State: {contractor.user.state}</p>{" "}
                      {/* Display state */}
                    </div>

                    {contractor.menus.length > 0 ? (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-neutral-300 mb-4">
                          Available Menus
                        </h3>
                        <div className="grid gap-4">
                          {contractor.menus.map((menu) => (
                            <div
                              key={menu.id}
                              className="p-4 bg-neutral-900/50 border border-yellow-900/10 rounded-lg"
                            >
                              <Link
                                href={`/dashboard/contractor/menu/${menu.id}`}
                                className="font-bold text-yellow-500 mb-2"
                              >
                                {menu.name}
                              </Link>
                              <p className="text-neutral-400">
                                Items: {menu.items.join(", ")}
                              </p>
                              <p className="text-neutral-300 mt-2">
                                Price per Head:
                                <span className="text-yellow-500 font-semibold ml-2">
                                  ₹{menu.pricePerHead.toLocaleString()}
                                </span>
                              </p>
                              <p className="text-neutral-400">
                                Type: {menu.type}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-neutral-500">
                        No menus available.
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-6 py-2 flex items-center gap-2 bg-neutral-800 text-neutral-300 
                           rounded-lg hover:bg-neutral-700 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  Previous
                </motion.button>
                <span className="text-neutral-400">
                  Page {page} of {Math.ceil(total / limit)}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, Math.ceil(total / limit))
                    )
                  }
                  disabled={page === Math.ceil(total / limit)}
                  className="px-6 py-2 flex items-center gap-2 bg-neutral-800 text-neutral-300 
                           rounded-lg hover:bg-neutral-700 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContractorsPage;

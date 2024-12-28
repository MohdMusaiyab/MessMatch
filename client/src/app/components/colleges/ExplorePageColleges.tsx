"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// Define ServiceType enum
enum ServiceType {
  HOSTELS = "HOSTELS",
  CORPORATE_EVENTS = "CORPORATE_EVENTS",
  CORPORATE_OFFICES = "CORPORATE_OFFICES",
  WEDDINGS = "WEDDINGS",
  PARTIES = "PARTIES",
  OTHER = "OTHER",
}

// Define types for contractor and menu
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
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContractors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contractor/filters`, {
        params: {
          page,
          limit,
          search,
          serviceType: serviceTypes.length > 0 ? serviceTypes : undefined,
          menuType,
          sortBy,
          sortOrder,
        },
        withCredentials: true,
      });

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
  }, [page, serviceTypes, menuType, sortBy, sortOrder]);

  const handleServiceTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setServiceTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContractors();
  };

  return (
    <div className="flex">
      <aside className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-lg font-bold">Filters</h2>

        <form onSubmit={handleSearchSubmit} className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
            Search
          </button>
        </form>

        <h3 className="font-semibold">Service Type</h3>
        <div className="mb-4">
          {Object.values(ServiceType).map((service) => (
            <div key={service} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={service}
                value={service}
                checked={serviceTypes.includes(service)}
                onChange={handleServiceTypeChange}
                className="mr-2"
              />
              <label htmlFor={service} className="text-sm">
                {service}
              </label>
            </div>
          ))}
        </div>

        <h3 className="font-semibold">Menu Type</h3>
        <select
          value={menuType}
          onChange={(e) => setMenuType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="">Select Menu Type</option>
          <option value="VEG">Vegetarian</option>
          <option value="NON_VEG">Non-Vegetarian</option>
          <option value="BOTH">Both</option>
        </select>

        <h3 className="font-semibold">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="">Default</option>
          <option value="rating">Rating</option>
          <option value="price">Price</option>
        </select>
      </aside>

      <main className="flex-grow p-4">
        <h1 className="text-xl font-bold mb-4">Contractors</h1>

        {loading ? (
          <p>Loading contractors...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {contractors.map((contractor) => (
                <div key={contractor.id} className="p-4 border rounded-lg shadow">
                  <h2 className="text-lg font-semibold">{contractor.user.name}</h2>
                  <p>Email: {contractor.user.email}</p>
                  <p>Contact: {contractor.user.contactNumber}</p>
                  <p>Address: {contractor.user.address}</p>

                  {contractor.menus.length > 0 ? (
                    <>
                      <h3 className="font-semibold mt-4">Menus:</h3>
                      {contractor.menus.map((menu) => (
                        <div key={menu.id} className="mt-2 p-2 border rounded bg-gray-50">
                          <h4 className="font-bold">{menu.name}</h4>
                          <p>Items: {menu.items.join(", ")}</p>
                          <p>Price per Head: ₹{menu.pricePerHead}</p>
                          <p>Type: {menu.type}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>No menus available.</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(total / limit)))}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ContractorsPage;

"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const ContractorsPage = () => {
  const [contractors, setContractors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [menuType, setMenuType] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchContractors = async () => {
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
      setContractors(response.data.data);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching contractors:', error);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, [page, search, serviceTypes, menuType, sortBy, sortOrder]);

  // Handle multi-select for Service Types
  const handleServiceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map((option) => option.value);
    setServiceTypes(selectedOptions);
    console.log("Selected service types:", selectedOptions);  // Debugging: log the selected service types
  };

  return (
    <div className="flex">
      <aside className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-lg font-bold">Filters</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        
        <h3 className="font-semibold">Service Type</h3>
        <select
          multiple
          value={serviceTypes}
          onChange={handleServiceTypeChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="HOSTELS">Hostels</option>
          <option value="CORPORATE_EVENTS">Corporate Events</option>
          <option value="CORPORATE_OFFICES">Corporate Offices</option>
          <option value="WEDDINGS">Weddings</option>
          <option value="PARTIES">Parties</option>
          <option value="OTHER">Other</option>
        </select>
        
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
        <div className="grid grid-cols-1 gap-4">
          {contractors.map((contractor) => (
            <div key={contractor.id} className="p-4 border rounded-lg shadow">
              <h2 className="text-lg font-semibold">{contractor.user.name}</h2>
              <p>Email: {contractor.user.email}</p>
              <p>Contact: {contractor.user.contactNumber}</p>
              <p>Address: {contractor.user.address}</p>

              {/* Render Menus */}
              {contractor.menus.length > 0 ? (
                <>
                  <h3 className="font-semibold mt-4">Menus:</h3>
                  {contractor.menus.map((menu) => (
                    <div key={menu.id} className="mt-2 p-2 border rounded bg-gray-50">
                      <h4 className="font-bold">{menu.name}</h4>
                      <p>Items: {menu.items.join(', ')}</p>
                      <p>Price per Head: ₹{menu.pricePerHead}</p>
                      <p>Type: {menu.type}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p>No menus available.</p>
              )}

              {/* Add more contractor details as needed */}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page} of {Math.ceil(total / limit)}</span>
          <button onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(total / limit)))}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default ContractorsPage;

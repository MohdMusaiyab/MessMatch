"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { securityQuestions } from "@/app/types/securtyQuestions";

interface ContractorFields {
  numberOfPeople?: number;
  services?: string[];
}

const UpdateUserInformation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contactNumber: "",
    securityQuestion: securityQuestions.MOTHERS_MAIDEN_NAME,
    securityAnswer: "",
    password: "",
    contractorFields: {
      numberOfPeople: undefined,
      services: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContractor, setIsContractor] = useState(false); // Determine if the user is a contractor

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/my-profile`,
          { withCredentials: true }
        );
        const user = response.data.data;

        // Set form data based on fetched user data
        setFormData({
          name: user?.name ?? "",
          email: user?.email ?? "",
          address: user?.address ?? "",
          contactNumber: user?.contactNumber ?? "",
          securityQuestion:
            user?.securityQuestion ?? securityQuestions.MOTHERS_MAIDEN_NAME,
          securityAnswer: user?.securityAnswer ?? "",
          password: "", // No password shown, empty for updating
          contractorFields: {
            numberOfPeople: user.contractor?.numberOfPeople,
            services: user.contractor?.services ?? [],
          },
        });

        // Check if the user is a contractor
        setIsContractor(user.role === "CONTRACTOR");
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("contractorFields.")) {
      const fieldName = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        contractorFields: {
          ...prevData.contractorFields,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("User information updated successfully!");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating user information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update Your Information</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="contactNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Number
          </label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="securityQuestion"
            className="block text-sm font-medium text-gray-700"
          >
            Security Question
          </label>
          <select
            id="securityQuestion"
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2"
          >
            {Object.entries(securityQuestions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="securityAnswer"
            className="block text-sm font-medium text-gray-700"
          >
            Security Answer
          </label>
          <input
            type="text"
            id="securityAnswer"
            name="securityAnswer"
            value={formData.securityAnswer}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2"
          />
        </div>

        {/* Contractor-specific fields */}
        {isContractor && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-2">
              Contractor Details
            </h3>

            <div className="mb-4">
              <label
                htmlFor="contractorFields.numberOfPeople"
                className="block text-sm font-medium text-gray-700"
              >
                Number of People
              </label>
              <input
                type="number"
                id="contractorFields.numberOfPeople"
                name="contractorFields.numberOfPeople"
                value={formData.contractorFields.numberOfPeople || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2"
              />
            </div>

            {/* Services can be an array of strings; you might want to implement a multi-select or similar */}
            <div className="mb-4">
              <label
                htmlFor="contractorFields.services"
                className="block text-sm font-medium text-gray-700"
              >
                Services (comma separated)
              </label>
              <input
                type="text"
                id="contractorFields.services"
                name="contractorFields.services"
                value={formData.contractorFields.services.join(", ")}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "contractorFields.services",
                      value: e.target.value.split(",").map((s) => s.trim()), // Convert comma-separated string to array
                    },
                  })
                }
                placeholder="e.g., Catering, Cleaning"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2"
              />
            </div>
          </>
        )}

        {/* Password field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password (optional)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 p-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Information"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUserInformation;

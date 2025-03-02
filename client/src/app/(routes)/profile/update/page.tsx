"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { securityQuestions } from "@/app/types/securtyQuestions";
import { State } from "@/app/types/States";

enum ServiceType {
  HOSTELS = "HOSTELS",
  CORPORATE_EVENTS = "CORPORATE_EVENTS",
  CORPORATE_OFFICES = "CORPORATE_OFFICES",
  WEDDINGS = "WEDDINGS",
  PARTIES = "PARTIES",
  OTHER = "OTHER",
}

interface ContractorFields {
  numberOfPeople?: number;
  services?: string[];
}

const UpdateUserInformation: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    state: "",
    contactNumber: "",
    securityQuestion: securityQuestions.MOTHERS_MAIDEN_NAME,
    securityAnswer: "",
    password: "",
    contractorFields: {
      numberOfPeople: undefined,
      services: [] as string[],
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContractor, setIsContractor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/my-profile`,
          { withCredentials: true }
        );
        const user = response.data.data;

        // Merge fetched user data with existing formData
        setFormData((prevFormData) => ({
          ...prevFormData, // Keep existing form data
          name: user?.name ?? "", // Update name
          email: user?.email ?? "", // Update email
          address: user?.address ?? "", // Update address
          state: user?.state ?? "", // Update state
          contactNumber: user?.contactNumber ?? "", // Update contact number
          securityQuestion:
            user?.securityQuestion ?? securityQuestions.MOTHERS_MAIDEN_NAME, // Update security question
          securityAnswer: user?.securityAnswer ?? "", // Update security answer
          password: "", // Reset password field (optional)
          contractorFields: {
            numberOfPeople: user.contractor?.numberOfPeople ?? undefined, // Update number of people
            services: user.contractor?.services ?? [], // Update services
          },
        }));

        // Set contractor role
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

  const handleServiceChange = (serviceType: string) => {
    setFormData((prevData) => {
      const services = prevData.contractorFields.services.includes(serviceType)
        ? prevData.contractorFields.services.filter(
            (service) => service !== serviceType
          )
        : [...prevData.contractorFields.services, serviceType];
      return {
        ...prevData,
        contractorFields: {
          ...prevData.contractorFields,
          services,
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`,
        formData, // This includes the state key (e.g., "ANDHRA_PRADESH")
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("User information updated successfully!");
        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating user information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "mt-1 block w-full bg-neutral-900/50 border border-yellow-900/20 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-600/40 p-3 text-neutral-300 placeholder-neutral-500 transition-all duration-300";
  const labelClasses = "block text-sm font-medium text-neutral-300 mb-1";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4 sm:px-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl mx-auto backdrop-blur-md bg-neutral-900/30 p-8 rounded-xl border border-yellow-900/20 shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
          Update Your Information
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className={labelClasses}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="address" className={labelClasses}>
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="state" className={labelClasses}>
              State
            </label>
            <select
              id="state"
              name="state"
              required
              className={inputClasses}
              value={formData.state} // This should store the key (e.g., "ANDHRA_PRADESH")
              onChange={handleChange}
            >
              <option value="">Select a state</option>
              {Object.entries(State).map(([key, value]) => (
                <option key={key} value={key}>
                  {" "}
                  {/* Store the key */}
                  {value} {/* Display the value */}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contactNumber" className={labelClasses}>
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="securityQuestion" className={labelClasses}>
              Security Question
            </label>
            <select
              id="securityQuestion"
              name="securityQuestion"
              value={formData.securityQuestion}
              onChange={handleChange}
              className={inputClasses}
            >
              {Object.entries(securityQuestions).map(([key, label]) => (
                <option key={key} value={key} className="bg-neutral-900">
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="securityAnswer" className={labelClasses}>
              Security Answer
            </label>
            <input
              type="text"
              id="securityAnswer"
              name="securityAnswer"
              value={formData.securityAnswer}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClasses}>
              New Password (optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {isContractor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-6 border-t border-yellow-900/20"
            >
              <h3 className="text-xl font-semibold mb-6 text-yellow-500">
                Contractor Details
              </h3>

              <div className="mb-6">
                <label
                  htmlFor="contractorFields.numberOfPeople"
                  className={labelClasses}
                >
                  Number of People
                </label>
                <input
                  type="number"
                  id="contractorFields.numberOfPeople"
                  name="contractorFields.numberOfPeople"
                  value={formData.contractorFields.numberOfPeople || ""}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div>
                <h4 className="text-lg font-medium text-neutral-300 mb-4">
                  Services
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.values(ServiceType).map((service) => (
                    <motion.div
                      key={service}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        id={service}
                        value={service}
                        checked={formData.contractorFields.services.includes(
                          service
                        )}
                        onChange={() => handleServiceChange(service)}
                        className="w-4 h-4 rounded border-yellow-900/20 text-yellow-600 focus:ring-yellow-500/20 bg-neutral-900/50"
                      />
                      <label
                        htmlFor={service}
                        className="ml-3 text-sm text-neutral-300"
                      >
                        {service.replace(/_/g, " ")}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 bg-gradient-to-r from-yellow-600 to-yellow-700 text-neutral-100 font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Information"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateUserInformation;

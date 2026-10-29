"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { securityQuestions } from "@/app/types/securtyQuestions";
import { State } from "@/app/types/States";
import { useToast } from "@/context/ToastContext";
import { isDemoAccount } from "@/lib/demo";

enum ServiceType {
  HOSTELS = "HOSTELS",
  CORPORATE_EVENTS = "CORPORATE_EVENTS",
  CORPORATE_OFFICES = "CORPORATE_OFFICES",
  WEDDINGS = "WEDDINGS",
  PARTIES = "PARTIES",
  OTHER = "OTHER",
}

const UpdateUserInformation: React.FC = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

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
      numberOfPeople: undefined as number | undefined,
      services: [] as string[],
    },
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContractor, setIsContractor] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/my-profile`,
          { withCredentials: true }
        );
        const user = response.data.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          name: user?.name ?? "",
          email: user?.email ?? "",
          address: user?.address ?? "",
          state: user?.state ?? "",
          contactNumber: user?.contactNumber ?? "",
          securityQuestion:
            user?.securityQuestion ?? securityQuestions.MOTHERS_MAIDEN_NAME,
          securityAnswer: user?.securityAnswer ?? "",
          password: "",
          contractorFields: {
            numberOfPeople: user.contractor?.numberOfPeople ?? undefined,
            services: user.contractor?.services ?? [],
          },
        }));

        setIsContractor(user.role === "CONTRACTOR");
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const isDemo = Boolean(session?.user?.isDemo || isDemoAccount(formData.email));

  if (!initialLoading && isDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-neutral-900/80 border border-yellow-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Demo Account Locked</h2>
          <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
            Profile editing, email modification, and password resets are disabled on demonstration accounts to preserve shared credentials for all reviewers.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-neutral-950 font-bold rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Profile</span>
          </Link>
        </motion.div>
      </div>
    );
  }

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
    if (isDemo) {
      toast.error("Demo account profiles are protected and cannot be modified.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("User information updated successfully!");
        router.push("/profile");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error updating user information. Please try again.";
      toast.error(msg);
      setError(msg);
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
            Update Your Information
          </h2>
          <Link
            href="/profile"
            className="text-xs text-neutral-400 hover:text-yellow-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm"
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
              required
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
              required
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
              required
            />
          </div>

          <div>
            <label htmlFor="state" className={labelClasses}>
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={inputClasses}
              required
            >
              <option value="">Select a State</option>
              {Object.entries(State).map(([key, value]) => (
                <option key={key} value={value} className="bg-neutral-900">
                  {value.replace(/_/g, " ")}
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
              required
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
              required
            >
              {Object.entries(securityQuestions).map(([key, value]) => (
                <option key={key} value={value} className="bg-neutral-900">
                  {value.replace(/_/g, " ")}
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
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClasses}>
              New Password (Optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Leave blank to keep current password"
            />
          </div>

          {isContractor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-yellow-900/20 pt-6 mt-6"
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full py-3.5 px-4 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-neutral-950 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:from-yellow-400 hover:to-yellow-600"
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

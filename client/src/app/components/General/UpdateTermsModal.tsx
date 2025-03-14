import { useState } from "react";
import axios from "axios";

export const UpdateTermsModal = ({
  contractId,
  currentTerms,
  onClose,
  onUpdate,
}: {
  contractId: string;
  currentTerms: string;
  onClose: () => void;
  onUpdate: (newTerms: string) => void;
}) => {
  const [terms, setTerms] = useState(currentTerms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contract/update-terms/${contractId}`,
        { terms },
        { withCredentials: true }
      );

      if (response.data.success) {
        onUpdate(terms); // Update the UI with new terms
        onClose(); // Close the modal
      } else {
        setError(response.data.message || "Failed to update terms.");
      }
    } catch (error) {
      console.error("Error updating terms:", error);
      setError("Failed to update terms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-neutral-900/50 backdrop-blur-lg rounded-xl border border-yellow-900/20 p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-yellow-500">Update Terms</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="terms"
              className="block text-yellow-500 text-sm font-medium mb-2"
            >
              New Terms
            </label>
            <textarea
              id="terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full p-3 bg-neutral-950/50 border border-yellow-900/20 rounded-lg text-neutral-300 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
              rows={6}
              placeholder="Enter new terms..."
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Terms"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

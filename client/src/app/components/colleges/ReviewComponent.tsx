import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Star, Edit, X, AlertCircle, CheckCircle, Trash } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    email: string;
  };
}

const ReviewComponent = ({ profileId }: { profileId: string }) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isFetchingReviews, setIsFetchingReviews] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check if the current user has already left a review
  const hasUserReviewed = reviews.some(
    (review) => review.reviewer?.id === session?.user?.id
  );

  // Fetch all reviews for the contractor
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/get-reviews/${profileId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setError("Failed to fetch reviews. Please try again.");
    } finally {
      setIsFetchingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [profileId]);

  // Auto-dismiss error and success messages after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  // Handle clicking outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowAddReviewModal(false);
        setEditingReviewId(null);
        setRating(0);
        setComment("");
      }
    };

    if (showAddReviewModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddReviewModal]);

  // Handle adding or updating a review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const url = editingReviewId
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/update-review/${editingReviewId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/add-review/${profileId}`;

      const method = editingReviewId ? "put" : "post";

      const response = await axios[method](
        url,
        { rating, comment },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccessMessage(
          response.data.message || "Review submitted successfully"
        );
        await fetchReviews(); // Refetch reviews to update the UI
        setRating(0);
        setComment("");
        setEditingReviewId(null);
        setShowAddReviewModal(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data?.message ||
            "Failed to submit review. Please try again."
        );
      } else {
        setError("Failed to submit review. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/delete-review/${reviewId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setSuccessMessage(response.data.message || "Review deleted successfully");
          setReviews((prev) => prev.filter((review) => review.id !== reviewId)); // Remove the deleted review from the UI
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        if (axios.isAxiosError(error) && error.response) {
          setError(
            error.response.data?.message ||
              "Failed to delete review. Please try again."
          );
        } else {
          setError("Failed to delete review. Please try again.");
        }
      }
    }
  };

  // Handle opening the update form for an existing review
  const handleEditReview = (review: Review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review.id);
    setShowAddReviewModal(true);
  };

  // Render star rating
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-neutral-400">{rating}/5</span>
      </div>
    );
  };

  // Render star rating selector
  const StarRatingSelector = ({
    rating,
    setRating,
  }: {
    rating: number;
    setRating: (rating: number) => void;
  }) => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isFetchingReviews) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-yellow-500 text-lg flex items-center gap-2">
          <div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
          Loading reviews...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Add Review Button - Only show if user hasn't reviewed yet or is editing */}
      {(!hasUserReviewed || editingReviewId) && session?.user && (
        <button
          onClick={() => setShowAddReviewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
        >
          <Star className="h-4 w-4" />
          {hasUserReviewed ? "Edit Your Review" : "Add Review"}
        </button>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-4 bg-neutral-800/50 rounded-lg text-center">
            <p className="text-neutral-400">
              No reviews yet. Be the first to leave a review!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-neutral-800 rounded-lg border border-neutral-700"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-yellow-500 font-semibold">
                    {review.reviewer?.name}
                  </h3>
                  <StarRating rating={review.rating} />
                  <p className="text-neutral-400">{review.comment}</p>
                  <div className="text-sm text-neutral-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {session?.user?.id === review.reviewer?.id && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-1"
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Update Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-neutral-900 rounded-lg p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => {
                setShowAddReviewModal(false);
                setEditingReviewId(null);
                setRating(0);
                setComment("");
              }}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold mb-6 text-yellow-500">
              {editingReviewId ? "Update Your Review" : "Add Your Review"}
            </h2>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-yellow-500 mb-2">Rating</label>
                <StarRatingSelector rating={rating} setRating={setRating} />
              </div>

              <div>
                <label className="block text-yellow-500 mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 bg-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  rows={4}
                  placeholder="Share your experience..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddReviewModal(false);
                    setEditingReviewId(null);
                    setRating(0);
                    setComment("");
                  }}
                  className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-all flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || rating === 0}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      {editingReviewId ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      {editingReviewId ? "Update" : "Submit"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;
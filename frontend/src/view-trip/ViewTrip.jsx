import React, { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { db } from "@/service/firebaseConfig";
import InfoSection from "./components/InfoSection.jsx";
import Hotels from "./components/Hotels.jsx";
import Itinerary from "./components/Itinerary.jsx";

const ViewTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  /* -------- Fetch Trip Data -------- */
  const getTripData = async () => {
    if (!tripId) {
      toast("Invalid trip id");
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast("No trip found");
        setLoading(false);
        return;
      }

      setTrip({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      console.error("🔥 Firestore error:", error);
      toast("Error fetching trip data");
    } finally {
      setLoading(false);
    }
  };

  /* -------- Delete Trip -------- */
  const handleDeleteTrip = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, "AITrips", tripId));
      toast("Trip deleted successfully");
      navigate("/my-trip");
    } catch (error) {
      console.error("🔥 Delete error:", error);
      toast("Failed to delete trip");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getTripData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  /* -------- UI States -------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Loading"
          className="w-32 h-32 animate-pulse"
        />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Trip Not Found"
          className="w-32 h-32 opacity-70"
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-10">
      {/* Header actions */}
      <div className="flex justify-end px-6 mt-6">
        <button
          onClick={handleDeleteTrip}
          disabled={deleting}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete Trip"}
        </button>
      </div>

      {/* Trip Content */}
      <InfoSection trip={trip} />
      {trip.tripData?.hotels?.length > 0 && <Hotels trip={trip} />}
      {trip.tripData?.itinerary?.length > 0 && <Itinerary trip={trip} />}
    </div>
  );
};

export default ViewTrip;
import { db } from "../service/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTripCardItem from "./components/UserTripCardItem";

const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}logo.png`;

  /* -------- Get all trips of logged-in user -------- */
  const GetUserTrips = async () => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }

    if (!user || !user.email) {
      navigate("/");
      return;
    }

    try {
      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", user.email)
      );

      const querySnapshot = await getDocs(q);

      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });

      setUserTrips(trips);
    } catch (error) {
      console.error("🔥 Failed to fetch user trips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetUserTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- UI States -------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <img
          src={FALLBACK_IMAGE}
          alt="Loading"
          className="w-20 h-20 animate-pulse"
        />
        <p className="text-lg font-semibold">Loading your trips...</p>
      </div>
    );
  }

  return (
    <div className="p-10 md:px-20 lg:px-36">
      <h2 className="font-bold text-4xl text-center">My Trips</h2>

      {userTrips.length === 0 ? (
        <div className="flex flex-col items-center mt-10 gap-4 text-gray-500">
          <img
            src={FALLBACK_IMAGE}
            alt="No trips"
            className="w-24 h-24 opacity-70"
          />
          <p>You haven’t created any trips yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 mt-10 md:grid-cols-3 gap-5">
          {userTrips.map((trip) => (
            <UserTripCardItem trip={trip} key={trip.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
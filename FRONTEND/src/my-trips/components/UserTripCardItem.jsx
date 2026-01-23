import { PHOTO_REF_URL } from "../../constants/options";
import { GetPlaceDetails } from "../../service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserTripCardItem = ({ trip }) => {
  const [photoURL, setPhotoURL] = useState(null);

  const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}logo.png`;

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userChoice?.location?.label,
      };

      const resp = await GetPlaceDetails(data);

      const photoName =
        resp?.data?.places?.[0]?.photos?.[0]?.name;

      if (!photoName) return;

      const url = PHOTO_REF_URL.replace("{NAME}", photoName);
      setPhotoURL(url);
    } catch (error) {
      console.error("UserTrip photo error:", error);
      setPhotoURL(null); // fallback will be used
    }
  };

  useEffect(() => {
    if (trip?.userChoice?.location?.label) {
      GetPlacePhoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip]);

  return (
    <Link to={`/view-trip/${trip?.id}`}>
      <div className="hover:scale-105 transition-all hover:shadow-md">
        <img
          className="object-cover rounded-xl mx-auto w-80 h-64"
          src={photoURL || FALLBACK_IMAGE}
          alt={trip?.userChoice?.location?.label || "Trip"}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        <h2 className="font-bold text-lg">
          {trip?.userChoice?.location?.label}
        </h2>

        <h2 className="text-sm text-gray-500">
          {trip?.userChoice?.noOfDays} days trip with "
          {trip?.userChoice?.budget}" budget.
        </h2>
      </div>
    </Link>
  );
};

export default UserTripCardItem;
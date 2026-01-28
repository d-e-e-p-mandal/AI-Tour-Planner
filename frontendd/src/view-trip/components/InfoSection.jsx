import React, { useEffect, useState } from "react";
import { GetPlaceDetails } from "../../service/GlobalApi";

const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}logo.png`;

const InfoSection = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState(FALLBACK_IMAGE);

  const locationLabel = trip?.userChoice?.location?.label;

  useEffect(() => {
    if (!locationLabel) return;

    let mounted = true;

    const getPlacePhoto = async () => {
      try {
        const resp = await GetPlaceDetails({
          textQuery: locationLabel,
        });

        const photoName =
          resp?.data?.places?.[0]?.photos?.[0]?.name;

        if (photoName && mounted) {
          setPhotoUrl(
            PHOTO_REF_URL.replace("{NAME}", photoName)
          );
        }
      } catch (err) {
        console.error("Place photo error:", err);
        if (mounted) setPhotoUrl(FALLBACK_IMAGE);
      }
    };

    getPlacePhoto();

    return () => {
      mounted = false; // ✅ cleanup
    };
  }, [locationLabel]);

  if (!trip?.userChoice) return null;

  return (
    <div className="flex justify-between items-center mt-12 md:mx-16 lg:mx-48 p-6 rounded-lg shadow-lg">
      {/* IMAGE */}
      <img
        className="h-40 w-40 rounded-full object-cover bg-gray-200"
        src={photoUrl}
        alt={locationLabel || "Trip Image"}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />

      {/* INFO */}
      <div className="flex flex-col ml-6 items-end">
        <div className="text-4xl font-bold mb-2 flex items-center">
          🗺️ {locationLabel}
        </div>

        <div className="text-xl mb-1 flex items-center">
          📅 <span className="font-semibold ml-2">Duration:</span>
          {trip.userChoice.noOfDays} days
        </div>

        <div className="text-xl mb-1 flex items-center">
          💰 <span className="font-semibold ml-2">Budget:</span>
          {trip.userChoice.budget}
        </div>

        <div className="text-xl flex items-center">
          👥 <span className="font-semibold ml-2">Traveling with:</span>
          {trip.userChoice.noOfPeople}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
import React, { useEffect, useState } from "react";
import { PHOTO_REF_URL } from "../../constants/options";
import { GetPlaceDetails } from "../../service/GlobalApi";
import { CiStar } from "react-icons/ci";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}logo.png`;

const ItineraryCard = ({ plan }) => {
  if (!plan) return null;

  /* ✅ SUPPORT BOTH AI RESPONSE TYPES */
  const name = plan.placeName || plan.place_name || "Unknown Place";
  const rating = plan.rating;
  const pricing = plan.ticketPricing || plan.ticket_pricing;
  const travelTime = plan.travelTime || plan.travel_time;
  const bestTime = plan.bestTimeToVisit || plan.best_time_to_visit;
  const details = plan.details || "No description available.";

  const initialImage = plan.imageUrl || plan.image_url || "";
  const [photoUrl, setPhotoUrl] = useState(initialImage || FALLBACK_IMAGE);

  /* ✅ Fetch Google photo ONLY if AI image missing */
  useEffect(() => {
    let mounted = true;

    if (initialImage || !name) return;

    const fetchPhoto = async () => {
      try {
        const res = await GetPlaceDetails({ textQuery: name });
        const photoName = res?.data?.places?.[0]?.photos?.[0]?.name;

        if (photoName && mounted) {
          setPhotoUrl(
            PHOTO_REF_URL.replace("{NAME}", photoName)
          );
        }
      } catch (err) {
        console.error("Place photo error:", err);
      }
    };

    fetchPhoto();

    return () => {
      mounted = false; // ✅ cleanup
    };
  }, [name, initialImage]);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    name
  )}`;

  return (
    <Link to={mapsUrl} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
        {/* IMAGE */}
        <img
          src={photoUrl || FALLBACK_IMAGE}
          alt={name}
          className="w-full h-56 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          <h4 className="text-xl font-semibold flex items-center">
            <FaMapMarkerAlt className="text-blue-500 mr-2" />
            {name}
          </h4>

          {rating && (
            <p className="flex items-center text-sm text-gray-700">
              <CiStar className="text-yellow-500 mr-1" />
              {rating}
            </p>
          )}

          {pricing && (
            <p className="flex items-center text-sm text-gray-600">
              <MdAttachMoney className="text-green-600 mr-1" />
              {pricing}
            </p>
          )}

          {travelTime && (
            <p className="flex items-center text-sm text-gray-600">
              <FaClock className="text-gray-500 mr-1" />
              {travelTime}
            </p>
          )}

          {bestTime && (
            <p className="text-xs text-gray-500">
              ⏰ Best time: {bestTime}
            </p>
          )}

          <p className="text-sm text-gray-600 line-clamp-3">
            {details}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ItineraryCard;
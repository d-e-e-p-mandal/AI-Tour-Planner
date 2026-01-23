import React, { useEffect, useState } from "react";
import { PHOTO_REF_URL } from "../../constants/options";
import { GetPlaceDetails } from "../../service/GlobalApi";
import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}logo.png`;

const HotelCardItem = ({ h }) => {
  const [photoUrl, setPhotoUrl] = useState(
    h?.image_url || h?.imageUrl || FALLBACK_IMAGE
  );

  useEffect(() => {
    let mounted = true;

    // ✅ If AI already provided image, DO NOT call Google API
    if (h?.image_url || h?.imageUrl || !h?.name) return;

    const fetchHotelPhoto = async () => {
      try {
        const resp = await GetPlaceDetails({
          textQuery: h.name,
        });

        const photoName =
          resp?.data?.places?.[0]?.photos?.[0]?.name;

        if (!photoName || !mounted) return;

        const url = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(url);
      } catch (err) {
        console.error("Hotel photo fetch failed:", err);
        setPhotoUrl(FALLBACK_IMAGE);
      }
    };

    fetchHotelPhoto();

    return () => {
      mounted = false;
    };
  }, [h?.name, h?.image_url, h?.imageUrl]);

  if (!h) return null;

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${h.name} ${h.address}`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex flex-col items-center justify-center cursor-pointer">
        <img
          className="w-80 h-52 rounded-md object-cover"
          src={photoUrl}
          alt={h.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        <div className="flex w-full items-center justify-between px-8 mt-2">
          <div className="font-bold truncate">{h.name}</div>

          <div className="flex items-center gap-1">
            {h.rating ?? "N/A"}
            <CiStar />
          </div>
        </div>

        <div className="w-full px-8 my-1 text-md text-gray-600 truncate">
          {h.address}
        </div>
      </div>
    </Link>
  );
};

export default HotelCardItem;
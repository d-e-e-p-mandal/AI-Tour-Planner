import React, { useEffect } from "react";
import ItineraryCard from "./ItineraryCard";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Itinerary = ({ trip }) => {
  const itinerary = trip?.tripData?.itinerary;

  useEffect(() => {
    if (!Array.isArray(itinerary) || itinerary.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".itinerary-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".itinerary-wrapper",
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert(); // ✅ cleanup
  }, [itinerary]);

  if (!Array.isArray(itinerary) || itinerary.length === 0) return null;

  return (
    <div className="container mx-auto px-6 py-16 itinerary-wrapper">
      <h2 className="text-4xl font-bold text-center mb-12">
        Places to Visit
      </h2>

      {itinerary.map((dayItem, dayIndex) => (
        <div key={dayIndex} className="mb-16">
          {/* ✅ Avoid "Day Day 1" */}
          <h3 className="text-2xl font-semibold mb-8">
            {typeof dayItem.day === "string"
              ? dayItem.day
              : `Day ${dayItem.day}`}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(dayItem.activities || []).map((plan, index) => (
              <div
                key={`${dayIndex}-${index}`}
                className="itinerary-card"
              >
                <ItineraryCard plan={plan} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Itinerary;
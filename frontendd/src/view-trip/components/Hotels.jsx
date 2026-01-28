import React from "react";
import HotelCardItem from "./HotelCardItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Hotels = ({ trip }) => {
  // ✅ Handle ALL possible hotel locations
  const hotels =
    trip?.tripData?.travelPlan?.hotelOptions ||
    trip?.tripData?.travelPlan?.hotels ||
    trip?.tripData?.hotels ||
    [];

  if (!Array.isArray(hotels) || hotels.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: hotels.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, hotels.length),
    slidesToScroll: 1,
    autoplay: hotels.length > 1,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, hotels.length) },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">
        Hotel Recommendations
      </h2>

      <Slider {...settings}>
        {hotels.map((hotel, index) => (
          <div key={index} className="px-3">
            <HotelCardItem h={hotel} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hotels;
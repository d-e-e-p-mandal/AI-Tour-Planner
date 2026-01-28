import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">
        Page not found
      </p>

      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ParallaxProvider } from "react-scroll-parallax";

import App from "./App.jsx";
import CreateTrip from "./create-trip/CreateTrip.jsx";
import MyTrips from "./my-trips/MyTrips.jsx";
import ViewTrip from "./view-trip/ViewTrip.jsx";
import NotFound from "./pages/NotFound.jsx";

import Header from "./components/custom/Header.jsx";
import { Toaster } from "./components/ui/Sonner.jsx";
import "./index.css";

/* ---------- Layout ---------- */
const Layout = ({ children }) => (
  <>
    <Header />
    <Toaster />
    {children}
  </>
);

/* ---------- Router ---------- */
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Layout>
          <App />
        </Layout>
      ),
    },
    {
      path: "/create-trip",
      element: (
        <Layout>
          <CreateTrip />
        </Layout>
      ),
    },
    {
      path: "/view-trip/:tripId",
      element: (
        <Layout>
          <ViewTrip />
        </Layout>
      ),
    },
    {
      path: "/my-trip",
      element: (
        <Layout>
          <MyTrips />
        </Layout>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: "/",
  }
);

/* ---------- Render ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <ParallaxProvider>
        <RouterProvider router={router} />
      </ParallaxProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

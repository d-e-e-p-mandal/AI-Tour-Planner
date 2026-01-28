import React, { useState } from "react";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button.jsx";

import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "../constants/Options.jsx";

import { toast } from "sonner";
import { generateTrip } from "../service/AIModel.jsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog.jsx";

import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/FirebaseConfig.js";
import { useNavigate } from "react-router-dom";

const normalizeTripData = (raw) => ({
  hotels: Array.isArray(raw.hotel_options)
    ? raw.hotel_options.map((h) => ({
        name: h.name,
        address: h.address,
        rating: h.rating,
        imageUrl: h.image_url,
        geoCoordinates: h.geo_coordinates,
        description: h.description,
      }))
    : [],

  itinerary: Array.isArray(raw.itinerary)
    ? raw.itinerary.map((day) => ({
        day: `Day ${day.day}`,
        plan: Array.isArray(day.activities)
          ? day.activities.map((a) => ({
              placeName: a.place_name,
              placeDetails: a.details,
              imageUrl: a.image_url,
              geoCoordinates: a.geo_coordinates,
              ticketPricing: a.ticket_pricing,
              rating: a.rating,
              timeTravel: a.travel_time,
              bestTime: a.best_time_to_visit,
            }))
          : [],
      }))
    : [],
});

const CreateTrip = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  /* ---------------- Input Handlers ---------------- */
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (value) => {
    handleInputChange("location", value);
  };

  /* ---------------- Save Trip ---------------- */
  const saveAiTrip = async (tripText, user) => {
    let parsedTrip;
    console.log("working 1");

    try {
      const cleanText = tripText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      parsedTrip = JSON.parse(cleanText);
    } catch {
      toast("Invalid AI response");
      setLoading(false);
      return;
    }

    console.log("work 2");

    const docId = Date.now().toString();
    console.log(docId);

    /* 🔒 HARD GUARDS — FIXED (NO THROW) */
    if (!db) {
      console.error("Firestore not initialized");
      setLoading(false);
      return;
    }

    if (!user || !user.email) {
      console.error("User not available", user);
      setLoading(false);
      return;
    }

    if (!parsedTrip || typeof parsedTrip !== "object") {
      console.error("Invalid trip data", parsedTrip);
      setLoading(false);
      return;
    }

    console.log("AFTER THIS");

    const sanitize = (value) => {
      if (value === undefined) return null;

      if (Array.isArray(value)) {
        return value.map(sanitize).filter((v) => v !== null);
      }

      if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
          Object.entries(value)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, sanitize(v)])
        );
      }

      return value;
    };

    try {
      await setDoc(doc(db, "AITrips", docId), {
        userChoice: sanitize(formData),
        tripData: sanitize(parsedTrip),
        userEmail: String(user.email),
        id: docId,
        createdAt: new Date(),
      });
    } catch (e) {
      console.error("Firestore error:", e);
      toast("Failed to save trip");
      setLoading(false);
      return;
    }

    console.log("work 3");
    setLoading(false);
    console.log("work 4");
    navigate(`/view-trip/${docId}`);
  };

  /* ---------------- Generate Trip ---------------- */
  const onGenerateTrip = async (incomingUser = null) => {
    const storedUser = localStorage.getItem("user");
    const user = incomingUser || (storedUser && JSON.parse(storedUser));

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!formData.noOfDays || formData.noOfDays > 7) {
      toast("Trip days must be between 1–7");
      return;
    }

    if (!formData.location || !formData.budget || !formData.noOfPeople) {
      toast("Please fill all details");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData.location.label
    )
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.noOfPeople)
      .replace("{budget}", formData.budget);

    try {
      const text = await generateTrip(FINAL_PROMPT);
      await saveAiTrip(text, user);
    } catch {
      toast("Failed to generate trip");
      setLoading(false);
    }
  };

  /* ---------------- Google Profile ---------------- */
  const getUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        { headers: { Authorization: `Bearer ${tokenInfo.access_token}` } }
      )
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        onGenerateTrip(res.data);
      })
      .catch(() => toast("Google login failed"));
  };

  /* ---------------- Google Login ---------------- */
  const login = useGoogleLogin({
    scope: "profile email",
    onSuccess: getUserProfile,
    onError: () => toast("Google login failed"),
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-10">
          Travel Preferences ✈️
        </h1>

        <div className="mb-8">
          <label className="font-semibold mb-2 block">Destination</label>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{ onChange: handleSelect }}
          />
        </div>

        <div className="mb-8">
          <label className="font-semibold mb-2 block">Trip Days</label>
          <Input
            type="number"
            min={1}
            max={7}
            onChange={(e) =>
              handleInputChange("noOfDays", Number(e.target.value))
            }
          />
        </div>

        <div className="mb-10">
          <label className="font-semibold mb-4 block">Budget</label>
          <div className="grid md:grid-cols-3 gap-4">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.title}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-6 rounded-xl cursor-pointer border ${
                  formData.budget === item.title
                    ? "bg-indigo-600 text-white"
                    : ""
                }`}
              >
                <div className="text-3xl">{item.icon}</div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <label className="font-semibold mb-4 block">Travellers</label>
          <div className="grid md:grid-cols-3 gap-4">
            {SelectTravelList.map((item) => (
              <div
                key={item.people}
                onClick={() =>
                  handleInputChange("noOfPeople", item.people)
                }
                className={`p-6 rounded-xl cursor-pointer border ${
                  formData.noOfPeople === item.people
                    ? "bg-indigo-600 text-white"
                    : ""
                }`}
              >
                <div className="text-3xl">{item.icon}</div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onGenerateTrip()}
          disabled={loading}
          className="w-full h-14 text-lg"
        >
          {loading ? "Generating..." : "Generate My Trip"}
        </Button>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign In</DialogTitle>
              <DialogDescription>
                <Button onClick={login} className="w-full mt-4">
                  Sign in with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateTrip;


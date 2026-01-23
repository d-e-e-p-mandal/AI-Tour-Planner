/* ---------------- Travel Options ---------------- */

export const SelectTravelList = [
  {
    id: 1,
    title: "Solo Adventure",
    desc: "Embark on a journey of self-discovery",
    icon: "🎒",
    people: "1 person",
  },
  {
    id: 2,
    title: "Romantic Getaway",
    desc: "Experience the world together",
    icon: "💑",
    people: "2 people",
  },
  {
    id: 3,
    title: "Family Fun",
    desc: "Create unforgettable memories with loved ones",
    icon: "🏠",
    people: "3 to 4 people",
  },
  {
    id: 4,
    title: "Friends' Escapade",
    desc: "Thrilling adventures with your best pals",
    icon: "🧑‍🤝‍🧑",
    people: "5 to 10 people",
  },
];

/* ---------------- Budget Options ---------------- */

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Budget-Friendly",
    desc: "Travel smart, spend less",
    icon: "💸",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Balance comfort and cost",
    icon: "💵",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Indulge in lavish experiences",
    icon: "💎",
  },
];

/* ---------------- STRICT AI PROMPT (FIXED) ---------------- */

export const AI_PROMPT = `
You are a travel planning API.

Return ONLY valid JSON.
Do NOT include markdown, comments, or explanations.
Do NOT change key names.
Do NOT omit fields.
Do NOT return null values.

Use EXACTLY this JSON schema:

{
  "destination": string,
  "duration": string,
  "traveler_type": string,
  "budget": string,

  "hotels": [
    {
      "name": string,
      "address": string,
      "image_url": string,
      "geo_coordinates": {
        "latitude": number,
        "longitude": number
      },
      "rating": number,
      "description": string
    }
  ],

  "itinerary": [
    {
      "day": number,
      "activities": [
        {
          "place_name": string,
          "details": string,
          "image_url": string,
          "geo_coordinates": {
            "latitude": number,
            "longitude": number
          },
          "ticket_pricing": string,
          "rating": number,
          "travel_time": string,
          "best_time_to_visit": string
        }
      ]
    }
  ]
}

Rules:
- Always use snake_case keys
- Always return arrays for "hotels", "itinerary", and "activities"
- Image URLs must be direct and publicly accessible
- If data is unknown, return an empty string ""
- Generate itinerary for {totalDays} days

Now generate a travel plan for:
Destination: {location}
Days: {totalDays}
Traveler type: {traveler}
Budget: {budget}
`;

/* ---------------- Google Place Photo URL ---------------- */

export const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
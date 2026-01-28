
# 🧭 AI-Based Tour Planner

[LIVE LINK]()

An intelligent travel planning web application that generates personalized trip itineraries, hotel recommendations, and places to visit using AI and real-world location data.

---

## 🚀 Tech Stack & Tools Used

### 🖥️ Frontend

- **React.js**  
  Component-based UI library for building a fast, interactive single-page application.

- **Vite**  
  Modern frontend build tool providing lightning-fast development server and optimized production builds.

- **React Router DOM**  
  Client-side routing for seamless navigation between pages like Create Trip, View Trip, and My Trips.

- **Tailwind CSS**  
  Utility-first CSS framework for building clean, responsive, and modern UI with minimal custom CSS.

- **shadcn/ui + Radix UI**  
  Accessible, unstyled UI primitives used for dialogs, popovers, buttons, and form components.

- **GSAP (GreenSock Animation Platform)**  
  Used for smooth scroll-based animations and transitions in itinerary and card sections.

---

## 🔐 Authentication

- **Google OAuth 2.0 (`@react-oauth/google`)**  
  Secure user authentication via Google Sign-In with popup-based OAuth flow.

---

## 🤖 AI & Backend Services

- **Node.js**  
  JavaScript runtime used to build the backend API.

- **Express.js**  
  Lightweight backend framework to handle API routes and AI requests.

- **AI Model (Gemini / LLM API)**  
  Generates structured travel plans including:
  - Hotel recommendations
  - Daily itineraries
  - Places to visit
  - Budget tips

- **Prompt Engineering**  
  Carefully designed prompts ensure consistent, structured JSON output from the AI.

---

## 🗺️ Maps & Location Services

- **Google Places API**  
  Used to:
  - Fetch place details
  - Retrieve real photos for hotels and attractions
  - Enhance AI-generated data with real-world images

- **Google Maps Search Links**  
  Direct navigation links for hotels and places using Google Maps.

---

## 🗄️ Database & Storage

- **Firebase Firestore**  
  Cloud NoSQL database used to store:
  - User trips
  - Travel preferences
  - Generated itineraries
  - Timestamps and user metadata

---

## 📦 State Management & Utilities

- **Axios / Fetch API**  
  For making HTTP requests to backend services and Google APIs.

- **LocalStorage**  
  Stores authenticated user session data on the client.

- **Environment Variables (`.env`)**  
  Secure storage for API keys and sensitive configuration:
  - Google OAuth Client ID
  - Google Places API Key
  - AI API keys

---

## 🎨 UI & UX Enhancements

- **React Icons**  
  Lightweight icon library for ratings, location markers, time, and budget indicators.

- **Responsive Design**  
  Fully responsive layout optimized for mobile, tablet, and desktop screens.

- **Fallback Images & Error Handling**  
  Graceful handling of broken images using default branding assets.

---

## ⚙️ Development & Tooling

- **ESLint**  
  Enforces clean, consistent JavaScript and React code.

- **Git & GitHub**  
  Version control and project collaboration.

- **Visual Studio Code**  
  Primary development environment.

---

## 📁 Project Architecture (High-Level)

```text
frontend/
 ├── components/
 ├── create-trip/
 ├── view-trip/
 ├── my-trips/
 ├── service/
 ├── constants/
 └── App.jsx

backend/
 ├── server.js
 ├── routes/
 └── ai-service/
⸻

📁 Project Architecture (High-Level)
```
frontend/
 ├── components/
 ├── create-trip/
 ├── view-trip/
 ├── my-trips/
 ├── service/
 ├── constants/
 └── App.jsx

backend/
 ├── server.js
 ├── routes/
 └── ai-service/
```

⸻

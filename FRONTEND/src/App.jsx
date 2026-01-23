import { useState } from "react";
import Hero from "./components/custom/Hero.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-cover bg-[url('/bg.jpg')]">
      <Hero />
    </div>
  );
}

export default App;
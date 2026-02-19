export async function generateTrip(prompt) {
   const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/generate-trip`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }
    );
  
    if (!res.ok) throw new Error("AI request failed");
  
    const data = await res.json();
    //console.log("data",data);
    // if (!data?.text || data.text.trim().length === 0) {
    //   throw new Error("Empty AI response");
    // }
  
    console.log(data.text);
    
    return data.text;
  }

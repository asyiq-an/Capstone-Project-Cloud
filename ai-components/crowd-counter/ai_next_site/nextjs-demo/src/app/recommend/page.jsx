"use client";



import { useState } from "react";
import { allDishes } from "../../../data/dishes.js";
import { getRecommendations } from "../../../lib/recommend.js";





export default function RecommendPage() {
  const [inputs, setInputs] = useState([
    { dish: "", liked: "" },
    { dish: "", liked: "" },
    { dish: "", liked: "" },
  ]);
  const [result, setResult] = useState(null);

  const handleChange = (i, field, value) => {
    const updated = [...inputs];
    updated[i][field] = value;
    setInputs(updated);
  };

  const submit = () => {
    const liked = [];
    const disliked = [];

    for (const row of inputs) {
      const dish = allDishes.find((d) => d.name === row.dish);
      if (dish) {
        if (row.liked === "like") liked.push(dish);
        else if (row.liked === "dislike") disliked.push(dish);
      }
    }

    const recs = getRecommendations(allDishes, liked, disliked);
    setResult(recs);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-200 p-8 text-gray-800">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">🍜 NP Snatch Dish Recommender</h1>
        {inputs.map((row, i) => (
          <div key={i} className="mb-4 flex gap-4">
            <select
              className="w-1/2 p-2 border rounded"
              value={row.dish}
              onChange={(e) => handleChange(i, "dish", e.target.value)}
            >
              <option value="">Select dish</option>
              {allDishes.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              className="w-1/2 p-2 border rounded"
              value={row.liked}
              onChange={(e) => handleChange(i, "liked", e.target.value)}
            >
              <option value="">Like or dislike?</option>
              <option value="like">Liked 👍</option>
              <option value="dislike">Disliked 👎</option>
            </select>
          </div>
        ))}
        <button
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          onClick={submit}
        >
          Get Recommendations
        </button>

        {result && (
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2 text-center">Dishes you might like, ranked from most likely to least likely:</h2>
            <ul className="list-disc list-inside">
              {result.map((d) => (
                <li key={d.name}>{d.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

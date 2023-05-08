import React, { useState } from "react";

export const FoodSearch = () => {
  const [ingredientName, setIngredientName] = useState("");
  const [calories, setCalories] = useState(null);

  const handleInputChange = (event) => {
    setIngredientName(event.target.value);
  };

  const searchFood = async () => {
    try {
      const response = await fetch(
        `https://wger.de/api/v2/ingredient/?name=${encodeURIComponent(
          ingredientName
        )}`,
        {
          headers: {
            Authorization: "10891aab68ab8ae23a4acd6b04527a502185c593", // Replace with your actual API key
          },
        }
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const ingredientId = data.results[0].id;
        const infoResponse = await fetch(
          `https://wger.de/api/v2/foodinfo/${ingredientId}/`,
          {
            headers: {
              Authorization: "10891aab68ab8ae23a4acd6b04527a502185c593", // Replace with your actual API key
            },
          }
        );
        const infoData = await infoResponse.json();
        setCalories(infoData.calories);
      } else {
        setCalories(null);
      }
    } catch (error) {
      console.log("Error searching for food:", error);
      setCalories(null);
    }
  };

  return (
    <div>
      <input type="text" value={ingredientName} onChange={handleInputChange} />
      <button onClick={searchFood}>Search</button>
      {calories !== null && (
        <p>
          Calories for {ingredientName}: {calories}
        </p>
      )}
    </div>
  );
};

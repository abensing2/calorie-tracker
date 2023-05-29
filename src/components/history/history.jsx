import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import "./History.css";
import { useLocation } from "react-router-dom";

export const History = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [workoutCount, setWorkoutCount] = useState(0);

  const [foodItems, setFoodItems] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [deletedFoodItems, setDeletedFoodItems] = useState([]);

  useEffect(() => {
    const savedWorkoutCount = localStorage.getItem("workoutCount");
    if (savedWorkoutCount) {
      setWorkoutCount(parseInt(savedWorkoutCount));
    }
  }, []);
  useEffect(() => {
    const storedFoodItems = JSON.parse(localStorage.getItem("foodItems"));
    const storedTotalCalories = parseInt(localStorage.getItem("totalCalories"));

    if (storedFoodItems && storedTotalCalories) {
      setFoodItems(storedFoodItems);
      setTotalCalories(storedTotalCalories);
    }
  }, []);

  const handleClearHistory = () => {
    setFoodItems([]);
    setDeletedFoodItems([]);
    setTotalCalories(0);
    setWorkoutCount(0);
    localStorage.removeItem("foodItems");
    localStorage.removeItem("deletedFoodItems");
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("workoutCount");
  };

  const handleDeleteFoodItem = (foodItemId) => {
    const foodItemIndex = foodItems.findIndex(
      (foodItem) => foodItem.id === foodItemId
    );
    if (foodItemIndex !== -1) {
      const deletedFoodItem = foodItems[foodItemIndex];
      const newFoodItems = [...foodItems];
      newFoodItems.splice(foodItemIndex, 1);
      setFoodItems(newFoodItems);
      setDeletedFoodItems([...deletedFoodItems, deletedFoodItem]);
      const newTotalCalories =
        totalCalories -
        deletedFoodItem.foodNutrients.find((n) => n.nutrientName === "Energy")
          .value;
      setTotalCalories(newTotalCalories);
    }
  };

  useEffect(() => {
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
    localStorage.setItem("deletedFoodItems", JSON.stringify(deletedFoodItems));
    localStorage.setItem("totalCalories", totalCalories.toString());
  }, [foodItems, deletedFoodItems, totalCalories]);

  // Calculate nutrient totals
  const calculateNutrientTotals = () => {
    let totalCarbs = 0;
    let totalProteins = 0;
    let totalFats = 0;

    foodItems.forEach((foodItem) => {
      const carbs = foodItem.foodNutrients.find(
        (n) => n.nutrientName === "Carbohydrate, by difference"
      );
      const proteins = foodItem.foodNutrients.find(
        (n) => n.nutrientName === "Protein"
      );
      const fats = foodItem.foodNutrients.find(
        (n) => n.nutrientName === "Total lipid (fat)"
      );

      if (carbs) {
        totalCarbs += carbs.value;
      }
      if (proteins) {
        totalProteins += proteins.value;
      }
      if (fats) {
        totalFats += fats.value;
      }
    });

    return { totalCarbs, totalProteins, totalFats };
  };

  const { totalCarbs, totalProteins, totalFats } = calculateNutrientTotals();

  return (
    <Paper className="history-paper" style={{ padding: "1rem" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Food log:
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="body1" fontWeight="bold">
                Food:
              </Typography>
            }
          />
          <ListItemText
            primary={
              <Typography variant="body1" fontWeight="bold">
                Calorie Intake:
              </Typography>
            }
          />
        </ListItem>
        {foodItems.length > 0 ? (
          foodItems.map((foodItem) => (
            <ListItem key={foodItem.id}>
              <ListItemText
                primary={foodItem.description}
                secondary={`${foodItem.brandOwner} (${foodItem.sourceCode})`}
              />
              <ListItemText
                primary={
                  foodItem.foodNutrients.find(
                    (n) => n.nutrientName === "Energy"
                  ).value + " kcal"
                }
                style={{ marginRight: "140px" }}
              />
              <Button
                variant="contained"
                onClick={() => handleDeleteFoodItem(foodItem.id)}
                className="history-delete-button" // Apply the custom class
              >
                Delete
              </Button>
            </ListItem>
          ))
        ) : (
          <Typography>No food items added.</Typography>
        )}
        {deletedFoodItems.length > 0 && (
          <ListItem>
            <ListItemText primary="Deleted Food Items:" />
          </ListItem>
        )}
        <ListItem>
          <ListItemText primary="Total Calories:" />
          <ListItemText
            primary={totalCalories}
            style={{ marginRight: "140px" }}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Total Workouts:" />
          <ListItemText
            primary={workoutCount}
            style={{ marginRight: "140px" }}
          />
        </ListItem>
      </List>

      {/* Summary Section */}
      <Paper
        className="nutrient-summary"
        style={{ marginTop: "2rem", padding: "1rem" }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Nutrient Summary:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Total Carbs:" />
            <ListItemText
              primary={totalCarbs.toFixed(2) + " g"}
              style={{ marginRight: "140px" }}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Total Proteins:" />
            <ListItemText
              primary={totalProteins.toFixed(2) + " g"}
              style={{ marginRight: "140px" }}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Total Fats:" />
            <ListItemText
              primary={totalFats.toFixed(2) + " g"}
              style={{ marginRight: "140px" }}
            />
          </ListItem>
        </List>

        {/* Clear History Button */}
        {foodItems.length > 0 && (
          <Button
            variant="contained"
            onClick={handleClearHistory}
            className="history-clear-button" // Apply the custom class
            style={{ marginTop: "1rem" }}
          >
            Clear History
          </Button>
        )}
      </Paper>
    </Paper>
  );
};

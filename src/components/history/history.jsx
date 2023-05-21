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

export const History = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [deletedFoodItems, setDeletedFoodItems] = useState([]);

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
    localStorage.removeItem("foodItems");
    localStorage.removeItem("deletedFoodItems");
    localStorage.removeItem("totalCalories");
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

  return (
    <Paper style={{ padding: "1rem" }}>
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
                className="history-delete-button"
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
      </List>
      {foodItems.length > 0 && (
        <Button
          variant="contained"
          onClick={handleClearHistory}
          className="history-clear-button" // Apply the custom class
        >
          Clear History
        </Button>
      )}
    </Paper>
  );
};

import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

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
      <Typography variant="h4" gutterBottom>
        Food log:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Food" />
          <ListItemText primary="Calorie Intake" />
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
              />
              <Button
                variant="contained"
                onClick={() => handleDeleteFoodItem(foodItem.id)}
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
          <ListItemText primary={totalCalories} />
        </ListItem>
      </List>
      {foodItems.length > 0 && (
        <Button variant="contained" onClick={handleClearHistory}>
          Clear History
        </Button>
      )}
    </Paper>
  );
};

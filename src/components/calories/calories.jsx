import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Paper, IconButton } from "@mui/material";
import { useLocation } from "react-router-dom";

export const Calories = ({ handleRedirect }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    const savedFoodItems = JSON.parse(localStorage.getItem("foodItems"));
    const savedTotalCalories = parseInt(localStorage.getItem("totalCalories"));
    const savedName = localStorage.getItem("name");
    if (savedFoodItems && savedTotalCalories && savedName) {
      setFoodItems(savedFoodItems);
      setTotalCalories(savedTotalCalories);
      setName(savedName); // Set the name state
    }
  }, []);

  const location = useLocation();

  const handleAddFood = async (event) => {
    event.preventDefault();
    console.log("Adding food...");
    const foodName = event.target.elements.foodName.value;
    const apiKey = "rJGGezPEBrjVGOSLc4y28yBnVw2XDuNWFZfSdm1d";
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/search?api_key=${apiKey}&generalSearchInput=${foodName}`,
      { headers: { Accept: "application/json" } }
    );
    const data = await response.json();
    const foodItem = data.foods[0];
    if (foodItem) {
      foodItem.id = Date.now(); // Add unique id to the food item
      setFoodItems((prevItems) => [...prevItems, foodItem]);
      setTotalCalories(
        (prevCalories) =>
          prevCalories +
          foodItem.foodNutrients.find((n) => n.nutrientName === "Energy").value
      );
      localStorage.setItem(
        "foodItems",
        JSON.stringify([...foodItems, foodItem])
      );
      localStorage.setItem(
        "totalCalories",
        totalCalories +
          foodItem.foodNutrients.find((n) => n.nutrientName === "Energy").value
      );
    } else {
      alert("Food not found.");
    }
  };

  const handleDeleteFood = (fdcId, event) => {
    event.stopPropagation();
    const itemToDelete = foodItems.find((item) => item.fdcId === fdcId);
    if (itemToDelete) {
      const newFoodItems = foodItems.filter((item) => item.fdcId !== fdcId);
      setFoodItems(newFoodItems);
      setTotalCalories(
        (prevCalories) =>
          prevCalories -
          itemToDelete.foodNutrients.find((n) => n.nutrientName === "Energy")
            .value
      );
    }
  };

  const handleDone = () => {
    // Save food items and total calories to localStorage
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
    localStorage.setItem("totalCalories", totalCalories);
  };

  return (
    <Paper style={{ padding: "1rem" }}>
      <h1>Welcome, {name}!</h1>
      <Typography variant="h4" gutterBottom>
        Track Your Calories:
      </Typography>
      <form
        onSubmit={handleAddFood}
        style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}
      >
        <TextField
          id="foodName"
          name="foodName"
          label="Enter Food:"
          variant="outlined"
          style={{ flex: 1, marginRight: "1rem" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: "5rem" }}
        >
          Add
        </Button>
      </form>
      <Typography variant="h5" gutterBottom>
        Result:
      </Typography>

      {foodItems.length > 0 ? (
        <List>
          {foodItems.map((foodItem) => (
            <ListItem key={foodItem.id}>
              <ListItemText
                primary={`${foodItem.description} was successfully added to your food log.`}
                secondary={`${foodItem.brandOwner} (${foodItem.sourceCode})`}
              />

              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => handleDeleteFood(foodItem.fdcId, e)}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No food items added.</Typography>
      )}
    </Paper>
  );
};

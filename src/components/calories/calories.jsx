import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Calories.css"; // Import the custom CSS file

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
      setName(savedName);
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
      localStorage.setItem("foodItems", JSON.stringify(newFoodItems));
      localStorage.setItem(
        "totalCalories",
        totalCalories -
          itemToDelete.foodNutrients.find((n) => n.nutrientName === "Energy")
            .value
      );
    }
  };

  const handleDone = () => {
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
    localStorage.setItem("totalCalories", totalCalories);
  };

  return (
    <Paper className="calories-paper">
      <h1>Welcome, {name}!</h1>
      <Typography variant="h4" gutterBottom>
        Track Your Calories:
      </Typography>
      <form onSubmit={handleAddFood} className="calories-form">
        <TextField
          id="foodName"
          name="foodName"
          label="Enter Food:"
          variant="outlined"
          className="calories-textfield"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="calories-button"
        >
          Add
        </Button>
      </form>
      <br></br>
      <div className="food-item">
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
                  className="calories-delete-icon"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No food items added.</Typography>
        )}
      </div>
      <Button
        variant="contained"
        color="primary"
        className="see-history-button"
        component={Link}
        to={{
          pathname: "/history",
          state: { name: name }, // Pass the name as a prop
        }}
      >
        See History
      </Button>
    </Paper>
  );
};

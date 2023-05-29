import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation } from "react-router-dom";
import "./Workouts.css";

export const Workouts = ({ handleRedirect }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [workoutCount, setWorkoutCount] = useState(0);

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem("workouts"));
    const savedWorkoutCount = parseInt(localStorage.getItem("workoutCount"));
    if (savedWorkouts && savedWorkoutCount) {
      setWorkouts(savedWorkouts);
      setWorkoutCount(savedWorkoutCount);
    }
  }, []);

  useEffect(() => {
    const fetchExerciseData = async () => {
      const apiKey = "rJGGezPEBrjVGOSLc4y28yBnVw2XDuNWFZfSdm1d";
      try {
        const response = await fetch(
          `https://wger.de/api/v2/exercise/?name=${encodeURIComponent(
            selectedExercise
          )}`,
          { headers: { Accept: "application/json" } }
        );
        const data = await response.json();
        setExercises(data.results || []);
      } catch (error) {
        console.error("Error fetching exercise data:", error);
      }
    };

    fetchExerciseData();
  }, [selectedExercise]);

  const handleDeleteWorkout = (workout) => {
    const newWorkouts = workouts.filter((w) => w.id !== workout.id);
    setWorkouts(newWorkouts);
    setWorkoutCount((prevCount) => prevCount - 1);
    localStorage.setItem("workouts", JSON.stringify(newWorkouts));
    localStorage.setItem("workoutCount", workoutCount - 1);
  };

  const handleToggleDone = (workout) => {
    const updatedWorkouts = workouts.map((w) => {
      if (w.id === workout.id) {
        return { ...w, isDone: !w.isDone };
      }
      return w;
    });
    setWorkouts(updatedWorkouts);
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
  };

  const handleSaveWorkout = (e) => {
    e.preventDefault();

    if (selectedExercise) {
      const newWorkout = {
        id: selectedExercise.id,
        name: selectedExercise.name,
        kcal: selectedExercise.kcal,
        isDone: false,
      };
      const newWorkouts = [...workouts, newWorkout];
      setWorkouts(newWorkouts);
      setWorkoutCount((prevCount) => prevCount + 1);
      localStorage.setItem("workouts", JSON.stringify(newWorkouts));
      localStorage.setItem("workoutCount", workoutCount + 1);
    }
    setSelectedExercise("");
  };

  return (
    <Paper className="workouts-paper">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Track Your Exercise:
      </Typography>

      <FormControl sx={{ width: "90%", marginBottom: "16px" }}>
        <InputLabel>Select Exercise:</InputLabel>
        {exercises.length > 0 ? (
          <Select
            value={selectedExercise}
            onChange={(event) => setSelectedExercise(event.target.value)}
          >
            {exercises.map((exercise) => (
              <MenuItem key={exercise.id} value={exercise}>
                {`${exercise.name} (${exercise.kcal} calories)`}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography>Loading exercises...</Typography>
        )}
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="calories-button"
        onClick={handleSaveWorkout}
        style={{ backgroundColor: "purple", marginLeft: "10px" }}
      >
        Save Workout
      </Button>
      <Typography variant="h5" gutterBottom>
        Workouts:
        {workouts.length === 0 ? (
          <Typography>No workouts added.</Typography>
        ) : (
          <>
            {selectedWorkout && (
              <List>
                <ListItem>
                  <ListItemText primary={selectedWorkout.name} />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => setSelectedWorkout(null)}
                    className="calories-delete-icon"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </ListItem>
              </List>
            )}
            <List>
              {workouts.map((workout) => (
                <ListItem
                  key={workout.id}
                  style={{ opacity: workout.isDone ? 0.5 : 1 }}
                >
                  <ListItemText primary={workout.name} />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteWorkout(workout)}
                    className="calories-delete-icon"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="toggle done"
                    onClick={() => handleToggleDone(workout)}
                    className="calories-done-icon"
                  >
                    {workout.isDone ? (
                      <CheckCircleOutlineIcon sx={{ color: "purple" }} />
                    ) : (
                      <CheckCircleOutlineIcon />
                    )}
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Typography>
    </Paper>
  );
};

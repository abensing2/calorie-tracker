import { cloneDeep } from "lodash";

export const CalorieActions = {
  ADD: "ADD",
  TOGGLE: "TOGGLE",
  DELETE: "DELETE",
};
export const calorieReducer = (state, action) => {
  switch (action.type) {
    case CalorieActions.ADD: {
      return { calories: [...state.calories, action.calories] };
    }
    case CalorieActions.TOGGLE: {
      let newCalories = cloneDeep(state.calories);
      const updatedCalories = newCalories.find(
        (x) => x.title === action.calories.title
      );
      updatedCalories.isComplete = !updatedCalories.isComplete;
      return {
        calories: newCalories,
      };
    }
    case CalorieActions.DELETE: {
      let newCalories = cloneDeep(state.calories);
      const updatedCalories = newCalories.find(
        (x) => x.title === action.calories.title
      );
      newCalories.splice(newCalories.indexOf(updatedCalories));
      return {
        calories: newCalories,
      };
    }
  }
};

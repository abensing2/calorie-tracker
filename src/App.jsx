import logo from "./logo.svg";
import backgroundImage from "./backgroundImage.jpg";
import "./App.css";
import { HashRouter, Routes } from "react-router-dom";
import { Home } from "./components/home/home";
import { Header } from "./components/header/header";
import { History } from "./components/history/history";
import { Calories } from "./components/calories/calories";
import { BrowserRouter as Router } from "react-router-dom";
import { useReducer } from "react";
import { Switch, Route } from "react-router-dom";

import { CalorieContext } from "./state/caloriecontext";
import { calorieReducer } from "./state/caloriereducer";
import React, { useMemo } from "react";

function App() {
  const [calories, dispatch] = useReducer(calorieReducer, []);

  const calorieContextValue = useMemo(() => {
    return { calories, dispatch };
  }, [calories, dispatch]);

  return (
    <>
      <HashRouter>
        <CalorieContext.Provider value={calorieContextValue}>
          <Header />
          <Routes>
            {/*localhost:3000/#*/}
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/calories" element={<Calories />} />
          </Routes>
        </CalorieContext.Provider>
      </HashRouter>
    </>
  );
}

export default App;

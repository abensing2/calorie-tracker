import * as React from "react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  TextField,
  Typography,
  Grid,
  Box,
  InputLabel,
  Input,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./Home.css";

export const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [name, setName] = useState("");
  const [gender, setGender] = useState(""); // Added gender state

  const quotes = [
    "A year from now, you will wish you started today.",
    "An active mind cannot exist in an inactive body",
    "It does not matter how slowly you go as long as you do not stop.",
  ];

  const handleNameChange = (event) => {
    const newName = event.target.value;
    localStorage.setItem("name", newName);
    setName(newName);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  }; // Added gender change handler

  return (
    <body className="home-body">
      <div className="App">
        <Box mx={2} my={2}>
          <Typography variant="h4" align="center" fontWeight="bold">
            Welcome to Calorie Tracker:
          </Typography>
          <Box my={2}>
            <Typography variant="h6" align="left" className="section-title">
              Enter your information below:
            </Typography>
          </Box>
          <br />
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={1}>
              <Typography variant="body1" align="left">
                Name:
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="name-input" shrink></InputLabel>
              <Input
                id="name-input"
                variant="outlined"
                fullWidth
                placeholder="First"
                value={name}
                onChange={handleNameChange}
              />
            </Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="name-input2" shrink></InputLabel>
              <Input
                id="name-input2"
                variant="outlined"
                fullWidth
                placeholder="Last"
              />
            </Grid>
          </Grid>
          <br />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={1}>
              <Typography variant="body1" align="left">
                Age:
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="age-input" shrink></InputLabel>
              <Input
                id="age-input"
                variant="outlined"
                fullWidth
                placeholder=""
              />
            </Grid>
          </Grid>
          <br />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={1}>
              <Typography variant="body1" align="left">
                Height:
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="height-input" shrink></InputLabel>
              <Input
                id="height-input"
                variant="outlined"
                fullWidth
                placeholder="Feet"
              />
            </Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="height-input2" shrink></InputLabel>
              <Input
                id="height-input2"
                variant="outlined"
                fullWidth
                placeholder="Inches"
              />
            </Grid>
          </Grid>

          <br />
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={1}>
              <Typography variant="body1" align="left">
                Weight:
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="weight-input" shrink></InputLabel>
              <Input
                id="weight-input"
                variant="outlined"
                fullWidth
                placeholder="lbs"
              />
            </Grid>
          </Grid>
          <br />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={1}>
              <Typography variant="body1" align="left">
                Gender:
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <RadioGroup
                id="gender-input"
                name="gender"
                value={gender}
                onChange={handleGenderChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio className="radio-button" />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio className="radio-button" />}
                  label="Female"
                />
              </RadioGroup>
            </Grid>
          </Grid>
          <br />
        </Box>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Button
            variant="contained"
            color="primary"
            className="get-started-button"
            component={Link}
            to="/calories"
          >
            Get Started
          </Button>
        </Box>
        <Slider {...settings}>
          {quotes.map((quote) => (
            <div key={quote}>
              <h3>{quote}</h3>
            </div>
          ))}
        </Slider>
      </div>
    </body>
  );
};

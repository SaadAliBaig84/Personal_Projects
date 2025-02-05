// import express from 'express';
// import bodyParser from 'body-parser';
// import {dbConnect} from './models/psqlWrapper';
const express = require("express");
const bodyParser = require("body-parser");
const { dbConnect } = require("./models/psqlWrapper");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(`METHOD: ${req.method}, Path: ${req.path}`);
  next();
});
dbConnect().then(() => {
  console.log("done");
});
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
const bookRoutes = require("./routes/bookRoutes");
app.use("/books", bookRoutes);
app.listen(port, () => {
  console.log("Server running on port " + port);
});

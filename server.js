// server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/userTrackingDB", {
    mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Schemas and Models
const visitSchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date,
  duration: Number,
  clickCount: Number,
  contactClicks: Number,
  whatsappClicks: Number,
  viewMoreClicks: Number,
});

const Visit = mongoose.model("Visit", visitSchema);

// API Endpoint to Save Visit Data
app.post("/api/save-visit", async (req, res) => {
  const { startTime, endTime, duration, clickCount, contactClicks, whatsappClicks, viewMoreClicks } = req.body;

  const newVisit = new Visit({
    startTime,
    endTime,
    duration,
    clickCount,
    contactClicks,
    whatsappClicks,
    viewMoreClicks,
  });

  try {
    await newVisit.save();
    res.status(200).json({ message: "Visit data saved successfully" });
  } catch (err) {
    console.error("Error saving visit:", err);
    res.status(500).json({ error: "Failed to save visit data" });
  }
});

// API Endpoint to Get Visit Data for Dashboard
app.get("/api/get-visits", async (req, res) => {
  try {
    const visits = await Visit.find({});
    res.status(200).json(visits);
  } catch (err) {
    console.error("Error retrieving visits:", err);
    res.status(500).json({ error: "Failed to retrieve visit data" });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

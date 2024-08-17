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
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/userTrackingDB", {
    maxPoolSize: 1000
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Connection error:", err);
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
    homeClicks: Number,
    aboutClicks: Number,
    contactNavClicks: Number,
    textSelections: Number,
    selectedTexts: [String] // Store selected texts as an array of strings
});

const Visit = mongoose.model("Visit", visitSchema);

const textSelectionSchema = new mongoose.Schema({
    selectedText: String,
    timestamp: { type: Date, default: Date.now }
});

const TextSelection = mongoose.model("TextSelection", textSelectionSchema);

// API Endpoint to Save Visit Data
app.post("/api/save-visit", async (req, res) => {
    console.log("Received visit data:", req.body); // Debugging line

    const {
        startTime,
        endTime,
        duration,
        clickCount,
        contactClicks,
        whatsappClicks,
        viewMoreClicks,
        homeClicks,
        aboutClicks,
        contactNavClicks,
        textSelections,
        selectedTexts
    } = req.body;

    const newVisit = new Visit({
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        clickCount,
        contactClicks,
        whatsappClicks,
        viewMoreClicks,
        homeClicks,
        aboutClicks,
        contactNavClicks,
        textSelections,
        selectedTexts
    });

    try {
        await newVisit.save();
        res.status(200).json({ message: "Visit data saved successfully" });
    } catch (err) {
        console.error("Error saving visit:", err);
        res.status(500).json({ error: "Failed to save visit data" });
    }
});

// API Endpoint to Save Text Selection Data
app.post("/api/save-text-selection", async (req, res) => {
    console.log("Received text selection data:", req.body); // Debugging line

    const { selectedText } = req.body;

    const newTextSelection = new TextSelection({
        selectedText
    });

    try {
        await newTextSelection.save();
        res.status(200).json({ message: "Text selection saved successfully" });
    } catch (err) {
        console.error("Error saving text selection:", err);
        res.status(500).json({ error: "Failed to save text selection data" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

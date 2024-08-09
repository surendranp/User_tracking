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
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 1000
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Connection error:", err);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB connection is open");
});

// Define Schemas and Models
const visitSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    clickCount: { type: Number, required: true },
    contactClicks: { type: Number, required: true },
    whatsappClicks: { type: Number, required: true },
    viewMoreClicks: { type: Number, required: true },
    textSelections: { type: Number, required: true }
});

const Visit = mongoose.model("Visit", visitSchema);

const textSelectionSchema = new mongoose.Schema({
    selectedText: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const TextSelection = mongoose.model("TextSelection", textSelectionSchema);

// API Endpoint to Save Visit Data
app.post("/api/save-visit", async (req, res) => {
    const { startTime, endTime, duration, clickCount, contactClicks, whatsappClicks, viewMoreClicks, textSelections } = req.body;

    const newVisit = new Visit({
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        clickCount,
        contactClicks,
        whatsappClicks,
        viewMoreClicks,
        textSelections
    });

    try {
        await newVisit.save();
        console.log("Visit data saved successfully");
        res.status(200).json({ message: "Visit data saved successfully" });
    } catch (err) {
        console.error("Error saving visit:", err);
        res.status(500).json({ error: "Failed to save visit data" });
    }
});

// API Endpoint to Save Text Selection Data
app.post("/api/save-text-selection", async (req, res) => {
    const { selectedText } = req.body;

    const newTextSelection = new TextSelection({
        selectedText
    });

    try {
        await newTextSelection.save();
        console.log("Text selection saved successfully");
        res.status(200).json({ message: "Text selection saved successfully" });
    } catch (err) {
        console.error("Error saving text selection:", err);
        res.status(500).json({ error: "Failed to save text selection data" });
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

// API Endpoint to Get Text Selection Data for Dashboard
app.get("/api/get-text-selections", async (req, res) => {
    try {
        const textSelections = await TextSelection.find({});
        res.status(200).json(textSelections);
    } catch (err) {
        console.error("Error retrieving text selections:", err);
        res.status(500).json({ error: "Failed to retrieve text selection data" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

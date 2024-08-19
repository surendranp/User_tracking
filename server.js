require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

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
    sessionId: { type: String, unique: true },
    startTime: Date,
    endTime: Date,
    duration: Number,
    clickCount: Number,
    whatsappClicks: Number,
    homeClicks: Number,
    aboutClicks: Number,
    contactNavClicks: Number,
    paverClick: Number,
    holloClick: Number,
    flyashClick: Number,
    qualityClick: Number,
    CareerClick: Number,
    QuoteClick: Number,
    productClick: Number,
    textSelections: Number,
    selectedTexts: [String] // Store selected texts as an array of strings
});

const Visit = mongoose.model("Visit", visitSchema);

const textSelectionSchema = new mongoose.Schema({
    sessionId: String,
    selectedText: String,
    timestamp: { type: Date, default: Date.now }
});

const TextSelection = mongoose.model("TextSelection", textSelectionSchema);

// API Endpoint to Save Visit Data
app.post("/api/save-visit", async (req, res) => {
    console.log("Received visit data:", req.body); // Debugging line

    const {
        sessionId,
        startTime,
        endTime,
        duration,
        clickCount,
        whatsappClicks,
        homeClicks,
        aboutClicks,
        contactNavClicks,
        paverClick,
        holloClick,
        flyashClick,
        qualityClick,
        CareerClick,
        QuoteClick,
        productClick,
        textSelections,
        selectedTexts
    } = req.body;

    try {
        const visit = await Visit.findOneAndUpdate(
            { sessionId }, // Find the document with the same sessionId
            {
                $set: { 
                    endTime: new Date(endTime),
                    duration,
                    clickCount,
                    whatsappClicks,
                    homeClicks,
                    aboutClicks,
                    contactNavClicks,
                    paverClick,
                    holloClick,
                    flyashClick,
                    qualityClick,
                    CareerClick,
                    QuoteClick,
                    productClick,
                    textSelections,
                    selectedTexts
                }
            },
            { upsert: true, new: true } // If not found, create a new document
        );

        res.status(200).json({ message: "Visit data saved successfully" });
    } catch (err) {
        console.error("Error saving visit:", err);
        res.status(500).json({ error: "Failed to save visit data" });
    }
});

// API Endpoint to Save Text Selection Data
app.post("/api/save-text-selection", async (req, res) => {
    console.log("Received text selection data:", req.body); // Debugging line

    const { sessionId, selectedText } = req.body;

    const newTextSelection = new TextSelection({
        sessionId,
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

// Routes to serve HTML pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API Endpoint to Track Navbar Button Clicks
app.post("/api/track-button-click", async (req, res) => {
    console.log("Received button click data:", req.body); // Debugging line

    const { sessionId, buttonName } = req.body;

    try {
        const update = {};
        if (buttonName === "home") {
            update.homeClicks = 1;
        } else if (buttonName === "about") {
            update.aboutClicks = 1;
        } else if (buttonName === "contact") {
            update.contactNavClicks = 1;
        }

        const visit = await Visit.findOneAndUpdate(
            { sessionId },
            { $inc: update },
            { upsert: true, new: true } // If not found, create a new document
        );

        res.status(200).json({ message: `${buttonName} button click tracked successfully` });
    } catch (err) {
        console.error("Error tracking button click:", err);
        res.status(500).json({ error: "Failed to track button click" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

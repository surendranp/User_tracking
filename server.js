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
    sessionId: { type: String, unique: true },
    startTime: Date,
    endTime: Date,
    duration: Number,
    clickCounts: {
        home: { type: Number, default: 0 },
        about: { type: Number, default: 0 },
        contact: { type: Number, default: 0 },
        enquiry: { type: Number, default: 0 },
        qualityControl: { type: Number, default: 0 },
        products: { type: Number, default: 0 }
    },
    textSelections: Number,
    selectedTexts: [String]
}, { timestamps: true });

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
        clickCounts,
        textSelections,
        selectedTexts
    } = req.body;

    try {
        let visit = await Visit.findOne({ sessionId });

        if (visit) {
            // Update existing visit document
            visit.endTime = new Date(endTime);
            visit.duration = duration;
            visit.clickCounts.home = clickCounts.home;
            visit.clickCounts.about = clickCounts.about;
            visit.clickCounts.contact = clickCounts.contact;
            visit.clickCounts.enquiry = clickCounts.enquiry;
            visit.clickCounts.qualityControl = clickCounts.qualityControl;
            visit.clickCounts.products = clickCounts.products;
            visit.textSelections = textSelections;
            visit.selectedTexts = selectedTexts;

            await visit.save();
            console.log("Updated visit document:", visit); // Debugging line
        } else {
            // Create a new visit document
            const newVisit = new Visit({
                sessionId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                duration,
                clickCounts,
                textSelections,
                selectedTexts
            });
            await newVisit.save();
            console.log("Created new visit document:", newVisit); // Debugging line
        }

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

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

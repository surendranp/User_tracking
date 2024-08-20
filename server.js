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
    homeClicks: Number,
    aboutClicks: Number,
    contactClicks: Number,
    enquiryClicks: Number,
    qualityClicks: Number,
    productsClicks: Number,
    textSelections: Number,
    selectedTexts: [String]
}, { timestamps: true });

const Visit = mongoose.model("Visit", visitSchema);

// API Endpoint to Save Visit Data
app.post("/api/save-visit", async (req, res) => {
    console.log("Received visit data:", req.body);

    const {
        sessionId,
        startTime,
        endTime,
        duration,
        homeClicks,
        aboutClicks,
        contactClicks,
        enquiryClicks,
        qualityClicks,
        productsClicks,
        textSelections,
        selectedTexts
    } = req.body;

    try {
        let visit = await Visit.findOne({ sessionId });

        if (visit) {
            // Update existing visit document
            visit.endTime = new Date(endTime);
            visit.duration = duration;
            visit.homeClicks = (visit.homeClicks || 0) + homeClicks;
            visit.aboutClicks = (visit.aboutClicks || 0) + aboutClicks;
            visit.contactClicks = (visit.contactClicks || 0) + contactClicks;
            visit.enquiryClicks = (visit.enquiryClicks || 0) + enquiryClicks;
            visit.qualityClicks = (visit.qualityClicks || 0) + qualityClicks;
            visit.productsClicks = (visit.productsClicks || 0) + productsClicks;
            visit.textSelections = (visit.textSelections || 0) + textSelections;
            visit.selectedTexts = visit.selectedTexts.concat(selectedTexts);

            await visit.save({ validateModifiedOnly: true });
        } else {
            // Create a new visit document
            const newVisit = new Visit({
                sessionId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                duration,
                homeClicks,
                aboutClicks,
                contactClicks,
                enquiryClicks,
                qualityClicks,
                productsClicks,
                textSelections,
                selectedTexts
            });
            await newVisit.save();
        }

        res.status(200).json({ message: "Visit data saved successfully" });
    } catch (err) {
        console.error("Error saving visit:", err);
        res.status(500).json({ error: "Failed to save visit data" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

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
    startTime: { type: Date, default: Date.now },
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
    selectedTexts: [String]
});

const Visit = mongoose.model("Visit", visitSchema);

// API Endpoint to Save Visit Data
app.post("/api/save-visit", async (req, res) => {
    const {
        sessionId,
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
        let visit = await Visit.findOne({ sessionId });

        if (visit) {
            // Update existing visit document
            visit.endTime = new Date(); // Update endTime to the current time
            visit.duration = Math.round((visit.endTime - visit.startTime) / 1000); // Calculate duration in seconds
            visit.clickCount = clickCount;
            visit.whatsappClicks = whatsappClicks;
            visit.homeClicks = homeClicks;
            visit.aboutClicks = aboutClicks;
            visit.contactNavClicks = contactNavClicks;
            visit.paverClick = paverClick;
            visit.holloClick = holloClick;
            visit.flyashClick = flyashClick;
            visit.qualityClick = qualityClick;
            visit.CareerClick = CareerClick;
            visit.QuoteClick = QuoteClick;
            visit.productClick = productClick;
            visit.textSelections = textSelections;
            visit.selectedTexts = selectedTexts;
        } else {
            // Create a new visit document
            visit = new Visit({
                sessionId,
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
            });
        }

        await visit.save();
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

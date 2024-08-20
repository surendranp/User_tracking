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
    clickCount: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },
    homeClicks: { type: Number, default: 0 },
    aboutClicks: { type: Number, default: 0 },
    contactNavClicks: { type: Number, default: 0 },
    paverClick: { type: Number, default: 0 },
    holloClick: { type: Number, default: 0 },
    flyashClick: { type: Number, default: 0 },
    qualityClick: { type: Number, default: 0 },
    CareerClick: { type: Number, default: 0 },
    QuoteClick: { type: Number, default: 0 },
    productClick: { type: Number, default: 0 }
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
        productClick
    } = req.body;

    try {
        await Visit.findOneAndUpdate(
            { sessionId },
            {
                $set: {
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
                    productClick
                }
            },
            { upsert: true } // Create a new document if none exists
        );
        res.status(200).json({ message: "Visit data saved successfully" });
    } catch (err) {
        console.error("Error saving visit:", err);
        res.status(500).json({ error: "Failed to save visit data" });
    }
});
// API Endpoint to Get Visit Data for a Session
app.get("/api/get-visit/:sessionId", async (req, res) => {
    const { sessionId } = req.params;

    try {
        const visit = await Visit.findOne({ sessionId });
        if (visit) {
            res.status(200).json(visit);
        } else {
            res.status(404).json(null);
        }
    } catch (err) {
        console.error("Error fetching visit data:", err);
        res.status(500).json({ error: "Failed to fetch visit data" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

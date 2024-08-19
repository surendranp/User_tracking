require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/userTrackingDB", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    maxPoolSize: 1000
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Connection error:", err);
});

const visitSchema = new mongoose.Schema({
    sessionId: { type: String, unique: true },
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

const textSelectionSchema = new mongoose.Schema({
    sessionId: String,
    selectedText: String,
    timestamp: { type: Date, default: Date.now }
});

const TextSelection = mongoose.model("TextSelection", textSelectionSchema);

app.post("/api/save-visit", async (req, res) => {
    console.log('Received visit data:', req.body);  // Debug log
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

app.post("/api/save-text-selection", async (req, res) => {
    console.log('Received text selection:', req.body);  // Debug log
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

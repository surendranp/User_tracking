const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

mongoose.connect("your_mongodb_connection_string", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
    selectedTexts: [String]
});

const Visit = mongoose.model("Visit", visitSchema);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/save-visit", async (req, res) => {
    const { sessionId, startTime, endTime, duration, clickCount, whatsappClicks, homeClicks, aboutClicks, contactNavClicks, paverClick, holloClick, flyashClick, qualityClick, CareerClick, QuoteClick, productClick, textSelections, selectedTexts } = req.body;

    try {
        const visit = await Visit.findOneAndUpdate(
            { sessionId },
            { 
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
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.json({ success: true, data: visit });
    } catch (err) {
        console.error("Error saving visit:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/api/save-text-selection", async (req, res) => {
    const { sessionId, selectedText } = req.body;

    try {
        const visit = await Visit.findOneAndUpdate(
            { sessionId },
            { $push: { selectedTexts: selectedText }, $inc: { textSelections: 1 } },
            { new: true }
        );
        res.json({ success: true, data: visit });
    } catch (err) {
        console.error("Error saving text selection:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

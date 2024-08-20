require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Session management with connect-mongo
const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/userTrackingDB",
    collectionName: 'sessions'
});

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
    cookie: { secure: false } // Set to true if using HTTPS
}));

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
    ipAddress: String,
    visitStart: Date,
    visitEnd: Date,
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
    textSelections: [String]
});

visitSchema.index({ sessionId: 1, ipAddress: 1 }, { unique: true });

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
        visitEnd
    } = req.body;

    const ipAddress = req.ip;

    try {
        let visit = await Visit.findOne({ sessionId, ipAddress });

        if (visit) {
            // Update existing visit document
            visit.visitEnd = new Date(visitEnd);
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
        } else {
            // Create a new visit document
            visit = new Visit({
                sessionId,
                ipAddress,
                visitStart: new Date(),
                visitEnd: new Date(visitEnd),
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
                textSelections
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

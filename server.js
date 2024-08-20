require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodeCron = require("node-cron");
const nodemailer = require("nodemailer");

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
    productClick: { type: Number, default: 0 },
    selectedTexts: { type: [String], default: [] } // New field to store selected text
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
        selectedTexts // Include selectedTexts in the request
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

            // Prevent duplicate text selections
            selectedTexts.forEach(text => {
                if (!visit.selectedTexts.includes(text)) {
                    visit.selectedTexts.push(text);
                }
            });

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
                selectedTexts: [...new Set(selectedTexts)] // Ensure uniqueness in initial array
            });
        }

        await visit.save();
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

// Function to send email with visit data
async function sendVisitDataEmail() {
    try {
        // Fetch all visit data
        const visits = await Visit.find();

        // Create a transporter for sending emails
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS  // Your email password or app password
            }
        });

        // Define the email content
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'surayrk315@gmail.com', // Replace with the recipient's email address
            subject: 'Automatic Visit Data Update',
            text: JSON.stringify(visits, null, 2) // Convert visit data to a readable format
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Visit data email sent successfully');
    } catch (err) {
        console.error("Error sending visit data email:", err);
    }
}

// Schedule a task to send visit data every minute
nodeCron.schedule('* * * * *', () => {
    sendVisitDataEmail();
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

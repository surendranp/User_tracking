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
    menu: { type: Number, default: 0 },
    home_Button_Clicks: { type: Number, default: 0 },
    about_Button_Clicks: { type: Number, default: 0 },
    contact_ButtonNav_Clicks: { type: Number, default: 0 },
    whatsapp_Button_Clicks: { type: Number, default: 0 },
    product_Button_Click: { type: Number, default: 0 },
    paverblock_Button_Click: { type: Number, default: 0 },
    holloblock_Button_Click: { type: Number, default: 0 },
    flyash_Button_Click: { type: Number, default: 0 },
    quality_Button_Click: { type: Number, default: 0 },
    Career_Button_Click: { type: Number, default: 0 },
    Quote_Button_Click: { type: Number, default: 0 },
   
    selectedTexts: { type: [String], default: [] } // New field to store selected text
});

const Visit = mongoose.model("Visit", visitSchema);

// API Endpoint to Save Visit Data
app.post("/api/save-visit", async (req, res) => {
    const {
        sessionId,
        menu,
        home_Button_Clicks,
        about_Button_Clicks,
        contact_ButtonNav_Clicks,
        whatsapp_Button_Clicks,
        product_Button_Click,
        paverblock_Button_Click,
        holloblock_Button_Click,
        flyash_Button_Click,
        quality_Button_Click,
        Career_Button_Click,
        Quote_Button_Click,
        
        selectedTexts // Include selectedTexts in the request
    } = req.body;

    try {
        // Use findOneAndUpdate to avoid version conflicts
        const visit = await Visit.findOneAndUpdate(
            { sessionId },
            {
                menu,
                home_Button_Clicks,
                about_Button_Clicks,
                contact_ButtonNav_Clicks,
                whatsapp_Button_Clicks,
                product_Button_Click,
                paverblock_Button_Click,
                holloblock_Button_Click,
                flyash_Button_Click,
                quality_Button_Click,
                Career_Button_Click,
                Quote_Button_Click,
                
                $addToSet: { selectedTexts: { $each: selectedTexts } } // Use $addToSet to avoid duplicates
            },
            { new: true, upsert: true } // Create a new document if not found
        );

        if (visit) {
            res.status(200).json({ message: "Visit data saved successfully" });
        } else {
            res.status(404).json({ error: "Failed to save visit data" });
        }
    } catch (err) {
        if (err.name === 'VersionError') {
            console.error("VersionError:", err);
            // Retry logic can be added here if necessary
        } else {
            console.error("Error saving visit:", err);
        }
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

        // Log visit data
        console.log('Fetched visits:', visits);

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
        let info = await transporter.sendMail(mailOptions);
        console.log('Visit data email sent successfully:', info.response);
    } catch (err) {
        console.error("Error sending visit data email:", err);
    }
}

// Schedule a task to send visit data every 12 hours
nodeCron.schedule('0 */12 * * *', () => {
    console.log('Executing cron job to send visit data email');
    sendVisitDataEmail();
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodeCron = require("node-cron");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");

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
    selectedTexts: { type: [String], default: [] }
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
        selectedTexts
    } = req.body;

    try {
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
                $addToSet: { selectedTexts: { $each: selectedTexts } }
            },
            { new: true, upsert: true }
        );

        if (visit) {
            res.status(200).json({ message: "Visit data saved successfully" });
        } else {
            res.status(404).json({ error: "Failed to save visit data" });
        }
    } catch (err) {
        if (err.name === 'VersionError') {
            console.error("VersionError:", err);
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
        const visits = await Visit.find();
        const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"); // Current time in IST

        // Create table rows
        const tableRows = `
            <tr><td>Home Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.home_Button_Clicks, 0)}</td></tr>
            <tr><td>About Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.about_Button_Clicks, 0)}</td></tr>
            <tr><td>Contact Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.contact_ButtonNav_Clicks, 0)}</td></tr>
            <tr><td>Whatsapp Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.whatsapp_Button_Clicks, 0)}</td></tr>
            <tr><td>Product Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.product_Button_Click, 0)}</td></tr>
            <tr><td>Paverblock Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.paverblock_Button_Click, 0)}</td></tr>
            <tr><td>Holloblock Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.holloblock_Button_Click, 0)}</td></tr>
            <tr><td>Flyash Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.flyash_Button_Click, 0)}</td></tr>
            <tr><td>Quality Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.quality_Button_Click, 0)}</td></tr>
            <tr><td>Career Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.Career_Button_Click, 0)}</td></tr>
            <tr><td>Quote Button Clicks</td><td>${visits.reduce((acc, visit) => acc + visit.Quote_Button_Click, 0)}</td></tr>
        `;

        // Create transporter for sending emails
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Define the email content
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'surayrk315@gmail.com', // Replace with the recipient's email address
            subject: 'Automatic Visit Data Update',
            html: `
                <h1> Users Visit Data Report for Dhaya Industries</h1>
                <table border="1" style="border-collapse: collapse; width: 100%;">
                    <thead>
                        <tr>
                            <th>Events</th>
                            <th>Click Counts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <p>From Date: ${moment().startOf('day').format("YYYY-MM-DD")}</p>
                <p>To Date: ${moment().format("YYYY-MM-DD")}</p>
                <p>Time: ${now} IST</p>
            `
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Visit data email sent successfully:', info.response);
    } catch (err) {
        console.error("Error sending visit data email:", err);
    }
}

// Schedule a task to send visit data every 1 minute
nodeCron.schedule('15 12 * * * *', () => {
    console.log('Executing cron job to send visit data email');
    sendVisitDataEmail();
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

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
    selectedTexts: { type: [String], default: [] },
    visitTime: { type: Date, default: Date.now }
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
                $addToSet: { selectedTexts: { $each: selectedTexts } },
                visitTime: new Date()
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

// Function to send email with visit data
async function sendVisitDataEmail() {
    try {
        // Calculate the time range for the previous day from 7:00 AM to today at 7:00 AM
        const startTime = moment().tz("Asia/Kolkata").subtract(1, 'days').set({ hour: 7, minute: 0, second: 0, millisecond: 0 }).toDate();
        const endTime = moment().tz("Asia/Kolkata").set({ hour: 7, minute: 0, second: 0, millisecond: 0 }).toDate();

        // Fetch visits within the specified time range
        const visits = await Visit.find({ visitTime: { $gte: startTime, $lt: endTime } });

        // Count unique users and total page visits
        const uniqueUsers = new Set(visits.map(visit => visit.sessionId)).size;
        const totalPageVisits = visits.length;

        // Create table rows for the email
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
            subject: 'Daily Visit Data Report',
            html: `
                <h1>Daily Visit Data Report</h1>
                <p>Total Unique Users: ${uniqueUsers}</p>
                <p>Total Page Visits: ${totalPageVisits}</p>
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
                <p>From Date: ${moment(startTime).format("YYYY-MM-DD HH:mm:ss")} IST</p>
                <p>To Date: ${moment(endTime).format("YYYY-MM-DD HH:mm:ss")} IST</p>
            `
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Visit data email sent successfully:', info.response);
    } catch (err) {
        console.error("Error sending visit data email:", err);
    }
}

// Schedule a task to send visit data email at 7:15 AM daily
nodeCron.schedule('0  */1 * *', () => {
    console.log('Executing cron job to send daily visit data email');
    sendVisitDataEmail();
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

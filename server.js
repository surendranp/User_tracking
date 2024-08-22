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

// Function to send email with visit data
async function sendVisitDataEmail() {
    try {
        const startTime = moment().tz("Asia/Kolkata").startOf('day').subtract(1, 'day').format();
        const endTime = moment().tz("Asia/Kolkata").startOf('day').format();

        console.log(`Fetching data from ${startTime} to ${endTime}`);

        const visits = await Visit.find({
            visitTime: { $gte: new Date(startTime), $lt: new Date(endTime) }
        }).exec();

        console.log(`Visits found: ${visits.length}`);
        console.log(visits); // Log fetched visits

        if (visits.length === 0) {
            console.log("No visit data found for the specified period.");
            return;
        }

        const totalUsers = visits.length;
        const totalPagesViewed = visits.reduce((acc, visit) => 
            acc + visit.home_Button_Clicks +
            visit.about_Button_Clicks +
            visit.contact_ButtonNav_Clicks +
            visit.whatsapp_Button_Clicks +
            visit.product_Button_Click +
            visit.paverblock_Button_Click +
            visit.holloblock_Button_Click +
            visit.flyash_Button_Click +
            visit.quality_Button_Click +
            visit.Career_Button_Click +
            visit.Quote_Button_Click, 0);

        console.log("Total Users:", totalUsers);
        console.log("Total Pages Viewed:", totalPagesViewed);

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

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'surayrk315@gmail.com', // Replace with the recipient's email address
            subject: 'Automatic Visit Data Update',
            html: `
                <h1>Users Visit Data Report for Dhaya Industries</h1>
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
                <p>Total Users: ${totalUsers}</p>
                <p>Total Pages Viewed: ${totalPagesViewed}</p>
                <p>From Date: ${moment(startTime).format("YYYY-MM-DD")}</p>
                <p>To Date: ${moment(endTime).format("YYYY-MM-DD")}</p>
                <p>Time: ${moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")} IST</p>
            `
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Visit data email sent successfully:', info.response);
    } catch (err) {
        console.error("Error sending visit data email:", err);
    }
}

// Schedule a task to send visit data every day at 7:15 AM
nodeCron.schedule('* * * * *', () => {
    console.log('Executing cron job to send visit data email');
    sendVisitDataEmail();
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

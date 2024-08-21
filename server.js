require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const schedule = require('node-schedule'); // Use node-schedule instead of node-cron

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
            visit.clickCount = clickCount || visit.clickCount;
            visit.whatsappClicks = whatsappClicks || visit.whatsappClicks;
            visit.homeClicks = homeClicks || visit.homeClicks;
            visit.aboutClicks = aboutClicks || visit.aboutClicks;
            visit.contactNavClicks = contactNavClicks || visit.contactNavClicks;
            visit.paverClick = paverClick || visit.paverClick;
            visit.holloClick = holloClick || visit.holloClick;
            visit.flyashClick = flyashClick || visit.flyashClick;
            visit.qualityClick = qualityClick || visit.qualityClick;
            visit.CareerClick = CareerClick || visit.CareerClick;
            visit.QuoteClick = QuoteClick || visit.QuoteClick;
            visit.productClick = productClick || visit.productClick;

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
                clickCount: clickCount || 0,
                whatsappClicks: whatsappClicks || 0,
                homeClicks: homeClicks || 0,
                aboutClicks: aboutClicks || 0,
                contactNavClicks: contactNavClicks || 0,
                paverClick: paverClick || 0,
                holloClick: holloClick || 0,
                flyashClick: flyashClick || 0,
                qualityClick: qualityClick || 0,
                CareerClick: CareerClick || 0,
                QuoteClick: QuoteClick || 0,
                productClick: productClick || 0,
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

        // Generate HTML table with separate rows for each button
        const tableRows = `
            <tr><td>Home</td><td>${visits.reduce((sum, visit) => sum + visit.homeClicks, 0)}</td></tr>
            <tr><td>About</td><td>${visits.reduce((sum, visit) => sum + visit.aboutClicks, 0)}</td></tr>
            <tr><td>Contact</td><td>${visits.reduce((sum, visit) => sum + visit.contactNavClicks, 0)}</td></tr>
            <tr><td>Paver</td><td>${visits.reduce((sum, visit) => sum + visit.paverClick, 0)}</td></tr>
            <tr><td>Hollow</td><td>${visits.reduce((sum, visit) => sum + visit.holloClick, 0)}</td></tr>
            <tr><td>Flyash</td><td>${visits.reduce((sum, visit) => sum + visit.flyashClick, 0)}</td></tr>
            <tr><td>Quality</td><td>${visits.reduce((sum, visit) => sum + visit.qualityClick, 0)}</td></tr>
            <tr><td>Career</td><td>${visits.reduce((sum, visit) => sum + visit.CareerClick, 0)}</td></tr>
            <tr><td>Quote</td><td>${visits.reduce((sum, visit) => sum + visit.QuoteClick, 0)}</td></tr>
            <tr><td>Product</td><td>${visits.reduce((sum, visit) => sum + visit.productClick, 0)}</td></tr>
            <tr><td>Whatsapp</td><td>${visits.reduce((sum, visit) => sum + visit.whatsappClicks, 0)}</td></tr>
            <tr>
            <td>${new Date().toLocaleDateString()}</td>
            <td>${new Date().toLocaleDateString()}</td>
              <td>${new Date().toLocaleTimeString()}</td>
              </tr>
        `;

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
            html: `
                <h1>Visit Data Report</h1>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Events</th>
                            <th>ClickCounts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Visit data email sent successfully:', info.response);
    } catch (err) {
        console.error("Error sending visit data email:", err);
    }
}
// Schedule a task to send visit data every 12 hours using node-schedule
schedule.scheduleJob('* * * *', () => {
    console.log('Executing cron job to send visit data email');
    sendVisitDataEmail();
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

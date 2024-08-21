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

        // Generate HTML table
        const tableRows = visits.map(visit => {
            return `
                <tr>
                    <td>Home, About, Contact, Paver, Hollow, Flyash, Quality, Career, Quote, Product, Whatsapp</td>
                    <td>${visit.homeClicks}, ${visit.aboutClicks}, ${visit.contactNavClicks}, ${visit.paverClick}, ${visit.holloClick}, ${visit.flyashClick}, ${visit.qualityClick}, ${visit.CareerClick}, ${visit.QuoteClick}, ${visit.productClick}, ${visit.whatsappClicks}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                    <td>${new Date().toLocaleTimeString()}</td>
                </tr>
            `;
        }).join('');

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
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Time</th>
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

// Schedule a task to send visit data every 12 hours
nodeCron.schedule('* * * *', () => {
    console.log('Executing cron job to send visit data email');
    sendVisitDataEmail();
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose schema and model for tracking interactions
const interactionSchema = new mongoose.Schema({
    eventType: String,
    buttonText: String,
    clickTime: Date,
    selectedText: String,
    selectionTime: Date,
    visitStartTime: Date,
    visitEndTime: Date
});

const Interaction = mongoose.model('Interaction', interactionSchema);

// Endpoint to track user interactions
app.post('/track', async (req, res) => {
    try {
        const interaction = new Interaction(req.body);
        await interaction.save();
        res.status(200).send('Interaction recorded');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error recording interaction');
    }
});

// Serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB and start the server
mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
    .catch(err => console.error(err));

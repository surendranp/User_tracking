const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema and model for tracking user interactions
const visitSchema = new mongoose.Schema({
  path: String,
  timestamp: { type: Date, default: Date.now }
});
const Visit = mongoose.model('Visit', visitSchema);

const textSelectionSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now }
});
const TextSelection = mongoose.model('TextSelection', textSelectionSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Track page visits
app.post('/trackVisit', async (req, res) => {
  try {
    const { path } = req.body;
    await new Visit({ path }).save();
    res.status(200).send('Visit tracked');
  } catch (error) {
    res.status(500).send('Error tracking visit');
  }
});

// Track text selections
app.post('/trackTextSelection', async (req, res) => {
  try {
    const { content } = req.body;
    await new TextSelection({ content }).save();
    res.status(200).send('Text selection tracked');
  } catch (error) {
    res.status(500).send('Error tracking text selection');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

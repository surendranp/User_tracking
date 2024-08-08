require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connection successful!");
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

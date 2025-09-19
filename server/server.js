const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// --- THIS IS THE UPDATED CORS CONFIGURATION ---

// 1. Define the allowed origin
const allowedOrigin = "https://eco-shakti.netlify.app";

// 2. Add a console.log to verify the code is updated on Render
console.log("CORS configured to allow origin:", allowedOrigin);

// 3. Create a more robust CORS options object
const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all common methods
  credentials: true, // Important for auth
  optionsSuccessStatus: 204 // For legacy browser support
};

// 4. Use the CORS options
app.use(cors(corsOptions));

// --- END OF CORS CONFIGURATION ---


app.use(express.json());

// --- ADD THIS NEW HEALTH CHECK / WAKE-UP ROUTE ---
app.get('/api/health', (req, res) => {
  res.status(200).send({ status: 'awake' });
});


// Routes
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("Could not connect to MongoDB:", err.message);
        process.exit(1);
    });
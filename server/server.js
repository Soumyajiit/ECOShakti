const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORRECT CORS CONFIGURATION ---

// PLEASE COPY THIS LINE CAREFULLY
const allowedOrigin = "https://eco-shakti.netlify.app";

// Console log to verify the change on Render
console.log("CORS configured for specific origin:", allowedOrigin);

const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// --- END OF CORS CONFIGURATION ---

app.use(express.json());

// Health check / Wake-up route
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
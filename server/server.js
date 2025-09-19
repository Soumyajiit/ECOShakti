const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors'); // We are no longer using this package
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;


// --- NEW MANUAL CORS MIDDLEWARE ---
app.use((req, res, next) => {
  const allowedOrigin = "https://eco-shakti.netlify.app";
  console.log(`Incoming request origin: ${req.headers.origin}`); // Log the origin for every request
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization'); // Added Authorization header
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Intercept the preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('Responding to OPTIONS preflight request');
    return res.sendStatus(204); // Respond with 204 No Content
  }

  next();
});
// --- END OF MIDDLEWARE ---


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
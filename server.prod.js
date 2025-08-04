const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// API Routes
app.use('/api', require('./routes/api'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

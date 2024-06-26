const express = require('express');
const mongoose = require('mongoose');

// Temporarily set environment variables here
process.env.NODE_ENV = 'development';
process.env.PORT = 5000;
process.env.MONGO_URI =
  'mongodb+srv://lyrenee02:cop4331project@cluster.muwwbsd.mongodb.net/?retryWrites=true&w=majority&appName=cluster';

const app = express();

app.use(express.json());

mongoose.set('strictQuery', true);

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
}

// Routes
app.use('/api/auth', require('./routes/auth')); // Use the authentication routes
app.use('/api/party', require('./routes/party')); // Use the party routes

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // Export the app for testing

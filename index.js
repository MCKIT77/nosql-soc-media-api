const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes'); // Import your API routes

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes); // Use your API routes

// Connect to MongoDB
mongoose.connect('mongodb://localhost/social-network', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});
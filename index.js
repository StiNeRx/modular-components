/*
================================================================================
File: /index.js
Description: Main Server File
Initializes the Express server, applies middleware, and mounts the API routes.
================================================================================
*/
const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Enable parsing of JSON request bodies
app.use(express.json());

// --- API Routes ---
// Mount the appointment-related routes under the '/api' path
app.use('/api', appointmentRoutes);

// --- Server Startup ---
// We export the app to make it accessible to our test files
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log('API Endpoints:');
        console.log('  - [POST] /api/availability    (Admin: Set available slots - Auth Bypassed)');
        console.log('  - [GET]  /api/slots            (User: Get all available slots)');
        console.log('  - [POST] /api/slots/:id/book   (User: Temporarily book a slot)');
        console.log('  - [POST] /api/slots/:id/confirm (User: Confirm a pending booking)');
    });
}

module.exports = app; // Export for testing
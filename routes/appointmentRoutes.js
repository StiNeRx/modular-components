/*
================================================================================
File: /routes/appointmentRoutes.js
Description: Defines API routes, applies middleware for validation and auth, 
             and maps them to controllers.
================================================================================
*/
const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");
const { isAdmin } = require("../middleware/auth");
const { validateAvailability } = require("../middleware/vallidators");

// Route for admin to set their availability.
// `isAdmin` middleware is present but currently bypassed for development.
router.post(
  "/availability",
  isAdmin,
  validateAvailability,
  appointmentController.setAvailability
);

// Route for users to get all available appointment slots
router.get("/slots", appointmentController.getAvailableSlots);

// Route for a user to temporarily book a specific slot
router.post("/slots/:id/book", appointmentController.bookSlot);

// Route for a user to confirm a booking after payment
router.post("/slots/:id/confirm", appointmentController.confirmBooking);

module.exports = router;

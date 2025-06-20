/*
================================================================================
File: /controllers/appointmentController.js
Description: Handles incoming HTTP requests, calls service functions, and 
             sends the response. No changes from original.
================================================================================
*/
const appointmentService = require("../services/appointmentServices");

const setAvailability = async (req, res) => {
  try {
    const { date, timeRanges } = req.body;
    const slots = await appointmentService.createAvailability(date, timeRanges);
    res
      .status(201)
      .json({
        message: "Availability set successfully.",
        slotsCreated: slots.length,
      });
  } catch (error) {
    console.error("Error in setAvailability controller:", error);
    res
      .status(500)
      .json({ message: "Error setting availability", error: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const availableSlots = await appointmentService.fetchAvailableSlots();
    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error in getAvailableSlots controller:", error);
    res
      .status(500)
      .json({
        message: "Error fetching available slots",
        error: error.message,
      });
  }
};

const bookSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await appointmentService.requestSlotBooking(id);

    if (!result.success) {
      return res.status(409).json({ message: result.message });
    }

    res.status(200).json({
      message: result.message,
      slotId: result.slotId,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error("Error in bookSlot controller:", error);
    res
      .status(500)
      .json({ message: "Error booking slot", error: error.message });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await appointmentService.confirmSlotBooking(id);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({ message: result.message, slot: result.slot });
  } catch (error) {
    console.error("Error in confirmBooking controller:", error);
    res
      .status(500)
      .json({ message: "Error confirming booking", error: error.message });
  }
};

module.exports = {
  setAvailability,
  getAvailableSlots,
  bookSlot,
  confirmBooking,
};

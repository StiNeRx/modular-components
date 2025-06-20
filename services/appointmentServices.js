/*
================================================================================
File: /services/appointmentService.js
Description: Contains the core business logic. Now uses a JSON file for 
             data persistence instead of an in-memory object.
================================================================================
*/
const fs = require('fs').promises;
const path = require('path');

// Path to the JSON file that acts as our database
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

// --- Helper Functions to Interact with JSON DB ---

/**
 * Reads the entire database from the JSON file.
 * @returns {Promise<object>} A promise that resolves to the parsed DB object.
 */
const readDB = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return a default structure
        if (error.code === 'ENOENT') {
            return { slots: [] };
        }
        throw error;
    }
};

/**
 * Writes the entire database object to the JSON file.
 * @param {object} data - The database object to write.
 * @returns {Promise<void>}
 */
const writeDB = async (data) => {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 4), 'utf8');
};


// --- Core Service Logic ---

const SLOT_DURATION_MINS = 30;
const BOOKING_LOCK_TIME_MINS = 5;

const generateSlotsForRange = (date, timeRange) => {
    // ... (This function is unchanged)
    const slots = [];
    const { start, end } = timeRange;
    let currentTime = new Date(`${date}T${start}:00`);
    const endTime = new Date(`${date}T${end}:00`);

    while (currentTime < endTime) {
        const slotTime = currentTime.toTimeString().substring(0, 5);
        slots.push({
            id: `${date}T${slotTime}`,
            date: date,
            time: slotTime,
            status: 'available', // available, pending, booked
            lockExpiresAt: null,
            customer: null, // To store customer info
        });
        currentTime.setMinutes(currentTime.getMinutes() + SLOT_DURATION_MINS);
    }
    return slots;
};

const createAvailability = async (date, timeRanges) => {
    const DB = await readDB();
    // Filter out any old slots for the given date to prevent duplicates
    DB.slots = DB.slots.filter(slot => slot.date !== date);
    
    let newSlots = [];
    timeRanges.forEach(range => {
        const generatedSlots = generateSlotsForRange(date, range);
        newSlots = [...newSlots, ...generatedSlots];
    });
    
    DB.slots.push(...newSlots);
    DB.slots.sort((a, b) => new Date(a.id) - new Date(b.id)); // Sort all slots chronologically
    
    await writeDB(DB);
    return newSlots;
};


const fetchAvailableSlots = async () => {
    const DB = await readDB();
    const now = new Date();

    // Reset expired pending locks
    let dbWasModified = false;
    DB.slots.forEach(slot => {
        if (slot.status === 'pending' && slot.lockExpiresAt && new Date(slot.lockExpiresAt) < now) {
            slot.status = 'available';
            slot.lockExpiresAt = null;
            dbWasModified = true;
            console.log(`Slot ${slot.id} lock expired. Reset to available.`);
        }
    });

    // If we made changes, write them back to the file
    if (dbWasModified) {
        await writeDB(DB);
    }

    // Filter for slots that are available and in the future
    return DB.slots.filter(slot => {
        const slotTime = new Date(slot.id);
        return slot.status === 'available' && slotTime > now;
    });
};

const requestSlotBooking = async (slotId) => {
    const DB = await readDB();
    const slot = DB.slots.find(s => s.id === slotId);

    if (!slot) {
        return { success: false, message: 'Slot not found.' };
    }

    const now = new Date();
    if (new Date(slot.id) <= now) {
        return { success: false, message: 'This slot is in the past and can no longer be booked.' };
    }

    if (slot.status !== 'available') {
        return { success: false, message: 'This slot is not available for booking.' };
    }

    slot.status = 'pending';
    const lockTime = new Date();
    lockTime.setMinutes(lockTime.getMinutes() + BOOKING_LOCK_TIME_MINS);
    slot.lockExpiresAt = lockTime.toISOString();
    
    // We don't need setTimeout anymore because fetchAvailableSlots handles expired locks.
    // This is more robust and stateless.
    await writeDB(DB);

    return {
        success: true,
        message: `Slot reserved for ${BOOKING_LOCK_TIME_MINS} minutes. Please complete payment to confirm.`,
        slotId: slot.id,
        expiresAt: slot.lockExpiresAt
    };
};


const confirmSlotBooking = async (slotId) => {
    const DB = await readDB();
    const slot = DB.slots.find(s => s.id === slotId);

    if (!slot) {
        return { success: false, message: 'Slot not found.' };
    }

    const now = new Date();
    if (slot.status !== 'pending' || (slot.lockExpiresAt && new Date(slot.lockExpiresAt) < now)) {
         if (slot.status === 'booked') {
            return { success: false, message: 'This slot has already been booked.' };
        }
        return { success: false, message: 'This slot is not pending confirmation or its lock has expired. Please try booking again.' };
    }
    
    slot.status = 'booked';
    slot.lockExpiresAt = null;
    
    await writeDB(DB);

    return { success: true, message: 'Booking confirmed successfully.', slot };
};

module.exports = {
    createAvailability,
    fetchAvailableSlots,
    requestSlotBooking,
    confirmSlotBooking
};
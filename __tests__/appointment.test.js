/*
================================================================================
File: /__tests__/appointment.test.js
Description: Jest test suite for the appointment API endpoints.
             Create a '__tests__' folder in your root directory and place this file inside.
================================================================================
*/
const request = require('supertest');
const app = require('../index'); // Import your express app
const path = require('path');
const fs = require('fs').promises;

// Path to the test database
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

// Get a future date for testing
const getFutureDate = (daysToAdd = 1) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

describe('Appointment API', () => {
    const testDate = getFutureDate(5);

    // Before each test, reset the database to a clean state
    beforeEach(async () => {
        const initialData = { slots: [] };
        await fs.writeFile(dbPath, JSON.stringify(initialData, null, 4));
    });

    // Test Admin Route: Set Availability
    describe('POST /api/availability', () => {
        it('should create new slots for a given date and return 201', async () => {
            const res = await request(app)
                .post('/api/availability')
                .send({
                    date: testDate,
                    timeRanges: [
                        { start: '09:00', end: '10:00' },
                        { start: '14:00', end: '15:30' }
                    ]
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Availability set successfully.');
            expect(res.body.slotsCreated).toBe(5); // 2 from first range, 3 from second
        });

        it('should return 400 for invalid request body', async () => {
            const res = await request(app)
                .post('/api/availability')
                .send({
                    date: 'not-a-date',
                    timeRanges: [{ start: '9', end: '10:00' }]
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Validation Error');
        });
    });

    // Test User Routes: Get, Book, Confirm
    describe('User Slot Management', () => {
        let availableSlotId;
        
        // Before these tests, populate the DB with some slots
        beforeEach(async () => {
            await request(app)
                .post('/api/availability')
                .send({
                    date: testDate,
                    timeRanges: [{ start: '10:00', end: '11:00' }]
                });
            availableSlotId = `${testDate}T10:00`;
        });

        // Test GET /api/slots
        it('GET /slots - should retrieve all available slots', async () => {
            const res = await request(app).get('/api/slots');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].id).toBe(availableSlotId);
            expect(res.body[0].status).toBe('available');
        });

        // Test POST /api/slots/:id/book
        it('POST /slots/:id/book - should temporarily book an available slot', async () => {
            const res = await request(app).post(`/api/slots/${availableSlotId}/book`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toContain('Slot reserved');
            expect(res.body.slotId).toBe(availableSlotId);
            
            // Verify the slot is now pending
            const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
            const slot = db.slots.find(s => s.id === availableSlotId);
            expect(slot.status).toBe('pending');
        });

        it('POST /slots/:id/book - should fail to book an already booked slot', async () => {
            // First, book it
            await request(app).post(`/api/slots/${availableSlotId}/book`);
            
            // Then, try to book it again
            const res = await request(app).post(`/api/slots/${availableSlotId}/book`);
            expect(res.statusCode).toEqual(409);
            expect(res.body.message).toBe('This slot is not available for booking.');
        });
        
        // Test POST /api/slots/:id/confirm
        it('POST /slots/:id/confirm - should confirm a pending booking', async () => {
            // 1. Book the slot to make it 'pending'
            await request(app).post(`/api/slots/${availableSlotId}/book`);

            // 2. Confirm the booking
            const res = await request(app).post(`/api/slots/${availableSlotId}/confirm`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Booking confirmed successfully.');
            expect(res.body.slot.status).toBe('booked');
            
            // Verify the slot is now booked in the DB
            const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
            const slot = db.slots.find(s => s.id === availableSlotId);
            expect(slot.status).toBe('booked');
        });

        it('POST /slots/:id/confirm - should fail to confirm a non-pending slot', async () => {
            // Try to confirm a slot that is still 'available'
            const res = await request(app).post(`/api/slots/${availableSlotId}/confirm`);
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('not pending confirmation');
        });
    });
});
/*
================================================================================
File: /middleware/validators.js
Description: Middleware for request body validation using Joi.
             No changes from original.
================================================================================
*/
const Joi = require('joi');

const availabilitySchema = Joi.object({
    date: Joi.string().isoDate().required().messages({
        'string.isoDate': 'Date must be in YYYY-MM-DD format.',
        'any.required': 'Date is a required field.'
    }),
    timeRanges: Joi.array().items(
        Joi.object({
            start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:mm format
            end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
        })
    ).min(1).required().messages({
        'array.min': 'At least one time range is required.',
        'any.required': 'timeRanges is a required field.'
    })
});

const validateAvailability = (req, res, next) => {
    const { error } = availabilitySchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorDetails = error.details.map(d => d.message.replace(/["']/g, ''));
        return res.status(400).json({ message: 'Validation Error', details: errorDetails });
    }
    next();
};

module.exports = { validateAvailability };
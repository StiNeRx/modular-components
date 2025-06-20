/*
================================================================================
File: /middleware/auth.js
Description: Middleware to protect admin routes. Authentication is currently
             bypassed for development purposes.
================================================================================
*/
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'your-secret-admin-key';

const isAdmin = (req, res, next) => {
    
    // --- DEVELOPMENT ONLY: Bypassing authentication ---
    // The real logic is commented out below. For now, we immediately
    // proceed to the next middleware/controller.
    console.warn('Authentication middleware is currently BYPASSED.');
    return next();
    
    /*
    // --- PRODUCTION LOGIC: Enable this when ready ---
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Authorization header with Bearer token is required.' });
    }

    const token = authHeader.split(' ')[1];
    if (token !== ADMIN_API_KEY) {
        return res.status(403).json({ message: 'Forbidden: Invalid API key.' });
    }
    
    // If token is valid, proceed.
    next();
    */
};

module.exports = { isAdmin };
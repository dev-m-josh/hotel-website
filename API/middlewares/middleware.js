const { json } = require('express');
const jwt = require('jsonwebtoken');

// VERIFY TOKEN
function verifyToken(req, res, next) {
    try {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader) {
            // SPLIT bearerHeader AND GET THE TOKEN ONLY
            const token = bearerHeader.split(' ')[1];
            let verification = jwt.verify(token, 'youcanguessthisright');
            req.user = verification;
            next();    
        } else {
            // Token not found, send a 401 Unauthorized error
            const error = new Error("No token found!");
            error.status = 401;
            next(error);
        }
    } catch (error) {
        // Handle errors related to token verification, like invalid token
        error.status = 400;
        error.message = "Token is invalid or expired";
        next(error);
    }
}

// Handle error for undefined routes
function routesErrorHandler(req, res, next) {
    const error = new Error("Route not defined!");
    error.status = 404;  // Not Found
    next(error);
}

// Handle all errors
function errorHandler(err, req, res, next) {
    res.sendStatus(err.status)
}

module.exports = { verifyToken, routesErrorHandler, errorHandler };

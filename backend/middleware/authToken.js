

// middleware/authToken.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from authorization header
    if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// Export the middleware
module.exports = authenticateToken;

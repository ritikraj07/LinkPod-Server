const jwt = require('jsonwebtoken');
const config = require('../Config');
const secret = config.JWT_SECRET_KEY

const activeSessions = new Map();

const generateAccessToken = (payload) => {
    // If payload is not provided, throw an error
    if (!payload) {
        throw new Error('Payload is required for generating access token');
    }

    return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '1d' });
};


const generateRefreshToken = (payload) => {
    console.log('===payload rt', payload)
    return jwt.sign(payload, secret, { algorithm: 'HS256',expiresIn: '7d',});
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secret);
        return {
            valid: true,
            payload: decoded,
            isTokenExpiringSoon: isTokenExpiringSoon(token)
        };
    } catch (error) {
        return {
            valid: false,
            error: 'Token invalid or expired'
        };
    }
};



function isTokenExpiringSoon(token, thresholdInDays = 1) {
    // Decode the token to extract the expiration time
    const decodedToken = jwt.decode(token);

    // Calculate the remaining time until expiration (in seconds)
    const currentTime = Date.now() / 1000; // Convert to seconds
    const expirationTime = decodedToken.exp;
    const expiresIn = expirationTime - currentTime;

    // Convert threshold to seconds
    const thresholdInSeconds = thresholdInDays * 24 * 60 * 60;

    // Check if token is expiring within the threshold
    return expiresIn <= thresholdInSeconds;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    isTokenExpiringSoon
};

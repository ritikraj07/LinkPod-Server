let config = {
    DATA_BASE_URI: process.env.MONGODB_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    SCOPE: process.env.SCOPE,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    REDIRECT_URI: process.env.REDIRECT_URI,
    FRONTEND_URL: process.env.FRONTEND_URL
}


module.exports = config;
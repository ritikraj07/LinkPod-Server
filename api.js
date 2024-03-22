// Import required modules
require('dotenv').config({ path: './env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const ConnectDatabase = require('./DB');
const userRouter = require('./Router/User.Router');
const PodRouter = require('./Router/Pod.Router');
const PostRouter = require('./Router/Post.Router');
const config = require('./Config');

// Create Express app
const app = express();

// Configure CORS
const corsOptions = {
    // Set origin to the specific frontend URL, or '*' if it's applicable
    origin: config.FRONTEND_URL,
    credentials: true,
    // Add the following line to include the required headers for CORS
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.set('trust proxy', true);
app.use(require('express-status-monitor')())
// Configure headers for CORS
app.use((req, res, next) => {
    const allowedDomains = ['https://linkpod.onrender.com', 'https://extinct-duck-cap.cyclic.app/']; // List of allowed domains

    const origin = req.headers.origin; // Get the origin from the request headers
    console.log(origin, "origin")
    // Check if the origin is in the list of allowed domains
    if (allowedDomains.includes(origin)) {
        // Set the Access-Control-Allow-Origin header to allow requests from the origin
        res.setHeader('Access-Control-Allow-Origin', origin);
        // Set other CORS headers as needed
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Continue processing the request
        next();
    } else {
        // Return an error response if the origin is not allowed
        return res.status(403).json({ error: 'Forbidden: Origin not allowed' });
    }
});

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// Configure logging
app.use(morgan('tiny'));

// Serve static files
app.use(express.static('Static'));

// Define routes
app.get('/', (req, res) => {
    res.send(`<div style="margin: auto" >
        <h1> Welcome to Linkpod </h1>
        <p> Click here to <a href="/index">read</a> documents </p>
    </div>`);
});

app.get('/docs', (req, res) => {
    res.sendFile('index.html', { root: 'Static' });
});

// Define API routes
app.use('/api/user', userRouter);
app.use('/api/pod', PodRouter);
app.use('/api/post', PostRouter);

// Connect to the database and start the server
let PORT = process.env.PORT || 8000;
ConnectDatabase()
    .then(() => {
        app.listen(PORT);
        console.log('Server Started at ' + PORT);
    })
    .catch((error) => console.log('Error==>', error));

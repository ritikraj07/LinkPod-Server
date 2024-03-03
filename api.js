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

// Configure headers for CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://linkpod.onrender.com');
    // Set Access-Control-Allow-Origin header to the requesting origin
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    // Add the following line to allow sending additional headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
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
ConnectDatabase()
    .then(() => {
        app.listen(8000);
        console.log('Server Started at 8000');
    })
    .catch((error) => console.log('Error==>', error));

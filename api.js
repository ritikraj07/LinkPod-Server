require('dotenv').config({ path: './env' })
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const ConnectDatabase = require('./DB');
const userRouter = require('./Router/User.Router');
const PodRouter = require('./Router/Pod.Router');
const PostRouter = require('./Router/Post.Router');


const app = express()
app.use(cors())
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(morgan('tiny'))
app.use(express.static('Static'));



app.get('/', (req, res) => {
    res.send(`<div style="margin: auto" >
        <h1> Welcome to Linkpod </h1>
        <p> click here to <a href="/index"> read </a> documents </p>
    </div>`)
})

app.get('/docs', (req, res) => {
    res.sendFile('index.html', { root: 'Static' });
})


app.use('/api/user', userRouter);
app.use('/api/pod', PodRouter);
app.use('/api/post', PostRouter);


ConnectDatabase()
    .then(() => {
        app.listen(8000)
        console.log("Server Started at 8000")
    }).catch((error) => console.log("Error==>", error))
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const ConnectDatabase = require('./DB');
const userRouter = require('./Router/User.Router');


const app = express()
app.use(cookieParser());
app.use(express.json());
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('Static'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'Static' });
})


app.use('/user', userRouter);



ConnectDatabase()
    .then(() => {
        app.listen(8000)
        console.log("Server Started at 8000")
    }).catch((error) => console.log("Error==>", error))
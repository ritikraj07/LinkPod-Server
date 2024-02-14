require('dotenv').config()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const ConnectDatabase = require('./DB');
const userRouter = require('./Router/User.Route');
const config = require('./Config');

const app = express()
app.use(cookieParser());
app.use(express.json());
app.use(cors())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
    
    res.send('ok')
})

app.use('/user', userRouter);

console.log(process.env.MONGODB_URI)

ConnectDatabase()
    .then(() => {
        app.listen(8000)
        console.log("Server Started")
    }).catch((error) => console.log("Error==>", error))
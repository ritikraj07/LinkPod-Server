const { Router } = require("express")
const { generateAccessToken, generateRefreshToken } = require("../Controller/Token.Controller");
const { CreateUser, LoginUser } = require("../Controller/User.Controller");
const userRouter = Router()



/*****************************************POST REQUESTS***********************************************/


userRouter.post('/create-account', async (req, res) => {
    let { email, password } = req.body;
    let response = await CreateUser({ email, password })
    const token = generateAccessToken({user_id:response.data._id})

    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Enable this if your application uses HTTPS
        sameSite: 'strict' // Adjust as needed for your application's requirements
    });

    res.send(response)
})


userRouter.post('/login', async (req, res) => {

    let { email, password } = req.body;

    let response = await LoginUser({email, password})

    // Perform authentication and generate a token
    const token = generateAccessToken(response.data._id) // pass user id
    

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Enable this if your application uses HTTPS
        sameSite: 'strict' // Adjust as needed for your application's requirements
    });

    res.send('Login successful');
});


/*****************************************GET REQUESTS***********************************************/

userRouter.get('/token', async (req, res) => {
    
})

userRouter.get('/id/:id', async (req, res) => {})

module.exports = userRouter


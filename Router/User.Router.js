const { Router } = require("express")
const { generateAccessToken, generateRefreshToken } = require("../Controller/Token.Controller");
const { CreateUser, LoginUser } = require("../Controller/User.Controller");
const { Auth, Redirect } = require("../Script/auth");
const jwt = require('jsonwebtoken')

const userRouter = Router()



/*****************************************POST REQUESTS***********************************************/


userRouter.post('/create-account', async (req, res) => {
    let { email, password } = req.body;
    let response = await CreateUser({ email, password })
    const token = generateAccessToken({ user_id: response.data._id })

    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Enable this if your application uses HTTPS
        sameSite: 'strict' // Adjust as needed for your application's requirements
    });

    res.send(response)
})


userRouter.post('/login', async (req, res) => {

    let { email, password } = req.body;

    let response = await LoginUser({ email, password })

    // Perform authentication and generate a token
    const token = generateAccessToken({ user_id: response.data._id }) // pass user id


    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Enable this if your application uses HTTPS
        sameSite: 'strict' // Adjust as needed for your application's requirements
    });

    res.send('Login successful');
});


/*****************************************GET REQUESTS***********************************************/


userRouter.get('/linkedin/authorize', async (req, res) => {
    let { email, password } = req.query

    return res.redirect(Auth(email));
    // let response = await CreateUser({ email, password })
    // console.log('reponse', response)
    // if (response.status) {
    // } else {
    //     res.send(response)
    // }

})

userRouter.get('/linkedin/redirect', async (req, res) => {
    let { code, email_id } = req?.query
    console.log("email", email_id)
    let { status, data } = await Redirect(code)
    if (status) {
        console.log(status, data, '====== linkedIN redirect')
        let { access_token, expires_in, scope, id_token } = data;
        let { iat, exp, sub, name, picture, email, locale } = jwt.decode(id_token)

        res.send({ data: { iat, exp, sub, name, picture, email, locale },
        data1: { access_token, expires_in, scope, id_token } })
    } else {
        res.status(400).send({ status, data })
    }
})

userRouter.get('/get-user-data-form-linked', async (req, res) => { })

userRouter.get('/token', async (req, res) => {
})

userRouter.get('/id/:id', async (req, res) => { })

module.exports = userRouter


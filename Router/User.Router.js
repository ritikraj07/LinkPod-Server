const { Router } = require("express")
const { generateAccessToken } = require("../Controller/Token.Controller");
const { CreateUser, LoginUser } = require("../Controller/User.Controller");
const { Auth, Redirect } = require("../Script/auth");
const jwt = require('jsonwebtoken');
const config = require("../Config");

const userRouter = Router()



/*****************************************POST REQUESTS***********************************************/


userRouter.post('/create-account', async (req, res) => {
    let { email, password } = req.body
    let email_id = email
    return res.send(Auth({ email_id, password }));
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

    res.send(response);
});


/*****************************************GET REQUESTS***********************************************/




userRouter.get('/linkedin/redirect', async (req, res) => {
    let { code, state } = req?.query
    const decodedState = decodeURIComponent(state);
    const userData = JSON.parse(decodedState);
    const { email_id, password } = userData;
    let { status, data } = await Redirect(code)

    
    if (status) {

        let { access_token, expires_in, scope, id_token } = data;
        let { iat, exp, sub, name, picture, email, locale } = jwt.decode(id_token)

        let response = await CreateUser({
            email_id, email, password, iat, exp, sub, name,
            picture, locale, access_token, expires_in,
        })
        
        if (response.status === false) {
            //user has already been created
            response = JSON.stringify(response)
            response = encodeURIComponent(response)
            res.redirect(encodeURI(`${config.FRONTEND_URL}/login-failed?error=${response}`));
            return;
        }


        const token = generateAccessToken({ user_id: response.data._id })

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, {
            // httpOnly: true,
            secure: true, // Enable this if your application uses HTTPS
            sameSite: 'strict' // Adjust as needed for your application's requirements
        });

        // Set the login state in a separate cookie
        res.cookie('isLogin', true, {
            secure: true, // Enable this if your application uses HTTPS
            sameSite: 'strict' // Adjust as needed for your application's requirements
        });

        res.redirect(`${config.FRONTEND_URL}/`);

    } else {
        console.log('else block', status, data)
        // some error   
        
        let response = JSON.stringify({status, data})
        response = encodeURIComponent(response)
        res.redirect(encodeURI(`${config.FRONTEND_URL}/login-failed?error=${response}`));
        return;
    }
})

userRouter.get('/get-user-data-form-linked', async (req, res) => {
    res.cookie('isLogin', true, {
        secure: true, // Enable this if your application uses HTTPS
        sameSite: 'strict' // Adjust as needed for your application's requirements
    });

    const token = "akshfwnsaf";

    res.cookie('token', token, {
        // httpOnly: true,
        secure: true, // Enable this if your application uses HTTPS
        sameSite: 'strict' // Adjust as needed for your application's requirements
    });

    res.send("ok")
})

userRouter.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('isLogin');
    res.send("logout succefully")

})

userRouter.get('/token/:token', async (req, res) => {
})

userRouter.get('/id/:id', async (req, res) => { })

module.exports = userRouter

/**
 * const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
}, {});

console.log(cookies);
 * 
 * 
 */
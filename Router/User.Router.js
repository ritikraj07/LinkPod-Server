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
    
    return res.redirect(Auth({ email_id, password }));
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
    try {
        const { code, state } = req?.query;
        const decodedState = decodeURIComponent(state);
        const userData = JSON.parse(decodedState);
        const { email_id, password } = userData;

        const { status, data } = await Redirect(code);
        console.log(status, data, '====== LinkedIn redirect');

        if (status) {
            const { access_token, expires_in, scope, id_token } = data;
            const { iat, exp, sub, name, picture, email, locale } = jwt.decode(id_token);

            let response = await CreateUser({
                email_id, email, password, iat, exp, sub, name,
                picture, locale, access_token, expires_in,
            });

            if (response.status === false) {
                // !User has already been created
                const errorData = encodeURIComponent(JSON.stringify(response));
                return res.redirect(`${config.FRONTEND_URL}/login-failed?error=${errorData}`);
            }
            console.log('response', response)
            const token = generateAccessToken({ user_id: response.data._id });

            res.cookie('token', token, { sameSite: 'strict', secure: true });
            res.cookie('isLogin', true, { sameSite: 'strict', secure: true });

            res.redirect(config.FRONTEND_URL + '/dashboard')

        } else {
            console.log('else block', status, data);
            // Some error
            const errorData = encodeURIComponent(JSON.stringify({ status, data }));
            return res.redirect(`${config.FRONTEND_URL}/login-failed?error=${errorData}`);
        }
    } catch (error) {
        console.error('Error in LinkedIn redirect:', error);
        return res.status(500).send('Internal Server Error');
    }
});

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
 *    res.cookie('token', token, {
            // httpOnly: true,
            // secure: true, // Enable this if your application uses HTTPS
            sameSite: 'strict' // Adjust as needed for your application's requirements
        });
 * 
 */
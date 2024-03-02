const { Router } = require("express")
const { generateAccessToken } = require("../Controller/Token.Controller");
const { CreateUser, LoginUser, GetUserById } = require("../Controller/User.Controller");
const { Auth, Redirect } = require("../Script/auth");
const jwt = require('jsonwebtoken');
const config = require("../Config");
const { VerifyUser } = require("../Middleware");

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

    if (!response.status) {
        return res.send(response)
    }
    const token = generateAccessToken({ user_id: response.data._id })


    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Enable this if your application uses HTTPS
        sameSite: 'strict' // Adjust as needed for your application's requirements
    });

    console.log(response, token)
    res.cookie('isLogin', true, { sameSite: 'strict', secure: true });
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

        if (status) {
            const { access_token, expires_in, scope, id_token } = data;
            const { iat, exp, sub, name, picture, email, locale } = jwt.decode(id_token);

            let response = await CreateUser({
                email_id, email, password, iat, exp, sub, name,
                picture, locale, access_token, expires_in,
            });

            // console.log(response)
            if (response.status === false) {
                // !User has already been created
                const errorData = encodeURIComponent(JSON.stringify(response));
                return res.redirect(`${config.FRONTEND_URL}/sign-in?error=${errorData}`);
            }
            // console.log('response', response)
            const token = generateAccessToken({ user_id: response.data._id });

            res.cookie('token', token, { sameSite: 'strict', secure: true });
            res.cookie('isLogin', true, { sameSite: 'strict', secure: true });

            res.redirect(config.FRONTEND_URL + '/dashboard')

        } else {
            // console.log('else block', status, data);
            // Some error
            const errorData = encodeURIComponent(JSON.stringify({ status, data }));
            return res.redirect(`${config.FRONTEND_URL}/sign-up?error=${errorData}`);
        }
    } catch (error) {
        console.error('Error in LinkedIn redirect:', error);
        return res.status(500).json({ error: 'Internal server error' });

    }
});


userRouter.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('isLogin');
    res.cookie('isLogin', false, { sameSite: 'strict', secure: true });
    res.send({
        status: true,
        data: null,
        message: 'logout successfully'
    })

})

userRouter.get('/getdata', VerifyUser, async (req, res) => {
    let id = req._id;
    let response = await GetUserById(id);
    res.send(response);
})



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
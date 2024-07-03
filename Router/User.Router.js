const { Router } = require("express")
const { generateAccessToken } = require("../Controller/Token.Controller");
const { CreateUser, LoginUser, GetUserById, ForgotPassword, VerifyOTP, ChangePassword } = require("../Controller/User.Controller");
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


    res.cookie('isLogin_test', true, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
        secure: true, // Change to true
        sameSite: "none",
        domain: process.env.FRONTEND_URL,
    });
    res.send({ ...response, token, isLogin: true });
});


userRouter.post('/forgot-password', async (req, res) => {
    let { email } = req.body
    let response = await ForgotPassword({ email })
    res.send(response)
})

userRouter.post('/verify-otp', async (req, res) => {
    let { email, otp } = req.body
    let response = await VerifyOTP({ email, otp })
    let token = generateAccessToken({ user_id: response?.data?._id })
    if (response.status) {
        res.cookie('isLogin_test', true, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000),
            secure: true, // Change to true
            sameSite: "none",
            domain: process.env.FRONTEND_URL,
        })

        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000),
            secure: true, // Enable this if your application uses HTTPS
            sameSite: 'strict' // Adjust as needed for your application's requirements
        })
    }
    if (token) {
        response.token = token
    }
    res.send(response)
})

/*****************************************GET REQUESTS***********************************************/

userRouter.post('/reset-token', async (req, res) => {
    let { email } = req.body
    let email_id = email
    let password = "12345678"

    return res.send(Auth({email_id, password}));
})


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
    res.cookie('isLogin_test', true, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
        secure: true, // Change to true
        sameSite: "none",
        domain: "https://linkpod.onrender.com",
    });
    res.send(response);
})



/*****************************************PATCH REQUESTS***********************************************/



userRouter.patch('/reset-password', VerifyUser, async (req, res) => {
    let { email, new_password } = req.body
    let response = await ChangePassword({ email, new_password })
    res.send(response)

})


module.exports = userRouter

/**
 * 
userRouter.get('/check-cookie', async (req, res) => {
    // Set the secure flag to true for SameSite=None
    res.cookie('isLogin', true, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
        secure: true, // Change to true
        sameSite: "none",
        domain: "https://linkpod.onrender.com",
    });
    res.send({
        status: true,
    });
});
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
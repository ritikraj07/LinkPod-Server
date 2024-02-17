/*

**User Flow Description for LinkedIn OAuth 2.0 Integration**

1. **User Registration:**
   - When a new user attempts to register on our platform, they provide their email and password.
   - Using the provided email and password, we attempt to create a new user account in our database.

2. **Initiating LinkedIn Authorization:**
   - Upon successful registration, the user is redirected to the LinkedIn authorization page to link their LinkedIn account with our platform.
   - To initiate the LinkedIn authorization process, we construct an authorization URL with the necessary parameters using the `Auth` function:
     - Client ID: Our platform's unique identifier registered with LinkedIn.
     - Redirect URI: The URL where LinkedIn will redirect the user after authorization, including the user's email as a query parameter.
     - Scope: The requested permissions for accessing LinkedIn data.
   - This URL is then used to redirect the user to LinkedIn for authorization by invoking the `/linkedin/authorize` endpoint.

3. **LinkedIn Authorization and Redirect:**
   - The user logs in to their LinkedIn account and grants permissions to our platform.
   - Upon authorization, LinkedIn redirects the user back to our platform's redirect URI, including the authorization code and the user's email as query parameters.
   - We extract the authorization code and email from the URL query parameters and proceed to exchange the code for an access token using the `Redirect` function.

4. **Access Token Exchange:**
   - We construct a payload containing the authorization code, client ID, client secret, redirect URI, and grant type.
   - This payload is sent as a POST request to LinkedIn's access token endpoint using the `Redirect` function.
   - Upon successful exchange, LinkedIn returns an access token along with additional information such as expiration time and scope.

5. **User Profile Retrieval:**
   - We decode the received ID token to extract the user's profile information, including their name, profile picture, email, and other relevant details.
   - This profile information is then stored or used as needed within our platform.

6. **Completion and Error Handling:**
   - If the entire process completes successfully, the user is redirected to their dashboard or another relevant page within our platform.
   - If any errors occur during the process, appropriate error messages are displayed to the user, and necessary actions are taken to address the issues.

This user flow outlines the steps involved in integrating LinkedIn OAuth 2.0 authentication with our platform, leveraging functions such as `Auth` and `Redirect` to manage authorization and token exchange. If you require further clarification or assistance,
 please don't hesitate to contact us.




 */

/* When a user accesses the /linkedin/authorize endpoint, 
   it leads to the creation of a user in the database 
   and redirects the user to the consent page.
*/
userRouter.get('/linkedin/authorize', async (req, res) => {
    let { email, password } = req.query

    let response = await CreateUser({ email, password })
    console.log('response', response)
    if (response.status) {
        return res.redirect(Auth(email));
    } else {
        res.send(response)
    }

})


/*
Everything works fine if query params are not passed,
but if we pass query params, we get an error.

Let's understand the need:
LinkedIn OAuth 2.0 is in Node.js (backend required).
We have to create a user in the database if we do not send query params.
How will we know which user authorized?
*/

const Auth = (email) => {
    const redirectUri = encodeURI(`${config.REDIRECT_URI}?email_id=${email}`);
    return encodeURI(`https://www.linkedin.com/oauth/v2/authorization?client_id=${config.CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=${config.SCOPE}`);
}


/**
 * Here, we will receive an email so that we can find the user in the database 
 * and store data coming from the redirect.
 */

userRouter.get('/linkedin/redirect', async (req, res) => {
    let { code, email_id } = req?.query
    console.log("email", email_id)
    let { status, data } = await Redirect(code)
    if (status) {
        console.log(status, data, '====== LinkedIn redirect')
        let { access_token, expires_in, scope, id_token } = data;
        let { iat, exp, sub, name, picture, email, locale } = jwt.decode(id_token)

        res.send({
            data: { iat, exp, sub, name, picture, email, locale },
            data1: { access_token, expires_in, scope, id_token }
        })
    } else {
        res.status(400).send({ status, data })
    }
})



const Redirect = async (code) => {
    const payload = {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        redirect_uri: config.REDIRECT_URI,
        grant_type: 'authorization_code',
        code: code
    };

    try {
        const response = await axios({
            url: `https://www.linkedin.com/oauth/v2/accessToken`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(payload)
        });

        return {
            data: response.data,
            status: true
        }
    } catch (error) {
        console.log(error);
        return {
            data: error,
            status: false
        };
    }
};

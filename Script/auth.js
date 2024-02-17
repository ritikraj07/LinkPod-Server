let qs = require('querystring')
let axios = require('axios')
const config = require('../Config')

const Auth = (userData) => {
    const userDataString = JSON.stringify(userData);
    const encodedUserData = encodeURIComponent(userDataString);
    return encodeURI(`https://www.linkedin.com/oauth/v2/authorization?client_id=${config.CLIENT_ID}&response_type=code&redirect_uri=${config.REDIRECT_URI}&scope=${config.SCOPE}&state=${encodedUserData}`);
}


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

module.exports = { Auth, Redirect }
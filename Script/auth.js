let qs = require('querystring')
let axios = require('axios')

let client_id = process.env.CLIENT_ID
let r_uri = process.env.REDIRECT_URI
let scope = process.env.SCOPE
let client_secret = process.env.CLIENT_SECRET

const Auth = (_id) => {
    return encodeURI(`https://www.linkedin.com/oauth/v2/authorization?client_id=${client_id}&response_type=code&redirect_uri=${r_uri}&scope=${scope}`)
}

const Redirect = async (code) => {
    const payload = {
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: r_uri,
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

        console.log('res=>', response.data);
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
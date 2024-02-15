const axios = require('axios');

const AddReactionToPost = async ({ accessToken, userURN, reactionType = 'LIKE' }) => {
    // Implement AddReactionToPost functionality here
};

const AddCommentToPost = async ({ accessToken, userURN, comment }) => {
    // Implement AddCommentToPost functionality here
};

const GetUserFromLinked = async (accessToken) => {  
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.linkedin.com/v2/userinfo',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    }

    try {
        let response = await axios.request(config);
        return {
            status: true,
            data: response.data,
            message: 'Success'
        }
    } catch (error) {
        return {
            status: false,
            data: error,
            message: 'LinkedIn Error!'
        }
    }
}

module.exports = { GetUserFromLinked, AddReactionToPost, AddCommentToPost };

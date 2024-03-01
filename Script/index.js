const axios = require('axios');


const GetPostInfo = async ({ postURN, accessToken }) => {
    
}


const AddReactionToPost = async ({ postURN, accessToken, userURN, reactionType = 'LIKE' }) => {
    try {
        let data = JSON.stringify({
            "root": `urn:li:activity:${postURN}`,
            "reactionType": reactionType
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.linkedin.com/v2/reactions?actor=urn:li:person:${userURN}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data: data
        };

        const response = await axios.request(config);
        return {
            status: true,
            message: 'Reaction added successfully 🎉',
            data: response.data
        };
    } catch (error) {
        return {
            status: false,
            message: 'Error adding reaction to post',
            data: error.response ? error.response.data : error.message
        };
    }
};

const AddCommentToPost = async ({ postURN, accessToken, userURN, comment }) => {
    try {
        let data = JSON.stringify({
            actor: `urn:li:person:${userURN}`,
            message: {
                text: comment
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.linkedin.com/v2/socialActions/urn:li:activity:${postURN}/comments`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);
        return {
            status: true,
            message: 'Comment added successfully 🎉',
            data: response.data
        };
    } catch (error) {
        return {
            status: false,
            message: 'Error adding comment to post',
            data: error.response ? error.response.data : error.message
        };
    }
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

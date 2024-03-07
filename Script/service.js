const cron = require('node-cron');
const { AddReactionToPost, AddCommentToPost } = require(".");
const Post = require("../Model/Post.Model");



function CreatePostObj(postURN, accessToken, userURN, avgTime) {
    let postObj = {
        postURN,
        accessToken,
        userURN,
        avgTime
    };

    postObj.accessToken = accessToken;
    postObj.userURN = userURN;
    postObj.avgTime = avgTime;
    postObj.postURN = postURN;

    let reactions = ['PRAISE', 'LIKE', 'EMPATHY', 'INTEREST', 'APPRECIATION', 'ENTERTAINMENT'];
    let comments = [
        "Great post!",
        "Interesting perspective.",
        "Well said!",
        "I agree!",
        "Awesome!",
        "Thanks for sharing!",
    ];

    postObj.comment = comments[Math.floor(Math.random() * comments.length)];
    // postObj.reactionType = reactions[Math.floor(Math.random() * reactions.length)];
    postObj.reactionType = 'LIKE';

    return postObj;
}

function ReadyForReactionAndComment({ urn, users, avgTime }) {
    let postArray = [];
    let timeSum = 0;

    // Check if avgTime is a string before splitting
    if (typeof avgTime === 'string') {
        let [min, max] = avgTime.split(':');
        for (let i = 0; i < users.length; i++) {
            avgTime = Math.floor(Math.random() * (max - min) + min) + timeSum;
            timeSum += avgTime;
            let postObj = CreatePostObj(urn, users[i].linkedIn_access_token, users[i].userURN, avgTime);
            postArray.push(postObj);
        }
    } else {
        // Handle the case where avgTime is not a string
        console.error('avgTime must be a string in the format "min:max"');
    }

    StartReactionAndComment({ postObj: postArray }); // Uncomment this line
}




function StartReactionAndComment({ postObj }) {
    console.log("Start Reaction and Comments");
    console.log(postObj.length)
    for (const post of postObj) {
        console.log(post)
        // setTimeout(() => {
            AddReactionToPost(post).then((res)=>{MaintainPostData(res, null, post.postURN)});
            AddCommentToPost(post).then((res)=>{MaintainPostData(null, res, post.postURN)});
            console.log("Reaction and Comment added successfully 🎉");
        // }, 15000);
    }

    console.log("End Reaction and Comments");
}








async function MaintainPostData(reaction, comment, postURN) {
    try {
        if (reaction?.status && comment?.status) {
            await Post.findOneAndUpdate({ urn: postURN }, { $inc: { likes: 1, comments: 1 } });
        } else {
            if (reaction?.status) {
                await Post.findOneAndUpdate({ urn: postURN }, { $inc: { likes: 1 } });
            } else {
                console.log(reaction)
            }
            if (comment?.status) {
                await Post.findOneAndUpdate({ urn: postURN }, { $inc: { comments: 1 } });
            } else {
                console.log(reaction)
            }
        }
    } catch (error) {
        console.log(error)
    }


}




module.exports = { ReadyForReactionAndComment }
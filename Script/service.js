/**
 * user request for comment and reaction in post
 * user will send post urn
 * 
 * random time or fixed interval
 * array of comments
 * array of user urn
 * 
 * 
 * retrive user from pod on the basis of user comment or reaction num
 * use limit set to user from pod
 * 
 * limit = 5,
 * check url and limit in middleware
 * 
 */

const { AddReactionToPost, AddCommentToPost } = require(".");
const Post = require("../Model/Post.Model");




function ReadyForReactionAndComment({ urn, users, avgTime }) {
    let postArray = [];
    let timeSum = 0;
    let [min, max] = avgTime.split(':')|| [60000, 120000];
    for (let i = 0; i < users.length; i++) {
        avgTime = Math.floor(Math.random() * (max - min) + min) + timeSum;
        timeSum += avgTime;
        let postObj = CreatePostObj(urn, users[i].linkedIn_access_token, users[i].userURN, avgTime);
        postArray.push(postObj);
    }

    StartReactionAndComment({ postObj: postArray }); // Uncomment this line
}

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
    postObj.reactionType = reactions[Math.floor(Math.random() * reactions.length)];

    return postObj;
}

async function StartReactionAndComment({ postObj }) {
    console.log("Start Reaction and Comments");
    for (const post of postObj) {
        setTimeout(async () => {
            let reaction = await AddReactionToPost(post);
            let comment = await AddCommentToPost(post);
            MaintainPostData(reaction, comment, post.postURN);
        }, post.avgTime);
    }

    console.log("End Reaction and Comments");
}



async function MaintainPostData(reaction, comment, postURN) {
    try {
        if (reaction.status && comment.status) {
            await Post.findOneAndUpdate({ urn: postURN }, { $inc: { likes: 1, comments: 1 } });
        } else {
            if (reaction.status) {
                await Post.findOneAndUpdate({ urn: postURN }, { $inc: { likes: 1 } });
            } else {
                console.log(reaction)
            }
            if (comment.status) {
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
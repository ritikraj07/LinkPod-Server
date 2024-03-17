const { AddReactionToPost, AddCommentToPost } = require(".");
const Post = require("../Model/Post.Model");



function CreatePostObj(postURN, accessToken, userURN, avgTime, comment) {
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
    postObj.comment = comment
    postObj.reactionType = 'LIKE';




    // let reactions = ['PRAISE', 'LIKE', 'EMPATHY', 'INTEREST', 'APPRECIATION', 'ENTERTAINMENT'];
    // postObj.reactionType = reactions[Math.floor(Math.random() * reactions.length)];

    return postObj;
}

function ReadyForReactionAndComment({ urn, users, avgTime, comments }) {
    let postArray = [];
    let timeSum = 0;

    // Check if avgTime is a string before splitting
    // if (typeof avgTime === 'string') {
    //     let [min, max] = avgTime.split(':');
    for (let i = 0; i < users.length; i++) {
        // avgTime = Math.floor(Math.random() * (max - min) + min) + timeSum;
        // timeSum += avgTime;
        let comment = i < comments?.length ? comments[i] : null
        let postObj = CreatePostObj(urn, users[i].linkedIn_access_token, users[i].userURN, avgTime, comment);
        postArray.push(postObj);
    }
    // } else {
    //     // Handle the case where avgTime is not a string
    //     console.error('avgTime must be a string in the format "min:max"');
    // }

    StartReactionAndComment({ postObj: postArray }); // Uncomment this line
}




function StartReactionAndComment({ postObj }) {
    console.log("Start Reaction and Comments");

    for (const post of postObj) {
        // console.log(post)
        // setTimeout(() => {
        AddReactionToPost(post).then((res) => { MaintainPostData(res, null, post.postURN) });// for maintaining post data
        if (post.comment) {
            AddCommentToPost(post).then((res) => { MaintainPostData(null, res, post.postURN) });
        }
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
        throw new Error("Error in MaintainPostData Server Error\n" + error);
    }


}




module.exports = { ReadyForReactionAndComment }
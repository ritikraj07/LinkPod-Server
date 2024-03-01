const Pod = require("../Model/Pod.Model")
const Post = require("../Model/Post.Model")
const User = require("../Model/User.Model");
const { ReadyForReactionAndComment } = require("../Script/service");





const CreatePost = async ({ title, description, urn, created_by, pod_id, avgTime=5000 }) => {
    try {
        // Create the post
        const post = await Post.create({ title, description, urn, created_by });

        ManagePost({ title, description, urn, created_by, pod_id, avgTime });

        return {
            status: true,
            message: 'Post added successfully 🎉',
            data: post
        };
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            data: error
        };
    }
};


async function ManagePost({ title, description, urn, created_by, pod_id, avgTime }) {

    // Find member IDs of the pod
    const { member_id } = await Pod.findById(pod_id, { member_id: 1 }).lean();

    // Update reactions and comments for all members of the pod
    await User.updateMany({ _id: { $in: member_id } }, { $inc: { reactions: 1, comments: 1 } });

    // Fetch userURN for the top 20 users with the least reactions
    const users = await User.find({ _id: { $in: member_id } }, { userURN: 1, linkedIn_access_token: 1 })
        .sort({ reactions: 1 })
        .limit(20)
        .lean();

    // console.log({ users });
    // Add reactions and comments to the post
    ReadyForReactionAndComment({ urn, users, avgTime });
}



async function GetPostInfoById(id) {
    try {
        let post = await Post.findById(id)
        return {
            status: true,
            message:"success",
            data: post
        }

     } catch (error) {
        return {
            status: false,
            message:'Internal Server Error',
            data: error
        }
    }
}

async function GetAllPostByUser(id) {
    try {
        let post = await Post.find({ created_by: id })
        return {
            status: true,
            message:"success",
            data: post
        }
    }
    catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            data: error
        }
    }
}


module.exports = {
    CreatePost,
    GetPostInfoById,
    GetAllPostByUser
};

const Pod = require("../Model/Pod.Model")
const Post = require("../Model/Post.Model")
const User = require("../Model/User.Model");
const { ReadyForReactionAndComment } = require("../Script/service");
const { AddCommentToPost } = require("../Script");


const CheckIsPostExist = async (urn) => {
    const post = await Post.findOne({ urn });
    if (post) {
        return true;
    }
    return false;
}


const CreatePost = async ({ title, urn, created_by, pod_id, avgTime = "6000:10000", user, comments }) => {
    try {

        let response = await AddCommentToPost({ postURN: urn, accessToken: user.linkedIn_access_token, userURN: user.userURN, comment: "#cfbf" });

        if (!response.status) {
            // Check if response data contains the expected error message
            const errorMessage = response.data.message || '';
            const expectedErrorMessage1 = 'Provided threadUrn:';
            const expectedErrorMessage2 = 'is not the same as the actual threadUrn:';
            if (errorMessage.includes(expectedErrorMessage1) && errorMessage.includes(expectedErrorMessage2)) {
                // Extract the actual and provided threadUrn values from the error message
                const actualUrn = errorMessage.split(expectedErrorMessage2)[1].trim().split(':').pop();

                urn = actualUrn;
                // Re-check if the post exists with the swapped urn

            }
            return response;
        }

        if (await CheckIsPostExist(urn)) {
            // Post now exists with the correct urn
            return {
                status: false,
                message: 'Post already exists',
                data: null
            };
        }

        await Post.create({ title, urn, created_by });
        ManagePost({ urn, created_by, pod_id, avgTime, comments });

        return {
            status: true,
            message: 'Post added successfully 🎉',
            data: null
        };
    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            data: error
        };
    }
};


async function ManagePost({ urn, pod_id, avgTime, created_by, comments }) {
    try {
        // Aggregate to exclude the created_by ID from the member_id array
        const pod = await Pod.aggregate([
            { $match: { $expr: { $eq: ['$_id', { $toObjectId: pod_id }] } } },
            {
                $project: {
                    member_id: {
                        $filter: {
                            input: "$member_id",
                            as: "member",
                            cond: { $ne: ["$$member", created_by] }
                        }
                    }
                }
            }
        ]);


        // Extract member_id from the result
        const member_id = pod.length > 0 ? pod[0].member_id : [];


        // Update reactions and comments for all members of the pod
        await User.updateMany(
            { _id: { $in: member_id } },
            { $inc: { reactions: 1, comments: 1 } }
        );

        // Fetch userURN for the top 20 users with the least reactions
        const users = await User.find({ _id: { $in: member_id } }, { userURN: 1, linkedIn_access_token: 1 })
            .sort({ reactions: 1 })
            .limit(20)
            .lean();
        

        // Add reactions and comments to the post
        ReadyForReactionAndComment({ urn, users, avgTime, comments });
    } catch (error) {
        console.error('Error in ManagePost:', error);
        // Handle error appropriately
        throw error;
    }
}





async function GetPostInfoById(id) {
    try {
        let post = await Post.findById(id)
        return {
            status: true,
            message: "success",
            data: post
        }

    } catch (error) {
        return {
            status: false,
            message: 'Internal Server Error',
            data: error
        }
    }
}

async function GetAllPostByUser(id) {
    try {
        let post = await Post.find({ created_by: id })
        return {
            status: true,
            message: "success",
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


async function DeletePost(id) {
    try {
        let post = await Post.findByIdAndDelete(id);
        return {
            status: true,
            message: "post deleted successfully",
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
    GetAllPostByUser,
    DeletePost
};

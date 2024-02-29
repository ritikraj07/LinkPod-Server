const User = require("../Model/User.Model")

const CreatePost = async ({ title, description, urn, created_by }) => {
    try {
        const user = await User.findById(created_by)
        user.posts.push({ title, description, urn })
    } catch (error) {
        return error
    }
}

module.exports  = {
    CreatePost}
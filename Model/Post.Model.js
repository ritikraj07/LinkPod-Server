const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    urn: {
        type: String,
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
}
)

PostSchema.pre('save', async function (next) {
    await this.model('User').updateOne({ _id: this.created_by }, { $inc: { postCount: -1 } });
    next();
});

const Post = model('Post', PostSchema);
module.exports = Post;
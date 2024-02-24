const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    urn: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    posts: [PostSchema],
    // post count for each month
    postCount: {
        type: Number,
        default: calculateNoOfPost()
    },
    comments: {
        type: Number,
        default: 0,
        select: false
    },
    reactions: {
        type: Number,
        default: 0,
        select: false
    },
    name: String,
    userURN: String,
    picture: String,
    linkedIn_email: String,
    linkedIn_access_token: {
        type: String,
        required: true,
        select: false
    },
    linkedIn_access_token_expires_in: {
        type: String,
        required: true,
        select: false,
    },
    linkedInAccessTokenExpireDate: {
        type: Date,
        default: function () {
            return this.linkedIn_access_token_expires_in ?
                new Date(Date.now() + this.linkedIn_access_token_expires_in * 1000) :
                null;
        }
    },
    membershipTier: {
        type: String,
        enum: ['Basic', 'Premium', 'Gold'],
        default: 'Basic',
        select: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});


UserSchema.method.calculateNoOfPost = function () {
    // Define the number of posts allowed based on membership tier
    // can i add dependency here
    // if (membershipTier) change update membership tier
    switch (this.membershipTier) {
        case 'Basic':
            return 3; 
        case 'Premium':
            return 5; 
        case 'Gold':
            return 10;
        default:
            return 0;
    }
};

UserSchema.pre('save', function (next) {
    if (this.isModified('linkedIn_access_token_expires_in')) {
        this.linkedInAccessTokenExpireDate = this.linkedIn_access_token_expires_in ?
            new Date(Date.now() + this.linkedIn_access_token_expires_in * 1000) :
            null;
    }
    if (this.isModified('posts')) {
        /**
         * write logic for post count on the basic of posts date
         * and check for membership
         */
        this.postCount = this.posts ? this.posts.length : 0
    }

    if(this.isModified('membershipTier')) {
        this.postCount = this.calculateNoOfPost();
    }
   
    next();
});

const User = model('User', UserSchema);

module.exports = User;

const { Schema, model } = require('mongoose');



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
    postCount: {
        type: Number,
        default: 3
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
    userURN: {
        type: String,
        unique: true,
    },
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


UserSchema.methods.calculateNoOfPost = function () {
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
    // Update LinkedIn access token expiration date if modified
    if (this.isModified('linkedIn_access_token_expires_in')) {
        this.linkedInAccessTokenExpireDate = this.linkedIn_access_token_expires_in ?
            new Date(Date.now() + this.linkedIn_access_token_expires_in * 1000) :
            null;
    }

    // Update post count based on posts and membership tier
    if (this.isModified('membershipTier')) {
        this.postCount = this.calculateNoOfPost();
    }

    // Additional logic for updating post count every month
    if (this.isNew) {
        // Get current date and user's creation date
        const currentDate = new Date();
        const creationDate = new Date(this.createdAt);

        // Check if it's the same day of the month as the user's creation date
        if (currentDate.getDate() === creationDate.getDate()) {
            // Update post count using calculateNoOfPost() method
            this.postCount = this.calculateNoOfPost();
        }
    }

    // Call next to continue with the save operation
    next();
});


const User = model('User', UserSchema);

module.exports = User;

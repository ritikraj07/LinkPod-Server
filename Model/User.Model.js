const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: String,
    userURN: String,
    email_verified: Boolean,
    picture: String,
    linkedIn_email: String,
    linkedIn_access_token: {
        token: String,
        token_id: String,
        expires_in: Number,
    },
}, {
    timestamps: true,
});

// Virtual property to calculate expiration date based on expires_in
UserSchema.virtual('linkedInAccessTokenExpireDate').get(function () {
    return this.linkedIn_access_token.expires_in ?
        new Date(Date.now() + this.linkedIn_access_token.expires_in * 1000) :
        null;
});

const User = model('User', UserSchema);

module.exports = User;

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
    },
    name: String,
    userURN: String,
    picture: String,
    linkedIn_email: String,
    linkedIn_access_token: {
        type: String,
        required: true
    },
    linkedIn_access_token_expires_in: {
        type: String, 
        required: true
    },
}, {
    timestamps: true,
});

// Virtual property to calculate expiration date based on expires_in
UserSchema.virtual('linkedInAccessTokenExpireDate').get(function () {
    return this.linkedIn_access_token_expires_in ?
        new Date(Date.now() + this.linkedIn_access_token_expires_in * 1000) :
        null;
});

const User = model('User', UserSchema);

module.exports = User;

const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    petName: String,
    email: {
        require: true,
        type: String
    },
    password: {
        require: true,
        type: String
    },
    age: Number,
    gender: String,
    breed: String,
    original: Boolean,
    location: {
        Latitude: String,
        Longitude: String
    },
    purpose: String,
    image: String,
    ownerName: String
})

const User = model('User', UserSchema)
module.exports = User
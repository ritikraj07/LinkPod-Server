const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    email: {
        require: true,
        type: String,
        unique: true,
    },
    password: {
        require: true,
        type: String
    },
    linkedIn_id: String,
    linkedIn_access_token: {
        token: {
            type: String,
            
        },
        expireTime: {
            type: String,
            
        },
        expireDate: {
            type: String,
            
        },
    },
},
    {
        timestamps: true,
    }
)

const User = model('User', UserSchema)
module.exports = User
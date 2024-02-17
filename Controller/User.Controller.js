const bcrypt = require('bcrypt');
const User = require("../Model/User.Model");
const { generateRefreshToken } = require('./Token.Controller');

const CreateUser = async ({
    email_id, email, password, iat, exp, sub, name,
    picture, locale, access_token, expires_in,
}) => {
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email_id });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with hashed password
        const user = await User.create({
            email: email_id, password: hashedPassword,
            name, userURN: sub, picture, linkedIn_access_token: access_token, 
            linkedIn_access_token_expires_in: expires_in,
            linkedIn_email: email,
        
        });

        // Remove the hashed password from the returned user object
        const { password: _, ...userData } = user.toObject();

        return {
            status: true,
            data: userData,
            message: 'Account created 🎉'
        };
    } catch (error) {
        return {
            status: false,
            data: error.message,
            message: 'Error in creating account'
        };
    }
};




const LoginUser = async ({ email, password }) => {
    try {
        // Find the user with the provided email
        const user = await User.findOne({ email });

        // If user does not exist, return error
        if (!user) {
            return {
                status: false,
                data: null,
                message: 'No User Found! 😒'
            };
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = bcrypt.compare(password, user.password);

        // If passwords do not match, return error
        if (!passwordMatch) {
            return {
                status: false,
                data: null,
                message: 'Password Not Match! 😒'
            };
        }


        const refreshToken = generateRefreshToken({ userId: user._id });

        return {
            status: true,
            data: {
                r_token: refreshToken,
                user
            },
            message: 'Login successful'
        };
    } catch (error) {
        return {
            status: false,
            data: error,
            message: 'Something went wrong'
        };
    }
};





module.exports = { CreateUser, LoginUser, };

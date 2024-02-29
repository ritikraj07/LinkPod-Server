const bcrypt = require('bcrypt');
const User = require("../Model/User.Model");
const { generateRefreshToken } = require('./Token.Controller');
const Pod = require('../Model/Pod.Model');

const CreateUser = async ({
    email_id, email, password, iat, exp, sub, name,
    picture, locale, access_token, expires_in,
}) => {
    try {
        // console.log(email_id, '<====<')
        // Check if the email already exists
        const existingUser = await User.findOne({ email: email_id });
        // console.log(existingUser, '====<<<<<<<<<<')
        const hashedPassword = await bcrypt.hash(password, 10);
        if (existingUser) {
            let user = await User.updateOne({ email: email_id }, {
                email: email_id, password: hashedPassword,
                name, userURN: sub, picture, linkedIn_access_token: access_token,
                linkedIn_access_token_expires_in: expires_in,
                linkedIn_email: email,
            })

            return {
                status: false,
                data:null,
                message: 'Already have account 🎉'
            }

        }

        // Hash the password

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
        const user = await User.findOne({ email }).select('+password');
        console.log(user)

        // If user does not exist, return error
        if (!user) {
            return {
                status: false,
                data: null,
                message: 'No User Found! 😒'
            };
        }

        // Ensure the user object has a password field
        if (!user.password) {
            return {
                status: false,
                data: null,
                message: 'User password is missing. Please contact support. 😒'
            };
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return error
        if (!passwordMatch) {
            return {
                status: false,
                data: null,
                message: 'Password Not Match! 😒'
            };
        }

        // If everything is successful, return user data
        return {
            status: true,
            data: {
                _id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
            message: 'Login successful'
        };
    } catch (error) {
        // Log the error for debugging purposes
        console.error('LoginUser error:', error);

        // Return a generic error message
        return {
            status: false,
            data: null,
            message: 'Something went wrong. Please try again later.'
        };
    }
};






const GetUserById = async (id) => {
    try {
        // Find the user by ID
        let user = await User.aggregate([
            {
                $match: {
                    _id: id
                }
                
            }, {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    picture: 1,
                    linkedIn_email: 1,  
                }
            }
        ])

        // If user does not exist, return error
        if (!user) {
            return {
                status: false,
                message: 'No user exists',
                data: null
            }
        }

        let userPods = await Pod.aggregate([
            {
                $facet: {
                    myPods: [
                        {
                            $match: {
                                admin_id: id
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                description: 1,
                                admin_id: 1,
                                admin_name: 1,
                                member_count: { $size: "$member_id" }
                            }
                        }
                    ],
                    joinedPods: [
                        {
                            $match: {
                                member_id: { $in: [id] },
                                admin_id: { $ne: id }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                description: 1,
                                admin_id: 1,
                                admin_name: 1,
                                member_count: { $size: "$member_id" }
                            }
                        }
                    ]
                }
            }
        ]);

        let myPods = userPods[0].myPods;
        let joinedPods = userPods[0].joinedPods;


        return {
            status: true,
            message: 'success',
            data: {
                user,
                my_pod: myPods,
                joined_pod: joinedPods
            }
        }

    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        }
    }
}






module.exports = { CreateUser, LoginUser, GetUserById };



// const podWithMemberId = await Pod.findOne({ _id: podId }).select('+member_id');
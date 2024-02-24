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

            return user;

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
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return error
        if (!passwordMatch) {
            return {
                status: false,
                data: null,
                message: 'Password Not Match! 😒'
            };
        }

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
        return {
            status: false,
            data: error,
            message: 'Something went wrong'
        };
    }
};




const GetUserById = async (id) => {
    try {
        // Find the user by ID
        let user = await User.findById(id);

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
                _id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
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
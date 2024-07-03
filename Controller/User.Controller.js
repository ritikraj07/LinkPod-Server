const bcrypt = require('bcrypt');
const User = require("../Model/User.Model");
const Pod = require('../Model/Pod.Model');
const { GetAllPostByUser } = require('./Post.Controller');
const { GenerateOTP } = require('../Script/RandomOTP');
const { SendOTPforPasswordReset, SendWelcomeEmail } = require('../Script/mailController');

const emailMatchedWithOTP = {}

const CreateUser = async ({
    email_id, email, password, iat, exp, sub, name,
    picture, locale, access_token, expires_in,
}) => {
    try {
        // console.log(email_id, '<====<')
        // Check if the email already exists
        const existingUser = await User.findOne({ email: email_id });
        // console.log(existingUser, '====<<<<<<<<<<')

        if (existingUser) {
            let user = await User.updateOne({ email: email_id }, {
                email: email_id, password: hashedPassword,
                name, userURN: sub, picture, linkedIn_access_token: access_token,
                linkedIn_access_token_expires_in: expires_in,
                linkedIn_email: email,
            })

            return {
                status: true,
                data: user,
                message: 'Already have account'
            }

        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Hash the password

        // Create user with hashed password
        const user = await User.create({
            email: email_id, password: hashedPassword,
            name, userURN: sub, picture, linkedIn_access_token: access_token,
            linkedIn_access_token_expires_in: expires_in,
            linkedIn_email: email,

        });
        SendWelcomeEmail({ user: user });

        // Remove the hashed password from the returned user object
        const { password: _, ...userData } = user.toObject();

        return {
            status: true,
            data: userData,
            message: 'Account created'
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
        // console.log(user)

        // If user does not exist, return error
        if (!user) {
            return {
                status: false,
                data: null,
                message: 'No User Found!'
            };
        }

        // Ensure the user object has a password field
        if (!user.password) {
            return {
                status: false,
                data: null,
                message: 'User password is missing. Please contact support.'
            };
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return error
        if (!passwordMatch) {
            return {
                status: false,
                data: null,
                message: 'Password Not Match!'
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
        let user = await User.findById(id, {
            name: 1,
            email: 1,
            picture: 1,
            linkedIn_email: 1,
            linkedIn_access_token_expires_in: 1
        }).exec();



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
        let posts = await GetAllPostByUser(user._id)


        return {
            status: true,
            message: 'success',
            data: {
                user,
                my_pod: myPods,
                joined_pod: joinedPods,
                posts
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



const ResetPassword = async ({ email, newPassword }) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // If user does not exist, return error
        if (!user) {
            return {
                status: false,
                message: 'No user exists',
                data: null
            }
        }

        // Update the user's password

        user.password = hashedPassword;

        await user.save();

        return {
            status: true,
            message: 'success',
            data: user
        }

    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        }
    }
}


const ForgotPassword = async ({ email }) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If user does not exist, return error
        if (!user) {
            return {
                status: false,
                message: 'No user exists',
                data: null
            }
        }

        let otp = GenerateOTP();

        emailMatchedWithOTP[user.email] = otp;

        await SendOTPforPasswordReset({ user, otp });
        return {
            status: true,
            message: 'otp is sent',
            data: null
        }

    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        }
    }
}


const VerifyOTP = async ({ email, otp }) => {
    try {
        if (emailMatchedWithOTP[email] === otp) {
            delete emailMatchedWithOTP[email];
            let user = await User.findOne({ email });
            return {
                status: true,
                message: 'otp is correct',
                data: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    linkedIn_email: user.linkedIn_email,

                }
            }
        } else if (emailMatchedWithOTP[email] === undefined) {
            return {
                status: false,
                message: 'otp is not sent to this email',
                data: null
            }

        }

        else {
            return {
                status: false,
                message: 'otp is incorrect',
                data: null
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



const ChangePassword = async ({ email, new_password }) => {
    try {
        let user = await User.findOne({ email });
        if (!user) {

            return {
                status: false,
                message: 'No user exists',
                data: null
            }

        }
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();
        return {
            status: true,
            message: 'success',
            data: user
        }

    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        }
    }
}


module.exports = {
    CreateUser, LoginUser,
    GetUserById, ResetPassword,
    ForgotPassword, VerifyOTP, ChangePassword
};




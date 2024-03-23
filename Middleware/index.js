const { verifyToken } = require("../Controller/Token.Controller");
const User = require("../Model/User.Model");
const extractIdFromLinkedInUrl = require("../Script/ExtractURN");

const VerifyUser = async (req, res, next) => {
    try {
        const token = req?.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.send({
                status: false,
                message: 'Access token is required'
            });
        }

        const isValid = verifyToken(token)


        if (isValid.status) {
            req._id = isValid.payload.user_id;
            req.isTokenExpiring = isValid.payload.isTokenExpiringSoon;
            next()

        } else {
            res.send({
                status: false,
                message: 'Unauthorize Access',
                data: null
            })
        }
    } catch (error) {
        res.send({
            status: false,
            message: 'Server or Verification Error!',
            data: error // Optionally, include the error message
        });

    }

}

const CheckPostCredentials = async (req, res, next) => {
    try {
        const id = req._id
        const user = await User.findById(id).select("+linkedIn_access_token")
        if (!user) {
            return res.status(401).send({
                status: false,
                message: 'Unauthorize Access',
                data: null
            })
        }
        let no_of_left = user.postCount;

        if (no_of_left <= 0) {
            return res.send({
                status: false,
                message: 'You have no post left for this monthes! 😒',
                data: null
            })
        }
        let post_url = req.body.post_url
        let post_urn = extractIdFromLinkedInUrl(post_url)
        console.log(post_urn)
        if (!post_urn) {
            return res.send({
                status: false,
                message: 'Invalid post url',
                data: null
            })
        }
        req.body.urn = post_urn;
        req.user = user;
        next();
    } catch (error) {
        res.send({
            status: false,
            message: 'Server or Verification Error!',
            data: error
        });
    }
}


module.exports = { VerifyUser, CheckPostCredentials }
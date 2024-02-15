const { verifyToken } = require("../Controller/Token.Controller");

const VerifyUser = async (req, res, next) => {
    try {
        const token = req?.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).send({
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
            })
        }
    } catch (error) {
        res.send({
            status: false,
            message: 'Server or Verification Error!',
        })
}

    
}

module.exports = {VerifyUser}
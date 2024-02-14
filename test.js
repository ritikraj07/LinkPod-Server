const { generateAccessToken, verifyToken } = require("./Controller/Token.Controller");

let token = generateAccessToken({user_id:'aois43wlkax'})

console.log(token)

let verifyData = verifyToken(token)

console.log(verifyData)
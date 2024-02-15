const jwt = require('jsonwebtoken')


// const { generateAccessToken, verifyToken } = require("./Controller/Token.Controller");

// let token = generateAccessToken({user_id:'aois43wlkax'})

// console.log(token)


// let verifyData = verifyToken(token)

// console.log(verifyData)


// export function parseJwt(token) {
//     const res = JSON.parse(bf.from(token.split(".")[1], "base64").toString());
//     return res;
// }


function decode(token) {

    return jwt.decode(token)
}

console.log(decode('eyJ6aXAiOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ5Mjk2NjhhLWJhYjEtNGM2OS05NTk4LTQzNzMxNDk3MjNmZiIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJodHRwczovL3d3dy5saW5rZWRpbi5jb20iLCJhdWQiOiI3N2pidmpyM3JuYmN0YyIsImlhdCI6MTcwNzY2NDg2NiwiZXhwIjoxNzA3NjY4NDY2LCJzdWIiOiJiUVhkbmdEWVo0IiwibmFtZSI6IlJpdGlrIFJhaiIsImdpdmVuX25hbWUiOiJSaXRpayIsImZhbWlseV9uYW1lIjoiUmFqIiwicGljdHVyZSI6Imh0dHBzOi8vbWVkaWEubGljZG4uY29tL2Rtcy9pbWFnZS9ENEQwM0FRSDVLdGludkJub3lnL3Byb2ZpbGUtZGlzcGxheXBob3RvLXNocmlua18xMDBfMTAwLzAvMTY3NTI3NjQwNTc5MT9lPTIxNDc0ODM2NDcmdj1iZXRhJnQ9a01WVWw0NE1RNWdNLVV4dEYxYlpFekc4V0c4UFlrUG1uV016ZGd3dEJRQSIsImVtYWlsIjoicml0aWtyYTNycnJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwibG9jYWxlIjoiZW5fVVMifQ.m8IxeGKy0wKrH4ijgTNeWylrXYJTntpQ_x8lKC5UEc0pyzN_N48gFQ6uSZwyOi2n_qa5cTQ0G-8ze-aptyhdeeDcAz9FMxj2uNspcQt1fjgp-Rpa9rAtuWUu8T6ckHJDLW47ZKuZ7sZrLUhu0BRo_P_5Z4MsLeLHHZmItxlQdosm4Ge-XPm5UzrY2_5al9Vu57Ec_0cED9nbaw4nLrndNAANfM9mCk1OftnOGdJw13HVeL_ASTa3dRWm2sYGW7CkIxGSYg87_8ULBQAsDeeeCaxahJpMXiuHI3drYf_gIE1rwM6omhiyJ8LWf3nPHzSQYfBQLAm06g4WuhmDx1I-ni7u9I0pQmtWZwEU1oKd73aHty8qnb5p3n9xGI744xgqIIMiYirmofRUzYhARJHx_mkvGKJq9ZG5h89gSDkqV0qO1GqTsxZN6qeAHnLVapSfEncXjmhdXpfsCQxFjb9phlvaU-LeTk0r7G_yuG_40oIyElM9d3KlifjHVsaZfq66qAdxR3gSkZi065W6IW9JXIk7XfRJQcUWPbvoZciaPPNyNdFQf7aPHiE4pZpJcoQUi7dWeFeiYkirub1T_i0qkrc5gcHX-iqOykWvJuzPzR96OrSTIX_G0lWyJzGaJWmfl7kYKSMKXNLYN_nwRKF5GKFGbiHAz7JzxAw2NH6niMQ'))


/*
{
  iss: 'https://www.linkedin.com',
  aud: '77jbvjr3rnbctc',
  iat: 1707664866,
  exp: 1707668466,
  sub: 'bQXdngDYZ4',
  name: 'Ritik Raj',
  given_name: 'Ritik',
  family_name: 'Raj',
  picture: 'https://media.licdn.com/dms/image/D4D03AQH5KtinvBnoyg/profile-displayphoto-shrink_100_100/0/1675276405791?e=2147483647&v=beta&t=kMVUl44MQ5gM-UxtF1bZEzG8WG8PYkPmnWMzdgwtBQA',
  email: 'ritikra3rrr@gmail.com',
  email_verified: 'true',
  locale: 'en_US'
}

*/
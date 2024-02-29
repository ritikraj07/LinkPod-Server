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


// function decode(token) {

//     return jwt.decode(token)
// }

// console.log(decode('AQQoXKsoUe_JYTfMgsLWflPrF93TycwiwTM8kLJLoTY0Yzrmar_jwYCC4VVRZltncMTv6CmkbeuulB7709tJw0TjzKzDOOSJB1YwRjgUxW_D7ym3Kh6A_irsRhBT3u9xIbsWEkXprO3cAW6erQHzKnrx2lXxVv4llwQoBK8b-tlVxjwq800eH-fMtelq1ObqSV9hHRQ_ndUNdMpnxUQ'))


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



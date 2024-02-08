const { Router } = require("express")
const { createUser, updateUser, getUserById, searchUser } = require("../Controller/User.Controller")

const userRouter = Router()

userRouter.post('/', async (req, res) => {
    let body = req.body
    console.log(body)
    let user = await createUser({ body })
    res.send({
        responce: user
    })
})


userRouter.patch('/id/:id', async (req, res) => {
    let id = req.params.id
    let body = req.body
    let user = await updateUser({ id, body })

    return res.send({
        responce: user
    })
})

userRouter.get('/id/:id', async (req, res) => {
    let _id = req.params.id
    let user = await getUserById(_id)
    return res.send({
        responce: user
    })
})

userRouter.get('/search', async (req, res) => {
    let { high_age, low_age, gender,
        breed, original, Latitude,
        Longitude, maxDistance } = req.query
    
    console.log(high_age, low_age, gender,
        breed, original, Latitude,
        Longitude, maxDistance)
    
    let user = await searchUser({
        high_age, low_age, gender,
        breed, original, Latitude,
        Longitude, maxDistance
    })
    
    return res.send({
        response: user
    })
} )

module.exports = userRouter



// {
//     "responce": {
//         "petName": "King",
//             "ownerName": "Ritik",
//                 "age": 12,
//                     "email": "king@gmail.com",
//                         "password": "2435234",
//                             "_id": "6523fc50ee11828d8ac1bab1",
//                                 "createdAt": "2023-10-09T13:12:48.613Z",
//                                     "updatedAt": "2023-10-09T13:12:48.613Z",
//                                         "__v": 0
//     }
// }

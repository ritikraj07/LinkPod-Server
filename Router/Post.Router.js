const { Router } = require('express');
const { VerifyUser, CheckPostCredentials } = require('../Middleware');
const { CreatePost } = require('../Controller/Post.Controller');

const PostRouter = Router();

/****************************************POST REQUESTS***********************************************/
PostRouter.post('/create',VerifyUser, CheckPostCredentials, async (req, res) => {
    let { title, description, urn } = req.body
    let created_by = req._id
    let response = await CreatePost({ title, description, urn, created_by })
    res.send(response)
});


/****************************************GET REQUESTS***********************************************/

PostRouter.get('/', VerifyUser, CheckPostCredentials, async (req, res) => {
  
})





module.exports = PostRouter
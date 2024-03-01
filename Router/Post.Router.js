const { Router } = require('express');
const { VerifyUser, CheckPostCredentials } = require('../Middleware');
const { CreatePost, GetPostInfoById } = require('../Controller/Post.Controller');

const PostRouter = Router();

/****************************************POST REQUESTS***********************************************/
PostRouter.post('/create',VerifyUser, CheckPostCredentials, async (req, res) => {
    let { title, description, urn, pod_id, avgTime } = req.body
    let created_by = req._id
    let response = await CreatePost({ title, description, urn, created_by, pod_id, avgTime })
    res.send(response)
});


/****************************************GET REQUESTS***********************************************/

PostRouter.get('/:id', VerifyUser, async(req, res)=> {
    let id = req.params.id
    let response = await GetPostInfoById(id);
    res.send(response)
})





module.exports = PostRouter
const { Router } = require('express');
const { VerifyUser, CheckPostCredentials } = require('../Middleware');
const { CreatePost, GetPostInfoById, DeletePost } = require('../Controller/Post.Controller');

const PostRouter = Router();

/****************************************POST REQUESTS***********************************************/
PostRouter.post('/create', VerifyUser, CheckPostCredentials, async (req, res) => {
    let { title, urn, pod_id, avgTime } = req.body
    let created_by = req._id
    let user = req.user
    let response = await CreatePost({ title, urn, created_by, pod_id, avgTime, user })
    res.send(response)

});


/****************************************GET REQUESTS***********************************************/

PostRouter.get('/:id', VerifyUser, async (req, res) => {
    let id = req.params.id
    let response = await GetPostInfoById(id);
    res.send(response)
})


/****************************************DELETE REQUESTS***********************************************/

PostRouter.delete('/:id', VerifyUser, async (req, res) => {
    let id = req.params.id
    let response = await DeletePost(id);
    res.send(response)
    
})


module.exports = PostRouter
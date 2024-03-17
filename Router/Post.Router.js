const { Router } = require('express');
const { VerifyUser, CheckPostCredentials } = require('../Middleware');
const { CreatePost, GetPostInfoById, DeletePost, SearchForPost } = require('../Controller/Post.Controller');

const PostRouter = Router();

/****************************************POST REQUESTS***********************************************/
PostRouter.post('/create', VerifyUser, CheckPostCredentials, async (req, res) => {
    let { title, urn, pod_id, avgTime, comments, post_url } = req.body
    let created_by = req._id
    let user = req.user
    let response = await CreatePost({
        title, urn, created_by,
        pod_id, avgTime, user, comments,
        post_url
    })
    res.send(response)

});


/****************************************GET REQUESTS***********************************************/

PostRouter.get('/:id', VerifyUser, async (req, res) => {
    let id = req.params.id
    let response = await GetPostInfoById(id);
    res.send(response)
})

PostRouter.get('/search', VerifyUser, async (req, res) => {
    let { q } = req.query
    let response = await SearchForPost(q)
    res.send(response)
})


/****************************************DELETE REQUESTS***********************************************/

PostRouter.delete('/:id', VerifyUser, async (req, res) => {
    let id = req.params.id
    let response = await DeletePost(id);
    res.send(response)
    
})


module.exports = PostRouter
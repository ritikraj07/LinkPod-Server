const { Router } = require('express')
const { VerifyUser } = require('../Middleware');
const { CreatePod, JoinPod,LeavePod, EditNameOrDesOfPod, DeletePod, RemoveMemberFromPod, searchPods, AllPods } = require('../Controller/Pods.Controller');

const PodRouter = Router()

/******************************************* POST REQUEST ********************************************/
/*
CREATE POD
Join Pod
 */

PodRouter.post('/create', VerifyUser, async (req, res) => {
    let _id = req?._id;
    let { user_name, pod_name, description } = req?.body;
    let response = await CreatePod({ _id, user_name, description, pod_name })
    res.send(response)
})

PodRouter.post('/join/:pod_id', VerifyUser, async (req, res) => {
    let _id = req?._id
    let pod_id = req?.params.pod_id
    let response = await JoinPod({ _id, pod_id })
    res.send(response)
})



/******************************************* GET REQUEST ********************************************/
/*
    FIND POD
    SEARCH POD
 */


PodRouter.get('/search', VerifyUser, async (req, res) => {
    let { query } = req.query
    let response = await searchPods(query)
    res.send(response)
})

PodRouter.get('/all', VerifyUser, async (req, res) => {
    let response = await AllPods()
    res.send(response)
})


/******************************************* PATCH REQUEST ********************************************/
/*
    REMOVE MEMBER
    LEAVE POD
    EDIT POD NAME OR DESCRIPTION
*/

// request should be by admin of pod
PodRouter.patch('/remove-member/:member_id', VerifyUser, async (req, res) => {
    let admin_id = req._id;
    let member_id = req.params.member_id
    let response = await RemoveMemberFromPod(admin_id, member_id)
    res.send(response)
})

PodRouter.patch('/leave', VerifyUser, async (req, res) => {
    let _id = req._id
    let pod_id = req.query.pod_id
    let response = await LeavePod(pod_id, _id);
    res.send(response)
})

PodRouter.patch('/edit-name-des', VerifyUser, async (req, res) => {
    let { pod_id, name, description } = req.body
    let admin_id = req._id
    let response = await EditNameOrDesOfPod(admin_id, pod_id, name, description)
    res.send(response)
})


/******************************************* DELETE REQUEST ********************************************/

/*
    DELETE POD
*/

PodRouter.delete('/delete', VerifyUser, async (req, res) => {
    let user_id = req._id;
    let { pod_id } = req.query
    let response = await DeletePod(user_id, pod_id)
    res.send(response)
})



module.exports = PodRouter;
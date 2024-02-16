const Pod = require("../Model/Pod.Model")

const CreatePod = async ({ _id, user_name, description, pod_name }) => {
    try {
        const pod = await Pod.create({
            name: pod_name, description: description,
            admin_id: _id, admin_name: user_name
        })

        return {
            status: true,
            data: pod,
            message: 'success'
        }

    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        }
    }
}

const JoinPod = async ({ _id, pod_id }) => {
    try {
        let pod = await Pod.findById(pod_id);
        if (!pod) {
            return {
                status: false,
                message: 'No pod found with this id'
            };
        }

        pod.member_id.push(_id);
        await pod.save();

        return {
            status: true,
            data: pod,
            message: 'You joined the pod successfully'
        };
    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        };
    }
};


const DeletePod = async (admin_id, _id) => {
    try {
        // Find and delete the pod in one shot
        const deletedPod = await Pod.findOneAndDelete({ _id, admin_id });

        // Check if the pod was found and deleted
        if (!deletedPod) {
            return {
                status: false,
                message: 'No pod found with the given id or you are not the admin of this pod'
            };
        }

        return {
            status: true,
            message: 'Pod deleted successfully'
        };
    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        };
    }
};



const RemoveMemberFromPod = async (admin_id, user_id) => {
    try {
        // Find the pod where the admin_id matches and the user_id exists in the member_id array
        const pod = await Pod.findOneAndUpdate(
            { admin_id, member_id: user_id },
            { $pull: { member_id: user_id } },
            { new: true }
        );

        // Check if the pod exists
        if (!pod) {
            return {
                status: false,
                message: 'User is not a member of this pod or no pod found with the given admin id'
            };
        }

        return {
            status: true,
            message: 'Member removed successfully'
        };
    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        };
    }
};


const LeavePod = async (_id, member_id) => {
    try {
        const updatedPod = await Pod.findByIdAndUpdate(
            _id,
            { $pull: { member_id: member_id } },
            { new: true }
        );

        if (!updatedPod) {
            return {
                status: false,
                message: 'No pod found with this id'
            };
        }

        return {
            status: true,
            message: 'Successfully left the pod'
        };
    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        };
    }
};
const EditNameOrDesOfPod = async (admin_id, _id, name, description) => {
    try {
        // Find and update the pod in one shot
        const updatedPod = await Pod.findOneAndUpdate(
            { _id, admin_id }, // Criteria to find the pod
            { $set: { name, description } }, // Update fields
            { new: true } // Return the updated document
        );

        // Check if the pod was found and updated
        if (!updatedPod) {
            return {
                status: false,
                message: 'No pod found with the given id or you are not the admin of this pod'
            };
        }

        return {
            status: true,
            message: 'Pod details updated successfully'
        };
    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        };
    }
};


const SearchInPod = async (podId, searchTerm) => {
    try {
        const pod = await Pod.findById(podId);
        if (!pod) {
            return {
                status: false,
                message: 'No pod found with this id'
            };
        }

        const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search term regex

        // Use aggregation pipeline to search for name or description
        const results = await Pod.aggregate([
            { $match: { _id: pod._id } }, // Match the specific pod
            {
                $project: {
                    _id: 0, // Exclude _id from the results
                    name: 1, // Include name field
                    description: 1, // Include description field
                    score: {
                        $sum: [
                            { $cond: [{ $regexMatch: { input: '$name', regex: regex } }, 1, 0] }, // Add 1 if name matches
                            { $cond: [{ $regexMatch: { input: '$description', regex: regex } }, 1, 0] } // Add 1 if description matches
                        ]
                    }
                }
            },
            { $match: { score: { $gt: 0 } } }, // Filter documents with a non-zero score
            { $sort: { score: -1 } } // Sort by score in descending order
        ]);

        return {
            status: true,
            message: 'Search successful',
            data: results
        };
    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        };
    }
};



module.exports = {
    CreatePod, JoinPod,
    DeletePod, RemoveMemberFromPod,
    LeavePod, EditNameOrDesOfPod,
    SearchInPod
}
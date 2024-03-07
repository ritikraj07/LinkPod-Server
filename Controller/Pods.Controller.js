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
        let pod = await Pod.findById(pod_id).select('+member_id');
     
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
                message: 'No pod found with the given id or you are not the admin of this pod',
                data: null
            };
        }

        return {
            status: true,
            message: 'Pod deleted successfully',
            data: deletedPod
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
        
        const updatedPod = await Pod.findOneAndUpdate(
            { _id, admin_id }, 
            { $set: { name, description } }, 
            { new: true }
        )

        console.log(updatedPod)
        if (!updatedPod) {
            return {
                status: false,
                message: 'No pod found with the given id or you are not the admin of this pod'
            };
        }
        
        return {
            status: true,
            message: 'Pod details updated successfully',
            data: updatedPod,
        };
    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        };
    }
};


const searchPods = async (searchTerm) => {
    try {
        // Construct the query object to search for pods with matching name or description
        const query = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }, // Search for name containing the searchTerm (case-insensitive)
                { description: { $regex: searchTerm, $options: 'i' } } // Search for description containing the searchTerm (case-insensitive)
            ]
        };

        // Use the constructed query object to find pods that match the criteria
        const pods = await Pod.find(query);

        return {
            status: true,
            message: 'Search successful',
            data: pods
        };
    } catch (error) {
        return {
            status: false,
            message: 'Server Error!',
            data: error
        };
    }
};


const AllPods = async () => {
    try {
        const allPods = await Pod.find().sort({ member_count: 1 }).limit(20)
        return {
            status: true,
            message: 'success',
            data: allPods
        }
    }catch(error){
        return {
            status: false,
            message: 'Server Error!',
            data: error
        }
    }
}

module.exports = {
    CreatePod, JoinPod,
    DeletePod, RemoveMemberFromPod,
    LeavePod, EditNameOrDesOfPod,
    searchPods, AllPods
}
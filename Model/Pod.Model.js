const { model, Schema } = require('mongoose')


const PodSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    member_id: [String],
    admin_id: {
        type: String,
        required: true
    },
    admin_name: {
        type: String,
        required: true
    }

},
    {
        timestamps: true,
    })



const Pod = model('Pod', PodSchema)

module.exports = Pod
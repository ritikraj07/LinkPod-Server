const { model, Schema } = require('mongoose');

const PodSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    member_id: {
        type: [String],
    },
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
        toJSON: { virtuals: true } // Enable virtual fields to be included in JSON output
    });

// Define a virtual field for member_count
PodSchema.virtual('member_count').get(function () {
    return this.member_id?.length;
});

const Pod = model('Pod', PodSchema);

module.exports = Pod;

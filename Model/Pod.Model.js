const { model, Schema } = require('mongoose');

const PodSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    member_id: {
        type: [String],
        select: false
    },
    admin_id: {
        type: String,
        required: true
    },
    admin_name: {
        type: String,
        required: true
    },
    member_count: {
        type: Number,
        default: function () {
            return this.member_id ? this.member_id.length : 0;
        }
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true } // Enable virtual fields to be included in JSON output
    });

PodSchema.pre('save', function (next) {
    if (this.isModified('member_id')) {
        this.member_count = this.member_id ? this.member_id.length : 0;
    }
    next();
})

const Pod = model('Pod', PodSchema);

module.exports = Pod;

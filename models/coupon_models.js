const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "coupone name is required"],
        unique: [true, "coupone name is unique"],
    },
    expire: {
        type: Date,
        required: [true, "coupone expiry date is required"],
    },
    discount: {
        type: Number,
        required: [true, "coupone discount is required"],
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Coupon', couponSchema)
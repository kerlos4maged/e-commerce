const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: true,
        },
        cart: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'productModel',
                    required: true,
                },
                quantity: {
                    type: Number,
                },
                color: {
                    type: String,
                },
                price: {
                    type: Number,
                }
            },

        ],
        shippingAddress: {
            details: String,
            phone: String,
            city: String,
            postalCode: String,
        },
        taxPrice: {
            type: Number,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        totalOrderPrice: {
            type: Number,
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'cash'],
            default: 'cash'
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliverdAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
)

orderSchema.pre('find', function (next) {
    this
        .populate(
            { path: 'user', select: 'name email phone profileImage', },
        ).populate(
            { path: 'cart.product', select: 'title imageCover' }
        )
    next()
})

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: true
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'productModel',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                },
                colors: {
                    type: String,
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        total: {
            type: Number,
            required: [true,"total price is required"]
        },
        priceAfterDiscount: {
            type: Number,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('cart', cartSchema)
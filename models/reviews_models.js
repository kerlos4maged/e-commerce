const mongoose = require('mongoose');

const productModel = require('./product_models')

const reviewsSchema = new mongoose.Schema(
    {
        title: { type: 'string' },
        rating: {
            type: 'number',
            min: [0, "min value is 0"],
            max: [5, "max value is 5"],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, "review must belong to user"]
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'productModel',
            required: [true, "review must belong to product"]
        },
    }, {
    timestamps: true,
})

function populateReview(next) {
    this.populate({ path: "user", select: 'name' })

    next()
}

reviewsSchema.pre(/^find/, populateReview)

// aggregate method to make review average 
reviewsSchema.statics.calcAverageRatingsAndQuantity = async function (productId) {
    const result = await this.aggregate([
        // 1- get all reviews in specific product
        {
            $match: { product: productId }
        },
        // 2- create group for those reviews on specific product
        {
            $group: {
                _id: 'product',
                averageRating: { $avg: '$rating' },
                averageQuantity: { $sum: 1 }
            }
        },

    ])
    if (result.length > 0) {
        await productModel.findByIdAndUpdate(
            productId,
            {
                ratingsAverage: result[0].averageRating,
                reviewQuantity: result[0].averageQuantity
            },

        )
    } else {
        await productModel.findByIdAndUpdate(
            productId,
            {
                ratingsAverage: 0,
                reviewQuantity: 0
            },

        )
    }
}

reviewsSchema.post('save', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

// this init we create it only for testing init from apiService
// reviewsSchema.post('init', function () {
// })

reviewsSchema.post('deleteOne', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
})

const model = mongoose.model('Review', reviewsSchema);

module.exports = model
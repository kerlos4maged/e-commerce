/* eslint-disable array-callback-return */
const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "too short Product title"],
            maxlength: [100, "too long Product title"]
        },
        slug: {
            type: String,
            lowercase: true,
            required: true,

        },
        description: {
            type: String,
            required: [true, "description is required"],
            minlength: [20, "too short Product description"],

        },
        quantity: {
            type: Number,
            required: [true, "quantity is required"]
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "price is required"],
            trim: true,
            max: [2000000, "price is too long"],

        },
        priceAfterDiscount: {
            type: Number,

        },
        colors: [
            String
        ],
        imageCover: {
            type: String,
            required: [true, "product image is required"]
        },
        images: [
            String
        ],
        // this is product will be belongs to category so will add category
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category model",
            required: [true, "product must be belong to category",]
        },
        subcategories: [{
            type: mongoose.Schema.ObjectId,
            ref: "SubCategory",
        }],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: "brand",
        },
        // focus when object type will be number using min and max not minLength and maxLength
        ratingsAverage: {
            type: Number,
            min: 0,
            max: [5, ""]
        },
        reviewQuantity: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
        // to enables virtuals populate
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

schema.virtual(
    'review', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
})

schema.pre(/^find/, function (next) {
    this.populate({ path: "category model", select: '-_id name' })
    next()
})

schema.pre(/^find/, function (next) {
    this.populate({ path: "SubCategory", select: '-_id name' })
    next()
})

const docItemMiddleware = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/prodact/${doc.category}/${doc.imageCover}`
        doc.imageCover = imageUrl
    }

    if (doc.images) {
        const imagesList = []
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/prodact/${doc.category}/${image}`
            imagesList.push(imageUrl)
        })
        doc.images = imagesList
    }
}

schema.post('init', (data) => docItemMiddleware(data))

schema.post('save', (data) => docItemMiddleware(data))

const model = mongoose.model("productModel", schema)

module.exports = model
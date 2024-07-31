const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true, // this is for remove any space from the user
            unique: [true, "Subcategory must be unique"],
            minlength: [2, "too short SubCategory name"],
            maxlength: [80, "too long SubCategory name"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category model",
            required: [true, "SubCategory must be belong to parent category",]
        }
    },
    {timestamps: true}
)

subCategorySchema.pre(/^find/, function (next)  {
    this.populate({path: "category model", select: '-_id name'})
    next()
})

module.exports = mongoose.model("SubCategory", subCategorySchema)
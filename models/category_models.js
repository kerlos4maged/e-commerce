
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category required"],
        unique: [true, "Category Must be unique"],
        minlength: [3, "too short category"],
        maxlength: [32, "too long category name"]
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: {
        type: String,
    }
},
    { timestamps: true }
)

const categoryModel = mongoose.model("category model", schema)

module.exports = categoryModel
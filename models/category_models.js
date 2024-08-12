
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

const docItemMiddleware = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`
        doc.image = imageUrl
    }
}

// this is post middleware used for save data into database and after this will create operation 
// will worked with -> find and update on category without create
schema.post('init', (doc) => docItemMiddleware(doc))

schema.post('save', (doc) => docItemMiddleware(doc))

const categoryModel = mongoose.model("category model", schema)

module.exports = categoryModel
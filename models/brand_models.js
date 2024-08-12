const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand required"],
            unique: [true, "Brand Must be unique"],
            minlength: [3, "too short Brand"],
            maxlength: [32, "too long Brand name"]
        },
        slug: {
            type: String,
            lowercase: true,
        },
        image: {
            type: String,
        }

    },
    {
        timestamps: true
    }
)

schema.pre(/^find/, function (next) {
    this.populate({ path: "category model", select: '-_id name' })
    next()
})

const docItemMiddleware = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brand/${doc.image}`
        doc.image = imageUrl
    }
}

// this is post middleware used for save data into database and after this will create operation 
// will worked with -> find , update , delete and findOne on category without create
schema.post('init', (doc) => docItemMiddleware(doc))

// save -> worked with create 
schema.post('save', (doc) => docItemMiddleware(doc))

const brandModel = mongoose.model("brand", schema)

module.exports = brandModel
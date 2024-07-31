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

schema.pre(/^find/, function (next)  {
    this.populate({path: "category model", select: '-_id name'})
    next()
})

const brandModel = mongoose.model("brand", schema)

module.exports = brandModel
const mongoose = require('mongoose');
const bycryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Name is required"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            unique: [true, "Email must be unique"],
            required: [true, "Email is required"],
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Invalid email format"],
        },
        phone: String,
        profileImage: String,
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpiresAt: Date,
        passwordRestVerification: Boolean,
        // passwordConfirmation: {
        //     type: String,
        //     // required: [true, "Confirm Password is required"],
        //     // validate: {
        //     //     validator: function (confirmPassword) {
        //     //         return confirmPassword === this.password;
        //     //     },
        //     //     message: "Passwords do not match"
        //     // }
        // },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        active: {
            type: Boolean,
            default: true,
        },
        wichlist: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'productModel',

            }
        ],
        addresses: [
            {
                id: { type: mongoose.Schema.Types.ObjectId, },
                alias: String,
                details: String,
                phone: String,
                city: String,
                postalCode: String,
            }
        ]
    },
    { timestamps: true, strict: false }
)


const fullImageUrlMiddleware = (doc) => {
    if (doc.profileImage) {
        const profileImageUrl = `${process.env.BASE_URL}/userImage/${doc.profileImage}`
        doc.profileImage = profileImageUrl
    }
}

userSchema.post('init', (data) => fullImageUrlMiddleware(data))

userSchema.post('save', (data) => fullImageUrlMiddleware(data))

userSchema.pre('save', async function (next) {
    // hashing user password 
    this.password = await bycryptjs.hash(this.password, 12)
    // this.passwordConfirmation = await bycryptjs.hash(this.passwordConfirmation, 12)
    next()
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel
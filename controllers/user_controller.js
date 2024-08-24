// this is file for only user crud operations (create new user, read users, update user data, delete user)

const sharp = require('sharp');

const expressAsyncHandler = require('express-async-handler');

const { uuid } = require('uuidv4');

const bycryptjs = require('bcryptjs');

const userModel = require('../models/user_models')

const apiService = require('../utils/apiServices')

const { uploadSingleImage } = require('../middlewares/uploadImage');

const ApiError = require('../utils/api_error');

const uploadUserImage = uploadSingleImage('profileImage')

const resizeUserImage = expressAsyncHandler(
    async (req, res, next) => {
        const fileName = `user-called-${req.body.email}-${uuid()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(150, 150)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`upload/userImage/${fileName}`)
        req.body.profileImage = fileName
        next()
    }
)

const { generateToken } = require('../utils/generate_new_token')

const createUser = apiService.createService(userModel)

const getAllUsers = apiService.getAllDocumentsService(userModel, "userModel")

const getUserById = apiService.getSpecificDocumentService(userModel)

const updateUser = expressAsyncHandler(async (req, res, next) => {

    const item = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileImage: req.body.profileImage,
            address: req.body.address,
            role: req.body.role,
            active: req.body.active || true,
        },
        { new: true })
    if (item) {
        return res.status(200).json({ "status": "success", "document": item })
    }
    next(new ApiError(`can't find the item please change ${req.params.id}`, 404))
})

// const deleteUser = expressAsyncHandler(async (req, res) => {
//     const { id } = req.params
//     const user = await userModel.findByIdAndUpdate(id, { active: false }, { new: true })
//     if (!user) {
//         return res.status(404).json({ message: 'User not found.' })
//     }
//     res.status(200).send(user)
// })

const deleteUser = apiService.deleteService(userModel)

// this is my creation of a new password 
// this is way will create to check current password and make check in new password and new confirmation password -> but this way will create on validation better
// const changeUserPassword = expressAsyncHandler(
//     async (req, res) => {
//         const user = await userModel.findById(req.params.id)
//         if (user) {
//             const currentPassword = user.password
//             const isMatch = await bycryptjs.compare(req.body.password, currentPassword)
//             if (!isMatch) {
//                 return res.status(401).json({ message: 'Current password is incorrect.' })
//             }

//             const hashedPassword = await bycryptjs.hash(req.body.newPassword, 10)

//             const updatedUser = await userModel.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true })

//             res.status(200).json({ "status": "success", "document": updatedUser })

//         }
//     }
// )

// this is instractor createion 
const changeUserPassword = expressAsyncHandler(async (req, res, next) => {

    const item = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            password: await bycryptjs.hash(req.body.newPassword, 12),
            passwordChangedAt: Date.now()
        },
        { new: true })

    if (item) {
        return res.status(200).json({ "status": "success", "document": item })
    }
    next(new ApiError(`can't find the item please change ${req.params.id}`, 404))
})

// desc: middleware for get user information for logged users only 
// public 

const getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
    // console.log(`req.params.user value -> ${req.user._id}`)
    console.log(`req.params.user value -> ${req.user._id}`)
    req.params.id = req.user._id
    next()
})

const updateLoggedUserPassword = expressAsyncHandler(async (req, res, next) => {
    if (!req.body.password) {
        return next(new ApiError('New password is required.', 400))
    }
    // 1- get the user based on the user._id value
    // note: this user we get the _id from it -> we add after checking all states in protected middleware
    const item = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            password: await bycryptjs.hash(req.body.password, 12),
            passwordChangedAt: Date.now()
        },
        { new: true }
    )

    if (!item) {
        return next(new ApiError("new password is weak...", 400));
    }
    // 2- generation new token to logout and login again 
    const token = generateToken(item._id)

    // console.log(
    //     `we create new token from user controller file ${token}`
    // )

    res.status(201).json({ "Status": "Sucess", token, "user": item })
})

// update logged user data without (password and role)

const updateLoggedUserData = expressAsyncHandler(async (req, res, next) => {
    const userUpdated = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
        },
        { new: true })
    if (!userUpdated) {
        return next(new ApiError(`can't find the user please change ${req.user._id}`, 404))
    }
    res.status(200).json({ "status": "success", "user": userUpdated })
})

const deActivateUser = expressAsyncHandler(async (req, res, next) => {
    await userModel.findByIdAndUpdate(req.user._id, { active: false })
    res.status(201).send({ "Status": "success" })
})

const activateUser = expressAsyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email })

    if (user.active === true) {
        next(new ApiError("you have already activa account", 401));
    }
    user.active = true
    await user.save()
    // generate token for new user
    const token = generateToken(user._id)
    res.status(201).send({ "status": "success", "token": token })
})

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeUserImage,
    changeUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deActivateUser,
    activateUser,
}
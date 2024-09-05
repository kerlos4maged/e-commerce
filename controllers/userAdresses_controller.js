const asyncHandler = require('express-async-handler')

const userModel = require('../models/user_models')

const addAddress = asyncHandler(async (req, res, next) => {
    const currentUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $push: { addresses: req.body }
        },
        { new: true }
    )
    res.status(201).json({
        status: 'success',
        message: 'user address added successfully',
        address: currentUser.addresses
    })
})

const removeAddress = asyncHandler(async (req, res, next) => {
    const currentUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                addresses:
                    { _id: req.params.addressId }
            }
        },
        { new: true }
    )
    res.status(200).json({
        status: 'success',
        message: 'user address removed successfully',

        addresses: currentUser.addresses
    })
})

const getAddress = asyncHandler(async (req, res, next) => {
    const currentUser = await userModel.findById(req.user._id).populate('addresses')

    res.status(200).json({
        status: 'success',
        length: currentUser.addresses.length,
        Address: currentUser.addresses
    })
})

module.exports = {
    addAddress,
    removeAddress,
    getAddress
}
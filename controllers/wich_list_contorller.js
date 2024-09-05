const asyncHandler = require('express-async-handler')

const userModel = require("../models/user_models")
const ApiError = require('../utils/api_error')

const setProductToWichList = asyncHandler(async (req, res, next) => {

    const currentUser = await userModel.findByIdAndUpdate(
        req.user._id, {
        // addToSet : this is operator will set item to array and if item already exists will be overwritten
        $addToSet: {
            wichlist: req.body.product
        },

    }, { new: true }
    )
    res.status(201).json({ status: "Success", message: 'Product added to wishlist', data: currentUser.wichlist })
})

const removeProductFromWichList = asyncHandler(
    async (req, res, next) => {
        const currentUser = await userModel.findByIdAndUpdate(
            req.user._id, {
            // pull : this is operator will remove item from array
            $pull: {
                wichlist: req.params.productId
            },
        },
            { new: true }
        )
        await currentUser.save()
        res.status(201).json({
            status: "Success",
            message: 'Product removed from wishlist',
            data: currentUser.wichlist
        })
    }
)

const getUserWishlist = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.findById(req.user._id).populate('wichlist')
        if (!user) {
            return next(new ApiError('User not found', 404))
        }
        res.status(200).json({
            status: "Success",
            length: user.wichlist.length,
            wishListData: user.wichlist
        })

    })

module.exports = {
    setProductToWichList,
    removeProductFromWichList,
    getUserWishlist
}
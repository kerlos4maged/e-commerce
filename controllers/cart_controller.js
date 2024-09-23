const asyncHandler = require('express-async-handler')
const cartModel = require('../models/cart_models')
const productModel = require('../models/product_models')
const ApiError = require('../utils/api_error')
const couponModel = require('../models/coupon_models')


const calcPrice = (cart) => {

    let totalPrice = 0
    cart.products.forEach(item => {
        totalPrice += item.price * item.quantity
    })
    cart.total = totalPrice
    cart.priceAfterDiscount = undefined
    return totalPrice
}

const calcCartQuantity = (cart) => {
    let cartItemsSize = 0
    cart.products.forEach((item) => {
        cartItemsSize += item.quantity
    })
    return cartItemsSize
}

// add product to cart belong to user 
// post api/v1/cart/
// private only users can access his cart 

const addProductToCart = asyncHandler(
    // you have three scenarios 
    // 1- if product is already in cart -> increase quantity
    // 2- if product is not in cart -> add it to cart
    // 3- if same product need to be added but will change the color -> new product 
    async (req, res, next) => {
        const { productId, color } = req.body
        // steps 
        // 1- get cart for user 
        let cart = await cartModel.findOne({ user: req.user._id })
        const productPrice = await productModel.findOne({
            _id: productId,
            colors: { $in: req.body.color }
        })
        if (!productPrice) {
            return next(new ApiError('Product or color for this product not found', 404))
        }
        if (productPrice.quantity <= 0) {
            return next(new ApiError('Product Sold out', 404))
        }
        if (!cart) {
            // create new cart and add this product to cart
            cart = await cartModel.create({
                user: req.user._id,
                products: [
                    {
                        product: productId,
                        colors: color,
                        price: productPrice.price,
                    }
                ],
                total: productPrice.price,
            })
            // await cart.save()

        } else {
            // if cart found this is mean the user has already cart in two cases

            // 1- case one: the product already exists in the cart -> update the quantity + 1
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId.toString()
                    && item.colors.toString() === color
            )

            if (productIndex > -1) {
                const cartItemIndex = cart.products[productIndex]

                if (productPrice.quantity <= cartItemIndex.quantity) {
                    return next(new ApiError("quantity must be less than product quantity", 400))
                }

                cartItemIndex.quantity += 1

                cart.products[productIndex] = cartItemIndex
                // we can set this way to calc price but will create method to calculate it like instracture
                // cart.total += productPrice.price

            }
            // 2- case two: the product don't exist in the cart -> push to the cart
            else {
                // we can set this way to calc price but will create method to calculate it like instracture
                // cart.total += productPrice.price
                cart.products.push({
                    product: productId,
                    colors: color,
                    price: productPrice.price,
                    priceAfterDiscount: req.body.priceAfterDiscount
                })
            }
        }


        calcPrice(cart)
        const cartItemsSize = calcCartQuantity(cart)
        await cart.save()

        res.status(201).json({
            status: 'success',
            message: 'product added to cart successfully',
            cartQunetitySize: cartItemsSize,
            cartProductSize: cart.products.length,
            data: cart
        })
    }
)

const getCartDataToUser = asyncHandler(async (req, res, next) => {
    if (!req.user._id) {
        return next(new ApiError("this user is not logged in", 404));
    }
    const cartData = await cartModel.findOne({ user: req.user._id }).populate('products.product')
    if (!cartData) {
        return res.status(200).send({
            status: "success",
            message: "this user not have cart",
            items: []
        });
    }

    const cartItemsSize = calcCartQuantity(cartData)

    res.status(200).json({
        status: 'success',
        message: 'product added to cart successfully',
        cartQunetitySize: cartItemsSize,
        cartProductSize: cartData.products.length,
        data: cartData
    })
})

const deleteCartController = asyncHandler(async (req, res, next) => {
    const findCart = await cartModel.findOneAndDelete({ user: req.user._id })
    if (!findCart) {
        return next(new ApiError('Cart not found', 404))
    }
    res.status(200).json({
        status: 'success',
        message: 'Cart deleted successfully'
    })
})

const deleteSpecificCartItemController = asyncHandler(async (req, res, next) => {
    const findCart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: {
                products:
                    { _id: req.params.cartItemId },

            }
        },
        { new: true }
    )
    if (!findCart) {
        return next(new ApiError('Cart not found', 404))
    }
    calcPrice(findCart)
    const cartItemsSize = calcCartQuantity(findCart)
    await findCart.save()
    res.status(200).json({
        status: 'success',
        message: 'product added to cart successfully',
        cartQunetitySize: cartItemsSize,
        cartProductSize: findCart.products.length,
        data: findCart
    })
})

const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const cartItem = await cartModel.findOne({ user: req.user._id })
    if (!cartItem) {
        return next(new ApiError('Cart not found', 404))
    }

    const productIndex = cartItem.products.findIndex(product => product._id.toString() === req.params.cartItemId)
    if (productIndex === -1) {
        return next(new ApiError('Product not found in cart', 404))
    }

    const product = await productModel.findById(cartItem.products[productIndex].product)
    if (!product) {
        return next(new ApiError('Product not found', 404))
    }

    if (req.body.quantity > product.quantity) {
        return next(new ApiError('Quantity exceeds product quantity', 400))
    }
    cartItem.products[productIndex].quantity = req.body.quantity
    calcPrice(cartItem)
    await cartItem.save()
    res.status(200).json({
        status: 'success',
        message: 'Cart item quantity updated successfully',
        data: cartItem
    })
})

const applyCopounOnCart = asyncHandler(async (req, res, next) => {
    // 1- need to get user cart 
    const cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) {
        return next(new ApiError('Cart not found', 404))
    }
    // 2- need to get coupon depending on the name and expiration date 
    const coupon = await couponModel.findOne({
        name: req.body.coupon,
        expire: { $gte: Date.now() }
    })

    if (!coupon) {
        return next(new ApiError('Coupon not found or Expire', 404))
    }

    // const couponDateToMillis = coupon.expire.getTime()
    // 
    // if (Date.now() > couponDateToMillis) {
    //     return next(new ApiError('Coupon expired', 400))
    // }

    const calcDiscount = (cart.total * (coupon.discount / 100)).toFixed(2)

    cart.priceAfterDiscount = cart.total - calcDiscount

    await cart.save()
    res.status(200).json({
        status: 'success',
        message: 'Coupon applied successfully',
        couponDiscount: `${coupon.discount}%`,
        data: cart
    })
})

module.exports = {
    addProductToCart,
    getCartDataToUser,
    deleteCartController,
    deleteSpecificCartItemController,
    updateCartItemQuantity,
    applyCopounOnCart
}
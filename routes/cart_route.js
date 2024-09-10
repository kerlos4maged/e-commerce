const express = require('express');

const router = express.Router()

const {
    protected,
    allowedTo
} = require('../controllers/authentication_controller')

const {
    addProductToCart,
    getCartDataToUser,
    deleteCartController,
    deleteSpecificCartItemController,
    updateCartItemQuantity,
    applyCopounOnCart
} = require('../controllers/cart_controller')

router.use(protected, allowedTo('user'))

router.route(
    '/'
)
    .post(addProductToCart)
    .get(getCartDataToUser)
    .delete(deleteCartController)

router.put('/:applyCoupon', applyCopounOnCart)

router.route('/:cartItemId')
    .delete(deleteSpecificCartItemController)
    .put(updateCartItemQuantity)

module.exports = router
const { check } = require('express-validator')
const { checkMiddleware } = require('../../middlewares/validator/validatorMiddlware')

const productModel = require('../../models/product_models')

const addToWishListValidator = [
    check('product')
        .isMongoId()
        .withMessage('Invalid product id format')
        .custom((product) => productModel.findById(product).then((value) => {
            if (!value) {
                return Promise.reject(Error(`product not valid`));
            }
            return true
        }))
        .withMessage('product not found')
    ,
    checkMiddleware
]

const removeFromWishListValidator = [
    check('productId')
        .isMongoId()
        .withMessage('Invalid product id format')
    ,
    checkMiddleware
]


module.exports = {
    addToWishListValidator,
    removeFromWishListValidator
}
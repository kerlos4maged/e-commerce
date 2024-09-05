const { check } = require('express-validator')

const { checkMiddleware } = require('../../middlewares/validator/validatorMiddlware')

const ApiError = require('../../middlewares/globalError')

const userModel = require('../../models/user_models')

const reviewModel = require('../../models/reviews_models')

const productModel = require('../../models/product_models')

const checkId = [
    check('id').isMongoId().withMessage('Invalid product id format'),
    checkMiddleware
]

const createReviewValidator = [
    check('title').optional(),
    check('rating')
        .notEmpty()
        .withMessage("please enter a valid rating")
        .isFloat({ min: 0, max: 5 })
        .withMessage('Invalid rating'),
    check('user')
        .isMongoId()
        .withMessage('Invalid user id format')
        .custom((value) =>
            userModel.findById(value).then((user) => {
                if (!user) {
                    throw (new ApiError('User not found', 404))
                }
            })
        ).withMessage('user not found'),
    check('product')
        .isMongoId()
        .withMessage('Invalid product id format')
        .custom((productId) => productModel.findById(productId).then((product) => {
                if (!product) {
                    console.log(`product value returned from reviewRulesValidator: ${product}`)
                    return Promise.reject(new Error('Product not found', 404))
                }
                return true
            }))
        .withMessage('product not found')
        .custom((productValue, { req }) => {
            console.log(` user: ${req.body.user}, product : ${req.body.product}`)
            // 1- check if the product already have an comment for this user 
            return reviewModel
                .findOne({ user: req.body.user, product: req.body.product })
                .then((review) => {
                    if (review) {
                        return Promise.reject(new Error("this user is already commented on this product"))
                    }
                    return true
                })
        }
        ).withMessage("this user is already commented on this product"),
    checkMiddleware
]

const updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage("invalid review id")
        .custom(async (value, { req }) => {
            console.log(`this is value return from id: ${value}`);
            return reviewModel.findById(value).then((review) => {
                // console.log(`user review filed value is: ${review}`)
                if (!review) {
                    return (new Error('Review not found', 404))
                }
                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject(
                        new Error(`Your are not allowed to perform this action`)
                    );
                }
                return true
            })
        }
        ),
    checkMiddleware
]

const deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage("invalid review id")
        .custom((value, { req }) => {
            // console.log(`and this is userId value: ${req.user._id}\n And this is user role value: ${req.user.role}`)
            if (req.user.role === 'user') {
                return reviewModel.findById(value).then((review) => {
                    if (!review) {
                        return Promise.reject(
                            new Error(`There is no review with id ${value}`)
                        )
                    }
                    if (review.user._id.toString() !== req.user._id.toString()) {
                        return Promise.reject(
                            new Error(`Your are not allowed to perform this action`)
                        );
                    }
                    return true
                })
            }
            return true
        }
        ),
    checkMiddleware
]

/**
 * const deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom((val, { req }) => {
            // Check review ownership before update
            if (req.user.role === 'user') {
                return reviewModel.findById(val).then((review) => {
                    if (!review) {
                        return Promise.reject(
                            new Error(`There is no review with id ${val}`)
                        );
                    }
                    if (review.user._id.toString() !== req.user._id.toString()) {
                        return Promise.reject(
                            new Error(`Your are not allowed to perform this action`)
                        );
                    }
                });
            }
            return true;
        }),
    checkMiddleware,
]
 */

module.exports = {
    checkId,
    createReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
}
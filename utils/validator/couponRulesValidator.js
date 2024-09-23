const { check } = require('express-validator')

const couponModel = require('../../models/coupon_models')

const { checkMiddleware } = require('../../middlewares/validator/validatorMiddlware')

const createCouponeValidator = [
    check('name')
        .notEmpty()
        .withMessage('Coupon Name is required')
        .custom((value, { req }) =>
            couponModel.findOne({ name: value }).then((coupon) => {
                if (coupon) {
                    return Promise.reject(Error('Coupon Name already exists'))
                }
                return true
            }))
        .withMessage('Coupon Name is already exists'),

    check('expire')
        .notEmpty()
        .withMessage('Coupon Expire Date is required')
        .custom((value) => {
            const convertFromValueToDate = new Date(value)
            const dateAfterConvert = convertFromValueToDate.getTime()
            if (dateAfterConvert < Date.now()) {
                return Promise.reject(Error('Coupon Expire Date cannot be in the past'))
            }
            return true
        }
        )
        .withMessage('coupon expire date cannot be in the past'),

    check('discount')
        .notEmpty()
        .withMessage('Coupon Discount Amount is required'),

    checkMiddleware
]

const updateCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('in Valid Id '),

    check('name')
        .custom((value, { req }) =>
            couponModel.findOne({ name: value }).then((coupon) => {
                if (coupon) {
                    return Promise.reject(Error('Coupon Name already exists'))
                }
                return true
            }))
        .withMessage('coupon name already exists')
    ,

    check('expire')
        .custom((value) => {
            const convertFromValueToDate = new Date(value)
            const dateAfterConvert = convertFromValueToDate.getTime()
            if (dateAfterConvert < Date.now()) {
                return Promise.reject(Error('Coupon Expire Date cannot be in the past'))
            }
            return true
        }
        )
        .withMessage('coupon expire date cannot be in the past'),
    checkMiddleware,
]

const validatorId = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Id'),
    checkMiddleware
]

module.exports = {
    createCouponeValidator,
    updateCouponValidator,
    validatorId,

}
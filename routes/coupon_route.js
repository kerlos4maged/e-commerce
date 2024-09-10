const express = require('express');

const router = express.Router()

const {
    protected,
    allowedTo
} = require('../controllers/authentication_controller')

const {
    createCouponeValidator,
    updateCouponValidator,
    validatorId,
} = require('../utils/validator/couponRulesValidator')

const {
    getAllCouponsController,
    getCouponByIdController,
    createCouponeController,
    updateCouponController,
    deleteCouponController,
} = require('../controllers/coupone_controller')

router.use(
    protected,
    allowedTo('admin'),
)

router.route('/')
    .get(
        getAllCouponsController,
    ).post(
        createCouponeValidator,
        createCouponeController,
    )

router.route('/:id')
    .get(validatorId,getCouponByIdController)
    .put(
        updateCouponValidator,
        updateCouponController
    )
    .delete(
        validatorId,
        deleteCouponController
    )

module.exports = router
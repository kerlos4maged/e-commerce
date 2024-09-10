
const couponModel = require('../models/coupon_models')

const {
    createService,
    getAllDocumentsService,
    getSpecificDocumentService,
    updateService,
    deleteService
} = require('../utils/apiServices')

// get all coupons 
// @access private (manager)
const getAllCouponsController = getAllDocumentsService(couponModel, 'Coupon')

// get all coupons 
// @access private (manager)
const createCouponeController = createService(couponModel)

// get all coupons 
// @access private (manager)
const getCouponByIdController = getSpecificDocumentService(couponModel)

// get all coupons 
// @access private (manager)
const updateCouponController = updateService(couponModel)

// get all coupons 
// @access private (manager)
const deleteCouponController = deleteService(couponModel)

module.exports = {
    createCouponeController,
    getAllCouponsController,
    getCouponByIdController,
    updateCouponController,
    deleteCouponController,
}

// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express')

const brandController = require('../controllers/brand_controller')
const { protected, allowedTo } = require('../controllers/authentication_controller')

const {
    checkId,
    checkBrandName,
    updateBrand,
} = require('../utils/validator/brandRulesValidator')

const router = express.Router()

router.route('/')
    .get(brandController.getBrands)
    .post(
        protected,
        allowedTo('admin'),
        brandController.uploadBrandImage,
        brandController.resizeBrandImage,
        checkBrandName,
        brandController.createBrand
    )

router.route('/:id')
    .get(checkId, brandController.getBrandUsingId)
    .delete(
        protected,
        allowedTo('admin'),
        checkId,
        brandController.deleteBrand)
    .put(
        protected,
        allowedTo('admin'),
        brandController.uploadBrandImage,
        brandController.resizeBrandImage,
        updateBrand,
        brandController.updateBrand
    )

module.exports = router


// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express')

const brandController = require('../controllers/brand_controller')
const {
    checkId,
    checkBrandName,
    updateBrand,
} = require('../utils/validator/brandRulesValidator')

const router = express.Router()

router.route('/')
    .get(brandController.getBrands)
    .post(brandController.uploadBrandImage, brandController.resizeBrandImage, checkBrandName, brandController.createBrand)

router.route('/:id')
    .get(checkId, brandController.getBrandUsingId)
    .delete(checkId, brandController.deleteBrand)
    .put(brandController.uploadBrandImage, brandController.resizeBrandImage, updateBrand, brandController.updateBrand)

module.exports = router

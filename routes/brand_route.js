const express = require('express')
const brandController = require('../controllers/brand_controller')
const multer = require('multer')
const {
    checkId,
    checkBrandName,
    updateBrand,
} = require('../utils/validator/brandRulesValidator')
const {createBrand} = require("../controllers/brand_controller");

const router = express.Router()
const upload = multer()

router.route('/').get(brandController.getBrands).post(upload.none(),checkBrandName, brandController.createBrand)
router.route('/:id').get(checkId, brandController.getBrandUsingId).delete(checkId, brandController.deleteBrand).put(updateBrand, brandController.updateBrand)

module.exports = router

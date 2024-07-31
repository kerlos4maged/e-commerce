// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-require
const express = require('express');

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product_controller')

const {
    createProductValidator,
    checkIdValidator
} = require('../utils/validator/productRulesValidator')

const router = express.Router()

router.route('/').get(getAllProducts).post(createProductValidator, createProduct)
router.route('/:id').get(checkIdValidator, getProductById).delete(checkIdValidator, deleteProduct).put(checkIdValidator, updateProduct)

module.exports = router
// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-require
const express = require('express');

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeBrandImage,
} = require('../controllers/product_controller')

const {
    createProductValidator,
    checkIdValidator,
    updateProductValidator

} = require('../utils/validator/productRulesValidator')

const router = express.Router()

router.route('/').get(getAllProducts).post(
    uploadProductImages,
    resizeBrandImage,
    createProductValidator,
    createProduct)

router.route('/:id')
    .get(checkIdValidator, getProductById)
    .delete(checkIdValidator, deleteProduct)
    .put(
        uploadProductImages,
        resizeBrandImage,
        updateProductValidator,
        updateProduct)

module.exports = router
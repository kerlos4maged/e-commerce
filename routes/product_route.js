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

// - review route to make nested route -> get all reviews for the product 

const reviewRoutes = require("./reviews_route")

const {
    createProductValidator,
    checkIdValidator,
    updateProductValidator

} = require('../utils/validator/productRulesValidator')

const { protected, allowedTo } = require('../controllers/authentication_controller')

const router = express.Router()

router.route('/')
    .get(getAllProducts)
    .post(
        protected,
        allowedTo('admin'),
        uploadProductImages,
        resizeBrandImage,
        createProductValidator,
        createProduct
    )

router.route('/:id')
    .get(checkIdValidator, getProductById)
    .delete(
        protected,
        allowedTo('admin'),
        checkIdValidator,
        deleteProduct)
    .put(
        protected,
        allowedTo('admin'),
        uploadProductImages,
        resizeBrandImage,
        updateProductValidator,
        updateProduct)


// path -> localhost/products/productId/reviews 
router.use('/:productId/review/', reviewRoutes)

module.exports = router
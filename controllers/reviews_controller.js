const reviewModle = require('../models/reviews_models')

const {
    deleteService,
    updateService,
    getAllDocumentsService,
    createService,
    getSpecificDocumentService,
} = require('../utils/apiServices')

// get list of reviews 
// public 
const getReviews = getAllDocumentsService(reviewModle, "Review")

// get review by id
// public 
const getReviewById = getSpecificDocumentService(reviewModle)
// nested route
// to set review and product id 
// GET /api/v1/product/:product/review/reviewId
const setReviewAndProductIdToSearch = (req, res, next) => {

    let productIdValue = ''
    let reviewIdValue = ''

    if (req.params.productId) {

        productIdValue = req.params.productId
        reviewIdValue = req.params.id
        req.filterById = { product: productIdValue, _id: reviewIdValue }
    }


    next()
}

// create new review
// private/protected/needs to users
const createReview = createService(reviewModle)

// update review by id
// private/protected/needs to users
const updateReview = updateService(reviewModle)

// delete review by id
// private/protected/needs to users
const deleteReview = deleteService(reviewModle)

// set productId get from nested routes
// nested routes ->
// GET api/v1/products/:productId/review
// POST api/v1/products/:productId/review
const setProductId = (req, res, next) => {
    let productIdValue = {}

    if (req.params.productId) productIdValue = { product: req.params.productId }

    req.filterById = productIdValue

    next()
}

// set productId to review body to create a new review
// nested routes ->
// POST api/v1/products/:productId/review

const createReviewNestedRoute = (req, res, next) => {
    if (!req.body.product && (req.user || !req.body.user)) {
        req.body.product = req.params.productId
        req.body.user = req.user._id
    }
    next()
}

module.exports = {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,  // private -> delete review using id
    setProductId,
    createReviewNestedRoute,
    setReviewAndProductIdToSearch
}
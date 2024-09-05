const express = require('express');

const router = express.Router({ mergeParams: true });

const { allowedTo, protected } = require('../controllers/authentication_controller');

const {
    createReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
} = require('../utils/validator/reviewsRulesValidator')

const {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    setProductId,
    createReviewNestedRoute,
    setReviewAndProductIdToSearch
} = require('../controllers/reviews_controller')

router.route('/')
    .get(
        setProductId,
        getReviews
    )
    .post(
        protected,
        allowedTo('user'),
        createReviewNestedRoute,
        createReviewValidator,
        createReview
    )

router.route('/:id')
    .get(
        setReviewAndProductIdToSearch,
        getReviewById
    )
    .put(
        protected,
        allowedTo('user'),
        updateReviewValidator,
        updateReview
    )
    .delete(
        protected,
        allowedTo('user', 'admin'),
        deleteReviewValidator,
        deleteReview
    )

module.exports = router
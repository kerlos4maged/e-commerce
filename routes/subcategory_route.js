// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const express = require('express');
const {
    createSubCategoryController,
    getSubCategoriesController,
    setIdForGetSubCategory,
    getSubCategoriesByIdController,
    deleteSubCategoryController,
    updateSubCategoryController,
    checkCategoryId,
    setReviewAndProductIdToSearch
} = require('../controllers/subcategory_controller')

// mergerParams this is used if any another route send params data

// ex: We need to access CategoryId from Category route -> Nested Route
const router = express.Router({ mergeParams: true })

const {
    createSubCategoryValidator,
    getSubCategoryByIdValidator,
    updateSubCategoryValidator,
    deleteSubCategoriesValidator,
} = require('../utils/validator/subCategoryRulesValidator');

const { protected, allowedTo } = require('../controllers/authentication_controller')

router.route('/')
    .post(
        protected,
        allowedTo('admin'),
        checkCategoryId,
        createSubCategoryValidator,
        createSubCategoryController
    )
    .get(setIdForGetSubCategory, getSubCategoriesController)

router.route('/:id')
    .get(
        getSubCategoryByIdValidator,
        setReviewAndProductIdToSearch,
        getSubCategoriesByIdController)
    .delete(
        protected,
        allowedTo('admin'),
        deleteSubCategoriesValidator,
        deleteSubCategoryController)
    .put(
        protected,
        allowedTo('admin'),
        updateSubCategoryValidator,
        updateSubCategoryController
    )

module.exports = router;
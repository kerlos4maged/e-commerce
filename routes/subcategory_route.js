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
} = require('../controllers/subcategory_controller')

// mergerParams this is used if any another route send params data

// ex: We need to access CategoryId from Category route -> Nested Route
const router = express.Router({mergeParams:true})

const {
    createSubCategoryValidator,
    getSubCategoryByIdValidator,
    updateSubCategoryValidator,
    deleteSubCategoriesValidator,
} = require('../utils/validator/subCategoryRulesValidator');


router.route('/')
    .post(checkCategoryId, createSubCategoryValidator, createSubCategoryController)
    .get(setIdForGetSubCategory,getSubCategoriesController)

router.route('/:id')
    .get(getSubCategoryByIdValidator, getSubCategoriesByIdController)
    .delete(deleteSubCategoriesValidator, deleteSubCategoryController)
    .put(updateSubCategoryValidator, updateSubCategoryController)

module.exports = router;
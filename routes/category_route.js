// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-require
const express = require('express');

const categoryController = require("../controllers/category_controller")

const router = express.Router()

const {
    checkCategoryIdValidator,
    createCategoryValidator,
    updateCategoryValidator,
} = require('../utils/validator/categoryRulesValidator');

const { protected, allowedTo } = require('../controllers/authentication_controller');

const subCategoryRoutes = require("./subcategory_route");

router
    .route('/')
    .get(categoryController.getCategories)
    .post(
        protected,
        allowedTo('admin'),
        categoryController.uploadCategoryImage,
        categoryController.resizeImage,
        createCategoryValidator,
        categoryController.createCategories,)

router
    .route('/:id')
    .get(checkCategoryIdValidator,
        categoryController.getCategoriesById
    )
    .put(
        protected,
        allowedTo('admin'),
        updateCategoryValidator,
        categoryController.uploadCategoryImage,
        categoryController.resizeImage,
        categoryController.updateCategories
    )
    .delete(
        protected,
        allowedTo('admin'),
        checkCategoryIdValidator,
        categoryController.deleteCategories)

// this is for get subCategory for specific category -> nested route

router.use("/:categoryId/subcategories", subCategoryRoutes)

module.exports = router

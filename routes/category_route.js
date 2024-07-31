// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-require
const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');

const categoryController = require("../controllers/category_controller")

const upload = multer({dest: 'images/category'});

const router = express.Router()
const {
    checkCategoryIdValidator,
    createCategoryValidator,
    getAllCategoryValidator,
    updateCategoryValidator,
} = require('../utils/validator/categoryRulesValidator');
const subCategoryRoutes = require("./subcategory_route");


router
    .route('/')
    .get(getAllCategoryValidator, categoryController.getCategories)
    .post(upload.single('image'),
        (req, res, next) => {
            console.log(req.files);
            console.log(req.body)
            next()
        }, createCategoryValidator, categoryController.createCategories)

router
    .route('/:id')
    .get(checkCategoryIdValidator,
        categoryController.getCategoriesById)
    .put(updateCategoryValidator, categoryController.updateCategories)
    .delete(checkCategoryIdValidator,
        categoryController.deleteCategories)

// this is for get subCategory for specific category -> nested route

router.use("/:categoryId/subcategories", subCategoryRoutes)

module.exports = router

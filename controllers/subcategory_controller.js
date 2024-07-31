const subCategoryModel = require('../models/subCategoryModel');
const apiService = require('../utils/apiServices');

// Route for get all subCategories for specified category -> Get /api/v1/categroies/:categoryId/subCategories


// create sub category controller
// route api/v1/subcategory
// access private 

const checkCategoryId = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next()
}

const createSubCategoryController = apiService.createService(subCategoryModel)

// public -> GET all data from database

// this is nested route
// GET: /api/v1/category/:categoryId/subCategory
// the subCategory Belong to this category from CategoryId
const setIdForGetSubCategory = (req, res, next) => {
    let subCategoryId = {}

    if (req.params.categoryId) subCategoryId = {category: req.params.categoryId}

    req.filterCategoryId = subCategoryId
    next()
}

const getSubCategoriesController = apiService.getAllDocumentsService(subCategoryModel,"subCategoryModel")
// public -> GET data have id you enterd it 
const getSubCategoriesByIdController = apiService.getSpecificDocumentService(subCategoryModel)
// private -> Update subcategory using id and title
const updateSubCategoryController = apiService.updateService(subCategoryModel)
// private -> Update subcategory using id and title 
const deleteSubCategoryController = apiService.deleteService(subCategoryModel)

module.exports = {
    createSubCategoryController,
    getSubCategoriesController,
    getSubCategoriesByIdController,
    updateSubCategoryController,
    deleteSubCategoryController,
    setIdForGetSubCategory,
    checkCategoryId
}
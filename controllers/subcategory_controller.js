const subCategoryModel = require('../models/subCategoryModel');
const apiService = require('../utils/apiServices');

// Route for get all subCategories for specified category -> Get /api/v1/categroies/:categoryId/subCategories

// this is nested route to create subCategory
// checkCategoryId to set on nested route
// route -> api/v1/category/categroyId/subCategories

const checkCategoryId = (req, res, next) => {
    // in subcategory creation you need to set category on request body 
    // so will check if the body don't have this category id this is mean you send a categoryId in request params
    // so will set the category body from id send in params
    if (!req.body.category) req.body.category = req.params.categoryId;
    next()
}

// create sub category controller
// route api/v1/subcategory
// access private 
const createSubCategoryController = apiService.createService(subCategoryModel)

// public -> GET all data from database

// this is nested route
// GET: /api/v1/category/:categoryId/subCategory
// the subCategory Belong to this category from CategoryId
const setIdForGetSubCategory = (req, res, next) => {
    let subCategoryId = {}

    if (req.params.categoryId) subCategoryId = { category: req.params.categoryId }

    req.filterById = subCategoryId

    next()
}

// this is nested route to set filterById field in request
// GET: /api/v1/category/:categoryId
const setReviewAndProductIdToSearch = (req, res, next) => {



    let categoryIdValue = ''
    let subcategoryIdValue = ''

    if (req.params.categoryId) {

        categoryIdValue = req.params.categoryId
        subcategoryIdValue = req.params.id
        req.filterById = { category: categoryIdValue, _id: subcategoryIdValue }
    }


    next()
}

const getSubCategoriesController = apiService.getAllDocumentsService(subCategoryModel, "subCategoryModel")

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
    checkCategoryId,
    setReviewAndProductIdToSearch
}
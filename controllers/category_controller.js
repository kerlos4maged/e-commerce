

const categoryModel = require('../models/category_models');
const apiService = require('../utils/apiServices')

// public -> GET all data from database 
const getCategories = apiService.getAllDocumentsService(categoryModel, "categoryModel")
// public -> GET data have id you entered it
const getCategoriesById = apiService.getSpecificDocumentService(categoryModel)
// admin users only 
const createCategories = apiService.createService(categoryModel)

const updateCategories = apiService.updateService(categoryModel)

const deleteCategories = apiService.deleteService(categoryModel)

module.exports = {
    getCategories,
    createCategories,
    getCategoriesById,
    updateCategories,
    deleteCategories
}
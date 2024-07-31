const brandModel = require('../models/brand_models');
const apiService = require("../utils/apiServices");

const createBrand = apiService.createService(brandModel)

const getBrandUsingId = apiService.getSpecificDocumentService(brandModel)

const getBrands = apiService.getAllDocumentsService(brandModel, "brandModel")

const updateBrand = apiService.updateService(brandModel)

const deleteBrand = apiService.deleteService(brandModel)

module.exports = {
    createBrand,
    getBrandUsingId,
    getBrands,
    updateBrand,
    deleteBrand
}
const slugify = require("slugify")
const asyncHandler = require("express-async-handler")
const productModel = require("../models/product_models")
const apiError = require("../utils/api_error")
const apiFeatures = require('../utils/apiFeatures')
const apiServices = require('../utils/apiServices')

const getAllProducts = apiServices.getAllDocumentsService(productModel,"Product")

const getProductById = apiServices.getSpecificDocumentService(productModel)

const createProduct = apiServices.createService(productModel)

const updateProduct = apiServices.updateService(productModel)

const deleteProduct = apiServices.deleteService(productModel)

// const deleteProduct = asyncHandler(async (req, res, next) => {
//     const {id} = req.params
//     const product = await productModel.findByIdAndDelete({_id: id}).populate({
//         path: "category model", select: "-_id name"
//
//     })
//     if (!product) {
//         return next(new apiError(`no product belong to this ${id} `, 404))
//     }
//     res.status(200).json({
//         "Status": "Success", "Product Deleted": product
//     })
// });

module.exports = {
    getAllProducts, getProductById, createProduct, updateProduct, deleteProduct,
}
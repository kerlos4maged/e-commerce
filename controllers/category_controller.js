
const { uuid } = require('uuidv4')
const sharp = require('sharp')
const expressAsyncHandler = require('express-async-handler');
const categoryModel = require('../models/category_models');
const apiService = require('../utils/apiServices');

const { uploadSingleImage } = require('../middlewares/uploadImage')

// public -> GET all data from database 
const getCategories = apiService.getAllDocumentsService(categoryModel, "categoryModel")
// public -> GET data have id you entered it
const getCategoriesById = apiService.getSpecificDocumentService(categoryModel)
// admin users only 
const createCategories = apiService.createService(categoryModel)

const updateCategories = apiService.updateService(categoryModel)

const deleteCategories = apiService.deleteService(categoryModel)

const uploadCategoryImage = uploadSingleImage("image")

const resizeImage = expressAsyncHandler(
    async (req, res, next) => {
        console.log(req.file)
        console.log(req.body)

        const fileName = `category-${uuid()}-${Date.now()}.jpeg`

        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`upload/category/${fileName}`)

        // save image to database using this line 

        req.body.image = fileName  // replace req.body.image with fileName if you want to save image name in database

        next()
    })

module.exports = {
    getCategories,
    createCategories,
    getCategoriesById,
    updateCategories,
    deleteCategories,
    uploadCategoryImage,
    resizeImage,
}
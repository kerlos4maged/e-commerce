const expressAsyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { uuid } = require('uuidv4');
const brandModel = require('../models/brand_models');
const apiService = require("../utils/apiServices");
const { uploadSingleImage } = require('../middlewares/uploadImage');

const createBrand = apiService.createService(brandModel)

const getBrandUsingId = apiService.getSpecificDocumentService(brandModel)

const getBrands = apiService.getAllDocumentsService(brandModel, "brandModel")

const updateBrand = apiService.updateService(brandModel)

const deleteBrand = apiService.deleteService(brandModel)

const uploadBrandImage = uploadSingleImage("image")

const resizeBrandImage = expressAsyncHandler(async (req, res, next) => {

    const fileName = `brand-${req.body.name}-${uuid()}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`upload/brand/${fileName}`)

    // save image to database using this line 

    req.body.image = fileName  // replace req.body.image with fileName if you want to save image name in database

    next()
})

module.exports = {
    createBrand,
    getBrandUsingId,
    getBrands,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeBrandImage,
}
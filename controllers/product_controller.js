const { uuid } = require('uuidv4');

const sharp = require('sharp');

const expressAsyncHandler = require('express-async-handler');

const fs = require('fs')

const { uploadMixImage } = require('../middlewares/uploadImage');

const productModel = require("../models/product_models")

const apiServices = require('../utils/apiServices');


const uploadProductImages = uploadMixImage([
    {
        name: 'imageCover',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 5
    },
])

const resizeBrandImage = expressAsyncHandler(async (req, res, next) => {
    try {
        const id = req.body.category
        const folderName = `upload/prodact/${id}`;
        // Check if the directory exists
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true });
            // 
        } else {
            // const parts = folderName.split(' ');
            // const lastPart = parseInt(parts[1].match(/\d+/)[0], 10) + 1;
            
            // folderName = `upload/prodact/${req.body.title}-${lastPart}`
            // fs.mkdirSync(folderName, { recursive: true });  // Recreate the directory if it already exists to avoid overwriting images
            // 
        }

        // 

        // Processing the cover image
        if (req.files.imageCover) {
            const fileName = `prodact-${uuid()}-${Date.now()}.jpeg`;
            await sharp(req.files.imageCover[0].buffer)
                .resize(2000, 1333)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`${folderName}/${fileName}`);

            req.body.imageCover = fileName;  // Save image name in database
        }

        // Processing additional images
        if (req.files.images) {
            req.body.images = [];
            await Promise.all(req.files.images.map(async (element, index) => {
                const fileName = `prodact-${uuid()}-${Date.now()}-${index + 1}.jpeg`;

                await sharp(element.buffer)
                    .resize(1500, 1000)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`${folderName}/${fileName}`);

                req.body.images.push(fileName);  // Save image name in database
            }));
        }

    } catch (error) {
        // 
    }

    next()
})

const getAllProducts = apiServices.getAllDocumentsService(productModel, "Product")

const getProductById = apiServices.getSpecificDocumentService(
    productModel,
    "review"
)

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
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeBrandImage
}
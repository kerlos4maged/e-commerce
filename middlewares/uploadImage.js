const multer = require('multer')
const ApiError = require('../utils/api_error');

const multerCreateion = () => {
    const imageFilteration = function (req, file, cb) {

        // console.log(`this is message from file name function on imageFilteration: ${JSON.stringify(file)}`)
        const fileExt = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif', 'apng']

        if (fileExt.includes(file.mimetype.split('/')[1])) {
            cb(null, true)
        }
        else {
            cb(new ApiError("please Enter a valid image", 400), false)
        }
    }
    // 2- memory Storage ->
    const memoryValue = multer.memoryStorage()

    const uploadCategoryImage = multer({ storage: memoryValue, fileFilter: imageFilteration })

    return uploadCategoryImage
}

const uploadSingleImage = (filedName) => multerCreateion().single(filedName)


const uploadMixImage = (imagesList) => multerCreateion().fields(imagesList)

module.exports = {
    uploadSingleImage,
    uploadMixImage
}



// 1- diskStorage image -> const storageValue = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'upload/category');  // upload destination path
//     },
//     filename: function (req, file, cb) {
//         console.log(`this is message from file name function on storageValue: ${file.mimetype}`)
//         cb(null, `${uuid()}-${Date.now()}.${file.mimetype.split('/')[1]}`);
//     }
// });

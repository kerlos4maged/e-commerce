const asyncHandler = require('express-async-handler')

const landingPageWelcomeController = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        Status: 'Success',
        message: 'Welcome to our e-commerce platform',
        routes: {
            'category': {
                'get all categories': 'GET api/v1/category',
                'delete category': 'Delete api/v1/category/:categoryId',
                'get specific category': 'GET api/v1/category/:categoryId',
                'create new category': 'POST api/v1/category',
                'update specific category': 'PUT api/v1/category/:categoryId'
            },
            'brand': {
                'get all brands': 'GET api/v1/brand',
                'delete brand': 'Delete api/v1/brand/:brandId',
                'get specific category': 'GET api/v1/brand/:brandId',
                'create new brand': 'POST api/v1/brand',
                'update specific brand': 'PUT api/v1/brand/:brandId'
            },
            'subCategories': {
                'get all subCategories': 'GET api/v1/subCategory',
                'delete subCategory': 'Delete api/v1/subCategory/:subCategoryId',
                'get specific category': 'GET api/v1/subCategory/:subCategoryId',
                'create new subCategory': 'POST api/v1/subCategory',
                'update specific subCategory': 'PUT api/v1/subCategory/:subCategoryId'
            },
        }
    })
})

module.exports = { landingPageWelcomeController }
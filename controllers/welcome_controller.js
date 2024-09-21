const asyncHandler = require('express-async-handler')

const landingPageWelcomeController = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        Status: 'Success',
        message: 'Welcome to our e-commerce platform',
        routes: {
            'Note': "All routes are protected to check if any user uses any route; some of these routes are available for admin users.",
            'category': {
                'get all categories': 'GET api/v1/category',
                'delete category': 'DELETE api/v1/category/:categoryId',
                'get specific category': 'GET api/v1/category/:categoryId',
                'create new category': 'POST api/v1/category',
                'update specific category': 'PUT api/v1/category/:categoryId'
            },
            'brand': {
                'get all brands': 'GET api/v1/brand',
                'delete brand': 'DELETE api/v1/brand/:brandId',
                'get specific brand': 'GET api/v1/brand/:brandId',
                'create new brand': 'POST api/v1/brand',
                'update specific brand': 'PUT api/v1/brand/:brandId'
            },
            'subCategories': {
                'get all subcategories': 'GET api/v1/subCategory',
                'delete subcategory': 'DELETE api/v1/subCategory/:subCategoryId',
                'get specific subcategory': 'GET api/v1/subCategory/:subCategoryId',
                'create new subcategory': 'POST api/v1/subCategory',
                'update specific subcategory': 'PUT api/v1/subCategory/:subCategoryId'
            },
            'category/subCategories': {
                'get all category/subcategories': 'GET api/v1/category/:categoryId/subCategories',
                'create new category/subcategories': 'POST api/v1/category/:categoryId/subCategories'
            },
            'products': {
                'get all products': 'GET api/v1/product',
                'delete product': 'DELETE api/v1/product/:productId',
                'get specific product': 'GET api/v1/product/:productId',
                'create new product': 'POST api/v1/product',
                'update specific product': 'PUT api/v1/product/:productId'
            },
            'users': {
                'get all users': 'GET api/v1/user',
                'delete user': 'DELETE api/v1/user/:userId',
                'get specific user': 'GET api/v1/user/:userId',
                'create new user': 'POST api/v1/user',
                'update specific user': 'PUT api/v1/user/:userId'
            },
            'authentication': {
                'login': 'POST api/v1/auth/login',
                'logout': 'POST api/v1/auth/logout',
                'register': 'POST api/v1/auth/register',
                'forgotPassword': 'POST api/v1/auth/forgotPassword',
                'resetPassword': 'POST api/v1/auth/resetPassword'
            },
            'reviews': {
                'get all reviews': 'GET api/v1/review',
                'delete review': 'DELETE api/v1/review/:reviewId',
                'get specific review': 'GET api/v1/review/:reviewId',
                'create new review': 'POST api/v1/product/:productId/review',
                'update specific review': 'PUT api/v1/review/:reviewId'
            },
            'product/review': {
                'get all product reviews': 'GET api/v1/product/:productId/review',
                'create new product review': 'POST api/v1/product/:productId/review',
                'get specific product review': 'GET api/v1/product/:productId/review/:reviewId'
            },
            'watchlist': {
                'add product to watchlist': 'POST api/v1/watchlist/:productId',
                'delete product from watchlist': 'DELETE api/v1/watchlist/:productId',
                'get watchlist': 'GET api/v1/watchlist'
            },
            'addresses': {
                'add addresses for user': 'POST api/v1/addresses',
                'delete addresses from user': 'DELETE api/v1/addresses',
                'get addresses': 'GET api/v1/addresses'
            },
            'coupons': {
                'get all coupons': 'GET api/v1/coupon',
                'create coupon': 'POST api/v1/coupon',
                'delete coupon': 'DELETE api/v1/coupon/:couponCode',
                'get specific coupon': 'GET api/v1/coupon/:couponId',
                'update specific coupon': 'PUT api/v1/coupon/:couponId'
            },
            'cart': {
                'add product to cart': 'POST api/v1/cart/:productId',
                'delete product from cart': 'DELETE api/v1/cart/:productId',
                'delete all items from cart': 'DELETE api/v1/cart',
                'get cart': 'GET api/v1/cart',
                'update cart': 'PUT api/v1/cart'
            },
            'orders': {
                'create new order': 'POST api/v1/order/cash/cartId',
                'update specific order': 'PUT api/v1/order/:orderId',
                'get all orders': 'GET api/v1/order',
                'get orders for specific user': 'GET api/v1/order/',
                'create session for payment online': 'GET api/v1/order/checkout-sessions/:id'
            }
        }

    })
})

module.exports = { landingPageWelcomeController }
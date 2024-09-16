// import routs 
const categoryRoutes = require('./category_route');
const subCategoryRoutes = require('./subcategory_route');
const brandRoutes = require('./brand_route');
const productRoutes = require('./product_route');
const userRoutes = require('./user_route');
const authRoutes = require('./authentication_route')
const reviewRoutes = require('./reviews_route')
const wichlistRoutes = require('./wishlist_route')
const addAddress = require('./address_route')
const couponRoutes = require('./coupon_route')
const cartRoutes = require('./cart_route')
const orderRoutes = require('./order_route')

const mountRoutes = (app) => {
    app.use('/api/v1/category', categoryRoutes)
    app.use('/api/v1/subCategory', subCategoryRoutes)
    app.use('/api/v1/brand', brandRoutes)
    app.use('/api/v1/product', productRoutes)
    app.use('/api/v1/user', userRoutes)
    app.use('/api/v1/auth', authRoutes)
    app.use('/api/v1/review', reviewRoutes)
    app.use('/api/v1/wichlist', wichlistRoutes)
    app.use('/api/v1/addAddress', addAddress)
    app.use('/api/v1/coupon', couponRoutes)
    app.use('/api/v1/cart', cartRoutes)
    app.use('/api/v1/order', orderRoutes)
}

module.exports = {
    mountRoutes
}
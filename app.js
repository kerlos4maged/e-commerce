const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: "config/config.env" })
const app = express()

// require files in your application 
const path = require('path')
const mongoConnection = require('./config/database_config');
const ApiError = require('./utils/api_error');
const globalError = require('./middlewares/globalError');

// import routs 
const categoryRoutes = require('./routes/category_route');
const subCategoryRoutes = require('./routes/subcategory_route');
const brandRoutes = require('./routes/brand_route');
const productRoutes = require('./routes/product_route');

// database connection
// eslint-disable-next-line no-unused-expressions
mongoConnection()

// middleware 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'upload')))

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
    console.log("we used morgan dev and on development")
}
// Mote routes

app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/subCategory', subCategoryRoutes)
app.use('/api/v1/brand', brandRoutes)
app.use('/api/v1/product', productRoutes)


app.all("*", (req, res, next) => {

    // this is not cool way we used 

    // const err = new Error(`can't find your url: ${req.url}`)
    // next(err.message)

    // this is good 

    next(new ApiError(`can't find this url ${req.url}`, 400))
})

// Global Error Handling middleware -> this is for handling any errors in express 
app.use(globalError)

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`app listen on ${port} and run in ${process.env.NODE_ENV} environment`)
})

// you have an Events in Express to make handling for errors -> will return list -> will return callback function
// inside on function have alot of events 
// - unhandled for outside error express
process.on("rejectionHandled", (error) => {
    console.log(`RejectionHandled: ${error}`)
    process.exit(1)
})

process.on("unhandledRejection", (error) => {
    console.log(`UnhandledRejection Error: ${error.name} | ${error.message}}`)
    // this is mean will end all connection or any requests happend on server and after this will close the server
    server.close(() => {
        process.exit(1)
    })
})
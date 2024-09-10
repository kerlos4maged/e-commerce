const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: "config/config.env" })
const app = express()

// require files in your application -> Middleware 
const path = require('path')
const mongoConnection = require('./config/database_config');
const ApiError = require('./utils/api_error');
const globalError = require('./middlewares/globalError');

// import routs

const { mountRoutes } = require('./routes/mount_all_routes')

// database connection
mongoConnection()

// middleware 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'upload')))

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
    console.log("we used morgan dev and on development")
}

// Mounte routes
mountRoutes(app)

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
    console.log(`UnhandledRejection Error: ${error.name} | ${error.message}`)
    // this is mean will end all connection or any requests happend on server and after this will close the server
    server.close(() => {
        process.exit(1)
    })
})
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit')
const path = require('path')
const bodyParser = require('body-parser');
const hpp = require('hpp');
const mongoSanitizer = require('express-mongo-sanitize');
const helmet = require('helmet')
const session = require('express-session');

const { createOrderOnline } = require('./controllers/order_controller');

dotenv.config({ path: "config/config.env" })
const app = express()


// require files in your application -> Middleware 
const mongoConnection = require('./config/database_config');
const ApiError = require('./utils/api_error');
const globalError = require('./middlewares/globalError');

// import routs

const { mountRoutes } = require('./routes/mount_all_routes')

// Enable other domains to access your application
app.use(cors())
app.options('*', cors())

// compressed all responses 
app.use(compression())

// routes for webhooks 

app.use(bodyParser.raw({ type: 'application/json' }));

app.post(
    '/webhook-checkout',
    createOrderOnline
)

// this is for checking (brute force attacks) created on this app using -> rate limit
// focues the different between this error and any another error style will be because (if app check the user is used brute force attacks won't sending any request to the server)

// const message = 

const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: "Too many requests"
})

app.use(limit)

// used sessions package for secure sessions and secure from scrf attacks.

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 7 }
}))

// database connection
mongoConnection()

// middleware 
// this is for checking (raw body Attack) send with the content using -> raw body, limit in express.json({limit})
app.use(express.json({ limit: '20KB' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'upload')))

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))

}

// HTTP Parameter Pollution attacks

app.use(hpp({ whitelist: ['price', 'sold', 'quantity',] }))

// mongo sanitize, to validate if the request have any sql injection code or anything illegal

app.use(mongoSanitizer())

// Helmet helps you secure your Express apps by setting various HTTP headers

app.use(helmet())

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

const port = process.env.port || 3000

const server = app.listen(port, () => {

})

// you have an Events in Express to make handling for errors -> will return list -> will return callback function
// inside on function have alot of events 
// - unhandled for outside error express
process.on("rejectionHandled", (error) => {

    process.exit(1)
})

process.on("unhandledRejection", (error) => {

    // this is mean will end all connection or any requests happend on server and after this will close the server
    server.close(() => {
        process.exit(1)
    })
})


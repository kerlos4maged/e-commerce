const ApiError = require("../utils/api_error")

const productionMode = (err, res) => res.status(err.statusCodeValue).json({
    Status: err.status,
    Message: err.message,
})

const developmentMode = (err, res) => res.status(err.statusCodeValue).json({
    Status: err.status,
    Message: err.message,
    Error: err,
    stack: err.stack
})

const handlesJsonWebTokenError = () => new ApiError("Invalid Token, please try again", 401)

const handlesJsonWebTokenExperDate = () => new ApiError("token expired, please Enter valid token", 401)

// this is global middleware error handler
const globalError = (err, req, res, next) => {


    err.statusCodeValue = err.statusCodeValue || 500
    // const status = err.status || "Error"
    // err.status = status

    if (process.env.NODE_ENV === "development") {
        if (err.name === "JsonWebTokenError") err = handlesJsonWebTokenError()
        if (err.name === "TokenExpiredError") err = handlesJsonWebTokenExperDate()

        developmentMode(err, res)
    }
    else {
        if (err.name === "JsonWebTokenError") err = handlesJsonWebTokenError()
        if (err.name === "TokenExpiredError") err = handlesJsonWebTokenExperDate()

        productionMode(err, res)
    }
}

module.exports = globalError
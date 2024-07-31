// this is global middleware error handler
const globalError = (err, req, res, next) => {
    console.log(`this is message value return from global error file -> ${err.message}`)
    console.log(`this is status code value return from global error file -> ${err.statusCodeValue} && this is status value ${err.status}`)
    err.statusCodeValue = err.statusCodeValue || 500
    // const status = err.status || "Error"
    // err.status = status

    if (process.env.NODE_ENV === "development") {
        console.log('we worked in development mode and this is error return from error in dev mode')

        return res.status(err.statusCodeValue).json({
            Status: err.status,
            Message: err.message,
            Error: err,
            stack: err.stack
        })
    } 
        console.log('we worked in production mode and this is error return from error in produnction mode')
        return res.status(err.statusCodeValue).json({
            Status: err.status,
            Message: err.message,
        })
    


}

module.exports = globalError
class ApiError extends Error {
    constructor(message, statusCode) {
        // console.log(`this is message from api_error statusCode in this file is ${statusCode}`)
        super(message)
        this.statusCodeValue = statusCode
        this.status = `${statusCode}`.startsWith(4) ? "Fail" : "Error"
        // this is specific proberities will call if you pridect this error or you send it
        this.isOperational = true
        console.log(`this is message:${message}\nthis is statusCodeValue: ${statusCode}`)
    }
}

module.exports = ApiError
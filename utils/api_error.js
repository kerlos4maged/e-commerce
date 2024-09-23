class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCodeValue = statusCode
        this.status = `${statusCode}`.startsWith(4) ? "Fail" : "Error"
        // this is specific proberities will call if you pridect this error or you send it
        this.isOperational = true
    }
}

module.exports = ApiError
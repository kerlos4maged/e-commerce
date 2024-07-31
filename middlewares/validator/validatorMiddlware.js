const { validationResult } = require('express-validator')

const checkMiddleware= (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).json({"Status":"Error", message: result.array() })
    }
    next()
}

module.exports = {checkMiddleware}
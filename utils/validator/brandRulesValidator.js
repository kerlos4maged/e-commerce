const { check } = require("express-validator")
const slugify = require("slugify");
const { checkMiddleware } = require("../../middlewares/validator/validatorMiddlware")

const checkId = [
    check("id").isMongoId().withMessage('invalid brand id format'),
    checkMiddleware
]

const checkBrandName = [
    check("name")
        .notEmpty()
        .withMessage("Brand Name Required")
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
        .isLength({ min: 3 }).withMessage("Brand Length is too short")
        .isLength({ max: 32 }).withMessage("Brand Length is too high"),

    checkMiddleware
]


const updateBrand = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Brand Id Format"),
    check("name")
        .optional()
        .isString()
        .isLength({ min: 0 }).withMessage("Name Length is too short")
        .isLength({ max: 32 }).withMessage("Name Lenght is too small").custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
]

module.exports = {
    checkId,
    checkBrandName,
    updateBrand,
}
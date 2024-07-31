const {check} = require("express-validator")
const slugify = require("slugify");
const {checkMiddleware} = require("../../middlewares/validator/validatorMiddlware")

// this is my way to create it rule and on route will import -> rule , middleware 
// const checkId = check("id").isMongoId().withMessage("Invalid category id")

// module.exports = { checkId }

// this is course way to will create here rule and middleware and on route -> import getCategoryValidator
module.exports.checkCategoryIdValidator = [
    check("id").isMongoId().withMessage("Invalid Category Id Format"),
    checkMiddleware
]

// in models schema will import (unique value) but in this case we can't make it because will going to database 
module.exports.createCategoryValidator = [
    check("name").notEmpty().withMessage("Category Name Required").custom((value, {req}) => {
        req.body.slug = slugify(value)
        return true
    })
        .isLength({min: 3}).withMessage("Category Length is too short")
        .isLength({max: 32}).withMessage("Category Length is too high"),

    checkMiddleware
]

module.exports.getAllCategoryValidator = [
    check("limit").notEmpty().withMessage("please Enter limit for data"),
    check("pageNumber").notEmpty().withMessage("please Enter the current page number"),
    checkMiddleware
]

module.exports.updateCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Category Id Format"),
    check("name").isString().custom((value, {req}) => {
        req.body.slug = slugify(value)
        return true
    })
        .isLength({min: 0}).withMessage("Name Length is too short")
        .isLength({max: 32}).withMessage("Name Lenght is too small")
]
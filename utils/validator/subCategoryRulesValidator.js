const {check} = require("express-validator")
const slugify = require("slugify");
const {checkMiddleware} = require("../../middlewares/validator/validatorMiddlware")

// this is my way to create it rule and on route will import -> rule , middleware 
// const checkId = check("id").isMongoId().withMessage("Invalid Subcategory id")

// module.exports = { checkId }

// this is course way to will create here rule and middleware and on route -> import getSubCategoryValidator
// module.exports.checkSubCategoryIdValidator = [
//     check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
//     checkMiddleware
// ]

// in models schema will import (unique value) but in this case we can't make it because will going to database 
module.exports.createSubCategoryValidator = [
    check("name").notEmpty()
        .withMessage("SubCategory Name Required")
        .isLength({min: 2})
        .withMessage("SubCategory Length is too short")
        .isLength({max: 80})
        .withMessage("SubCategory Length is too high").custom((value, {req}) => {
        req.body.slug = slugify(value);
        return true
    }),
    check("category")
        .notEmpty()
        .withMessage("category must not be empty"),

    checkMiddleware
]

module.exports.getSubCategoryByIdValidator = [
    check("id").isMongoId().withMessage("please Enter valid id"),
    checkMiddleware
]

module.exports.getAllSubCategoryValidator = [
    check("limit").notEmpty().withMessage("please Enter limit for data"),
    check("pageNumber").notEmpty().withMessage("please Enter the current page number"),
    checkMiddleware
]

module.exports.updateSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
    check("name").optional().isString().custom((value, {req}) => {
        req.body.slug = slugify(value)
        return true
    })
        .isLength({min: 0}).withMessage("Name Length is too short")
        .isLength({max: 32}).withMessage("Name Lenght is too small"),
    checkMiddleware
]

module.exports.deleteSubCategoriesValidator = [
    check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
    checkMiddleware
]
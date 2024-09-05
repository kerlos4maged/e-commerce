const { check } = require('express-validator')
const slugify = require("slugify");
const { checkMiddleware } = require("../../middlewares/validator/validatorMiddlware")
const categoryModel = require('../../models/category_models');
const subCategoryModel = require('../../models/subCategoryModel');

const createProductValidator = [
    check("title").isLength({ min: 3 }).withMessage("Title should be at least 3 characters").notEmpty().withMessage("Title should not be empty").custom((value, { req }) => {
        req.body.slug = slugify(value)
        return true
    }),
    check("description").notEmpty().withMessage("Description should not be empty").isLength({ max: 2000 }).withMessage("Description too long"),
    check("quantity").notEmpty().withMessage("product required is required").isNumeric().withMessage("quantity is Number"),
    check("sold").optional().isNumeric().withMessage("product quantity must be a number"),
    check("price").notEmpty().withMessage("product price required").isNumeric().withMessage("product price must be a number").isLength({ max: 200 }).withMessage("too long product price"),
    check("priceAfterDiscount").optional().toFloat().isNumeric().withMessage("priceAfterDiscount must be a number").custom((value, { req }) => {
        if (req.body.price <= value) {
            throw new Error('price after discount must be less than price')
        }
        return true
    }),
    check('colors').optional().isArray().withMessage("availableColors should be an array"),
    check("imageCover").notEmpty().withMessage("imageCover is required"),
    check("images").optional().isArray().withMessage("images should be an array of strings"),
    check("category").notEmpty().withMessage("product must be belong to a category").isMongoId().withMessage("ID is Invalid").custom((value) => categoryModel.findById(value).then((categoryValue) => {
        if (!categoryValue) {
            return Promise.reject(new Error(`Category ${value} not found`))
        }
    })),
    check('subcategories')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID formate')
        .custom((subcategoriesIds) =>
            subCategoryModel.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
                (result) => {
                    // console.log(`this is values before error: ${result.length < 1} && ${result.length} && ${subcategoriesIds.toArray().length}`)
                    if (result.length < 1) {
                        console.log('we have an error in first custom subCategoryModel')
                        return Promise.reject(new Error(`Invalid subcategories Ids`));
                    }
                }
            )
        )
        .custom((val, { req }) =>
            subCategoryModel.find({ category: req.body.category }).then(
                (subcategories) => {
                    console.log(`subcategories values is: ${subcategories}`)
                    const subCategoriesIdsInDB = [];
                    subcategories.forEach((subCategory) => {
                        subCategoriesIdsInDB.push(subCategory._id.toString());
                    });
                    // check if subcategories ids in db include subcategories in req.body (true)
                    const checker = function (target, arr) {
                        return target.every((v) => arr.includes(v));
                    };
                    if (!checker(subCategoriesIdsInDB,val)) {
                        return Promise.reject(
                            new Error(`subcategories not belong to category`)
                        );
                    }
                }
            )
        ),
    check("brand").optional().isMongoId().withMessage("Invalid Id format"),
    check("ratingsAverage").optional().isNumeric().withMessage("ratingsAverage must be a number").isLength({ min: 1 }).withMessage("rating min is 1").isLength({ max: 5 }).withMessage("rating max is 5"),
    check("ratingsQuantity").optional().isNumeric().withMessage("ratingsQuantity must be a number"),
    checkMiddleware
];

const updateProductValidator = [
    check("title").isLength({ min: 3 }).withMessage("Title should be at least 3 characters").notEmpty().withMessage("Title should not be empty").custom((value, { req }) => {
        req.body.slug = slugify(value)
        return true
    }),
    check("id").isMongoId().withMessage("Invalid Id format"),
    checkMiddleware
]

const checkIdValidator = [
    check("id").isMongoId().withMessage("Invalid Id format"),
    checkMiddleware
]

module.exports = {
    createProductValidator,
    checkIdValidator,
    updateProductValidator
}
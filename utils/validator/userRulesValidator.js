const { check } = require('express-validator')
const slugify = require("slugify");
const bcryptjs = require('bcryptjs')
const { checkMiddleware } = require("../../middlewares/validator/validatorMiddlware")
const userModel = require('../../models/user_models');
const ApiError = require('../api_error');


const createUserValidator = [

    check("name")
        .notEmpty()
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
        .withMessage('Name is required'),

    check("email")
        .notEmpty()
        .withMessage("Please Enter Your Email")
        .isEmail()
        .withMessage('Invalid email format')
        .custom((value) =>
            userModel.findOne({ email: value }).then((user) => {
                if (user) {
                    return Promise.reject(Error("Email Already in use"))
                }
            })
        ),

    check("phone")
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage("Please enter a phone number for egypt or saudi"),

    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.passwordConfirmation) {
                throw Error("Password not Equal Confirm password")
            }
            return true
        }).withMessage('password must equal confirmation password')
    ,

    check("passwordConfirmation")
        .notEmpty()
        .withMessage('confirmPassword is required'),

    checkMiddleware
]

const updateUserValidator = [

    check("id")
        .isMongoId()
        .withMessage('Invalid user id format'),

    check("name")
        .optional()
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        }),

    check("email")
        .optional()
        .isEmail()
        .custom((value) => {
            userModel.findOne({ email: value }).then((user) => {
                if (user) {
                    return new ApiError("Email Already found", 409)
                }
            })
        }).withMessage("Email Already Created"),


    check("phone")
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage("Please enter a phone number"),

    check("password")
        .optional()
        .isLength({ min: 8 })
        .withMessage("password too short"),

    checkMiddleware
]



const checkIdValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Id Format"),
    checkMiddleware,
]

const updatePasswordValidator = [
    check("id").isMongoId().withMessage("Invalid Id Format"),
    check("currentPassword")
        .notEmpty()
        .withMessage("current password is required")
        .custom(async (value, { req }) => {
            // 1- verify user
            const user = await userModel.findById(req.params.id)
            if (!user) {
                throw new Error("User not found")
            }
            // 2- compare current user enterd and current user in database
            const compareOldPassword = await bcryptjs.compare(value, user.password)
            if (!compareOldPassword) {
                throw new Error("Incorrect current password")
            }
            return true
        })
        .withMessage("current password is incorrect"),
    check("newPassword")
        .notEmpty()
        .withMessage("new password is required")
        .isLength({ min: 8 })
        .withMessage("password too short"),

    check("confirmNewPassword")
        .notEmpty()
        .withMessage("confirm new password is required")
        .custom(
            async (value, { req }) => {

                // 3- compare confirmation password and password
                if (value !== req.body.newPassword) {
                    throw new Error("Password not equal Confirm password", 400)
                }
            })
        .withMessage("confirm password not equal new password"),
    checkMiddleware
]

const updateLoggedUserPasswordValidator = [
    check("currentPassword")
        .notEmpty()
        .withMessage("current password is required")
        .custom(async (value, { req }) => {
            // 1- verify user
            const user = await userModel.findById(req.params.id)
            if (!user) {
                throw new Error("User not found")
            }
            // 2- compare current user enterd and current user in database
            const compareOldPassword = await bcryptjs.compare(value, user.password)
            if (!compareOldPassword) {
                throw new Error("Incorrect current password")
            }
            return true
        })
        .withMessage("current password is incorrect"),

    check("password")
        .notEmpty()
        .withMessage("new password is required")
        .isLength({ min: 8 })
        .withMessage("password too short"),

    check("confirmNewPassword")
        .notEmpty()
        .withMessage("confirm new password is required")
        .custom(
            async (value, { req }) => {

                // 3- compare confirmation password and password
                if (value !== req.body.password) {
                    throw new Error("Password not equal Confirm password", 400)
                }
            })
        .withMessage("confirm password not equal new password"),
    checkMiddleware
]

const updateLoggedUserDataValidator = [
    check("name")
        .optional()
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        }),

    check("email")
        .optional()
        .isEmail()
        .custom((value) => {
            userModel.findOne({ email: value }).then((user) => {
                if (user) {
                    return new ApiError("Email Already found", 409)
                }
            })
        }).withMessage("Email Already Created"),


    check("phone")
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage("Please enter a phone number"),
]

module.exports = {
    createUserValidator,
    updateUserValidator,
    checkIdValidator,
    updatePasswordValidator,
    updateLoggedUserPasswordValidator,
    updateLoggedUserDataValidator,
}
const { check } = require('express-validator');
const slugify = require('slugify');
const { checkMiddleware } = require('../../middlewares/validator/validatorMiddlware')
const userModel = require('../../models/user_models');


const signUpValidator = [
    check("name")
        .notEmpty()
        .withMessage("Please Enter Your Name")
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
    ,

    check("password")
        .notEmpty()
        .withMessage("Please Enter Your Password")
        .custom((value, { req }) => {
            if (value !== req.body.passwordConfirmation) {
                throw new Error('password must equal confirmation password')
            }
            return true
        })
        .withMessage('password must equal confirmation password')
    ,
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
        .withMessage("Please Enter a phone number in egypt or saudia")
    ,

    check("passwordConfirmation")
        .notEmpty()
        .withMessage("Please Enter passwordConfirmation")
    ,

    checkMiddleware
]

const loginValidator = [
        check("email")
           .notEmpty()
           .withMessage("Please Enter Your Email")
           .isEmail()
           .withMessage('Invalid email format'),
        
        check("password")
            .notEmpty()
            .withMessage("Please Enter Your Password"),
            
        checkMiddleware
]

module.exports = {
    signUpValidator,
    loginValidator
};
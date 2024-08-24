const express = require('express');

const {
    signUp,
    login,
    forgetPassword,
    verifyResetCode,
    resetPassword
} = require('../controllers/authentication_controller')

const {
    signUpValidator,
    loginValidator,
} = require('../utils/validator/authenticationRulesValidator')

const router = express.Router();

router.route('/signup')
    .post(signUpValidator, signUp);

router.route('/login')
    .post(loginValidator, login);

router.post('/forgetpassword', forgetPassword)

router.post('/verifyResetPassword', verifyResetCode)

router.put('/resetPassword', resetPassword)

module.exports = router
// this is file for authentication services only like (login,logout, reset password,forgot password,register)

const expressAsyncHandler = require('express-async-handler')
const bcryptjs = require('bcryptjs')
const jsonWebToken = require('jsonwebtoken')
const crypto = require('crypto')
const userModel = require('../models/user_models')
const ApiError = require('../utils/api_error')

const { sendEmail } = require('../utils/usingEmailToSend')

const { generateToken } = require('../utils/generate_new_token')

// this is for register new user
const signUp = expressAsyncHandler(async (req, res) => {
    const user = await userModel.create(req.body)
    // generate token 
    const token = generateToken(user._id)

    res.status(201).json({ "status": "success", token, "User": user, })
})

// this is for login
const login = expressAsyncHandler(async (req, res, next) => {
    // 1- check if email and password are send in body and 
    const { email, password } = req.body
    // 2- check if user exist in db by email 
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new ApiError("Incorrect email or password", 404))
    }
    // console.log(`user email is found in db: ${user.email}`)
    // 3- check if password is correct  by comparing hashed password  with password sent in body  using bcryptjs library  (npm install bcryptjs)
    const comparePassword = await bcryptjs.compare(password.trim(), user.password)
    console.log(`Compare password value is: ${comparePassword}`)
    if (!comparePassword) {
        return next(new ApiError("Incorrect email or password", 404))
    }
    // 4- generate token if email and password are correct
    const token = generateToken(user._id)

    res.status(200).json({ "status": "success", token, data: user })
}
)

// this is middleware for controlling or protecting another endpoints or routes 
const protected = expressAsyncHandler(async (req, res, next) => {
    // 1- check if token exists, if exists get 
    let token = ''
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    console.log(`this is token value: ${token}`)
    if (!token) {
        return next(new ApiError('You are not login, please login to get access', 401))
    }
    // 2- verify token (no change happend, expire token)
    const verifyToken = jsonWebToken.verify(token, process.env.jwt_secret_key)

    console.log(`this is verify token: ${JSON.stringify(verifyToken)}`)
    if (!verifyToken) {
        return next(new ApiError('Token is expired, please login again', 401))
    }
    // 3- check if user exists 
    const user = await userModel.findById(verifyToken.userId)
    if (!user) {
        return next(new ApiError('this token is not valid for user please generate new token...', 401))
    }
    // check if user have an active account or not

    if (user.active === false) {
        next(new ApiError("pleas you need to activate your account", 401))
    }

    // 4- check if user change his password -> after token created 
    const userPassword = user.passwordChangedAt
    if (userPassword) {
        // this is beautiful method uset to convert date to timestamp -> getTime() 
        const passwordTimeStamp = parseInt(userPassword.getTime() / 1000, 10)
        console.log(`this is value for user changed password: ${userPassword.getTime()} && this is exp date:${(verifyToken.iat)}`)
        // this is mean the user changed password after token created
        if (passwordTimeStamp > verifyToken.iat) {
            return next(new ApiError('You have changed your password, please login again', 401))
        }
    }
    console.log(`we moved all errors`)

    req.user = user

    next()
})

const allowedTo = (...role) => expressAsyncHandler(async (req, res, next) => {
    // 1- need to get user role for the current route 
    console.log(`Role send from allowedTo -> ${req.user.role}`)
    // 2- need to check this role with the current user role -> about req.user.role
    if (!role.includes(req.user.role)) {
        return next(new ApiError(`${req.user.role} role can't access this route`, 403))
    }
    console.log(`we moved all errors`)
    next()
})

const forgetPassword = expressAsyncHandler(async (req, res, next) => {
    // 1- check if the user email is already exists
    if (!req.body.email) {
        return next(new ApiError("please enter your email", 404))
    }
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(new ApiError(`User not found with that email: ${req.body.email}`, 404))
    }
    // 2- generate random 6 digit and save it in database & need to hashing this reset password
    const randomDigit = Math.floor(100000 + Math.random() * 900000).toString()
    const randomDigitHashed = crypto.createHash('sha256').update(randomDigit).digest('hex')
    // 
    user.passwordResetCode = randomDigitHashed
    // add expiration date to user = 10 minutes (10 * 60 * 1000)
    user.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000 // 10 min
    // need to set verification password value -> this is mean if user entered reset password value or not
    user.passwordRestVerification = false
    await user.save()

    // 3- send email to user with reset password link
    console.log(`this is value result after reset password: ${user}`)

    try {
        await sendEmail({
            to: user.email,
            subject: 'Reset Password',
            message: `Hi dear ${user.name}\nTo reset your password, please enter those 6 digit\n${randomDigit}`,
        })
    } catch (error) {
        // if user have an error when the email sending will save the data by undefined on datatabase
        user.passwordResetCode = undefined

        user.passwordResetExpiresAt = undefined

        user.passwordRestVerification = undefined

        await user.save()

        return next(new ApiError("we have an error on server, please try again later", 500))
    }

    res.status(200).json({ "status": "success", message: 'Check your email for reset password link' })
})

const verifyResetCode = expressAsyncHandler(async (req, res, next) => {
    // 4- check the reset password value with the user value will send it 

    // steps 
    //1- get user depending on the reset password after hashing 
    const hashedResetPassword = crypto.
        createHash('sha256').
        update(req.body.passwordResetCode).
        digest('hex');
    console.log(`this is hashed reset password: ${hashedResetPassword}`)
    const user = await userModel.findOne({
        passwordResetCode: hashedResetPassword,
        passwordResetExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ApiError("reset code is Invalid or expired", 404))
    }

    // 2- we found this user so we need to change (passwordRestVerification value) -> true 
    user.passwordRestVerification = true
    await user.save()


    res.status(200).json({ status: 'success' })
})

const resetPassword = expressAsyncHandler(async (req, res, next) => {
    // 5- get user based on email and update password
    const user = await userModel.findOne({
        email: req.body.email
    });
    if (!user) {
        return next(new ApiError("User not found or reset code is invalid", 404))
    }
    if (user.passwordRestVerification === false) {
        return next(new ApiError("reset code not verified", 400))
    }
    // 6- hash the new password and save it to database
    if (!req.body.newpassword) {
        return next(new ApiError("Please enter new password", 400))
    }
    const hashedPassword = await bcryptjs.hash(req.body.newpassword, 12)
    user.password = hashedPassword

    user.passwordResetCode = undefined

    user.passwordResetExpiresAt = undefined

    user.passwordRestVerification = undefined

    await user.save()

    // 7- need to generate new token 
    const token = generateToken(user._id)

    res.status(200).json({ status: 'success', token, user })
})

module.exports = {
    login,
    signUp,
    protected,
    allowedTo,
    forgetPassword,
    verifyResetCode,
    resetPassword,
}
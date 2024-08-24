const jsonWebToken = require('jsonwebtoken');

// this function is used to generate JWT token  (JSON Web Tokens)
const generateToken = (payLoad) => {
    const token = jsonWebToken.sign(
        { userId: payLoad }, process.env.jwt_secret_key,
        { expiresIn: process.env.jwt_expires_in })
    return token
}

module.exports = { generateToken }
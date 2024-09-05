const express = require('express');

const router = express.Router()

const {
    protected,
    allowedTo
} = require('../controllers/authentication_controller')
const {
    addAddress,
    removeAddress,
    getAddress,
} = require('../controllers/userAdresses_controller')

router.use(
    protected,
    allowedTo('user'),
)

router
    .route('/')
    .get(
        getAddress
    )
    .post(
        addAddress
    )

router
.delete(
    '/:addressId',
    removeAddress
)

module.exports = router
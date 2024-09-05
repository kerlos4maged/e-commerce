const express = require('express');

const router = express.Router();

const {
    protected,
    allowedTo
} = require('../controllers/authentication_controller')

const {
    setProductToWichList,
    removeProductFromWichList,
    getUserWishlist,
} = require('../controllers/wich_list_contorller')

const {
    addToWishListValidator,
    removeFromWishListValidator
} = require('../utils/validator/wichlistRulesValidator')

router.use(
    protected,
    allowedTo('user')
)

router
    .route('/')
    .get(

        getUserWishlist
    )
    .post(

        addToWishListValidator,
        setProductToWichList
    )


router
    .route('/:productId')
    .delete(

        removeFromWishListValidator,
        removeProductFromWichList
    )

module.exports = router
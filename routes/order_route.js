const express = require('express');

const router = express.Router();

const {
    protected,
    allowedTo
} = require('../controllers/authentication_controller')

const {
    payCashOrderController,
    getAllOrdersController,
    filterOrderForLoggedUserController,
    getSpecificOrdersController,
    updateOrderToPayController,
    updateOrderDeliveredController,
    payOnlineUsingStripe
} = require('../controllers/order_controller')

router.use(protected)

router.get('/checkout-sessions/:id', payOnlineUsingStripe)

router.route('/')
    .get(
        allowedTo('user', 'admin'),
        filterOrderForLoggedUserController,
        getAllOrdersController,
    )


router.route('/:id')
    .post(allowedTo('user'), payCashOrderController)
    .get(allowedTo('user'), getSpecificOrdersController)

router.put('/:orderId/pay', allowedTo('admin'), updateOrderToPayController)

router.put('/:orderId/delivere', allowedTo('admin'), updateOrderDeliveredController)

module.exports = router
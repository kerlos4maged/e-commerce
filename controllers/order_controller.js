const stripe = require('stripe')(process.env.stripe_private_key)

const asyncHandler = require('express-async-handler')

const ApiError = require('../utils/api_error')

const {
    getAllDocumentsService,
    getSpecificDocumentService
} = require('../utils/apiServices')

const orderModel = require('../models/order_models')

const productModel = require('../models/product_models')

const { sendEmail } = require('../utils/usingEmailToSend')

const cartModel = require('../models/cart_models')
const userModel = require('../models/user_models')

const changeProductQunatityAfterCreateOrder = async (order, cart, cartId) => {
    // 4- after make the order complete check the quantity for the product and how much is sold
    if (order) {
        const bulkOption = cart.products.map((productItem) => ({
            updateOne: {
                filter: { _id: productItem.product },
                update: {
                    $inc: { quantity: -productItem.quantity, sold: +productItem.quantity },
                },
            },
        }))
        await productModel.bulkWrite(bulkOption, {})
        // 5- clear the user cart after make the order complete depending on id
        await cartModel.findByIdAndDelete(cartId)
    }
}

// payment on cash orders 
// @route -> Post Api/v1/orders/:cartItemId
// @access protected/user

const payCashOrderController = asyncHandler(async (req, res, next) => {
    // app settings Admin user will set it 
    const taxPrice = 0
    const shippingPrice = 0
    // 1- get and check the cart
    const cart = await cartModel.findById(req.params.id)
    if (!cart) {
        return next(new ApiError('Cart not found', 404))
    }
    // 2- check if we apply coupon or not
    const cartPrice = cart.priceAfterDiscount ? cart.priceAfterDiscount : cart.total
    // 3- create order and save it in database
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice
    if (cart.products.length <= 0) {
        return next(new ApiError('No products in the cart', 404))
    }
    const order = await orderModel.create({
        user: req.user._id,
        cart: cart.products,
        totalOrderPrice: totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    })
    console.log(order)

    // 4- after make the order complete check the quantity for the product and how much is sold 
    changeProductQunatityAfterCreateOrder(order, cart, req.params.id)

    // 6- send email to the user with order details
    await sendEmail({
        to: req.user.email,
        subject: 'Order placed successfully',
        message: `Your order has been placed successfully. Order ID: ${order._id}\nyour total price is:${order.totalOrderPrice}`,
    })
    res.status(201).json({
        Success: "Success",
        message: 'Order placed successfully checked your email ',
        data: order,
    })
})

// get all cash orders 
// @route -> Post Api/v1/orders/
// @access protected/user-admin

const filterOrderForLoggedUserController = asyncHandler(
    async (req, res, next) => {
        if (req.user.role === 'user') {
            req.filterById = { user: req.user._id }
        }
        next()
    }
)

const getAllOrdersController = getAllDocumentsService(orderModel)

const getSpecificOrdersController = getSpecificDocumentService(orderModel)

// Update order paid status to paid  
// @route -> Put Api/v1/orders/:orderId/pay 
// @access protected/admin

const updateOrderToPayController = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findByIdAndUpdate(req.params.orderId, {
        isPaid: true,
        paidAt: Date.now()
    }, { new: true }
    )
    if (!order) {
        return next(new ApiError('Order not found', 404))
    }
    res.status(200).json({
        success: true,
        message: 'Order paid successfully',
        data: order,
    })
})

const updateOrderDeliveredController = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findByIdAndUpdate(req.params.orderId, {
        isDelivered: true,
        deliverdAt: Date.now()
    }, { new: true }
    )
    if (!order) {
        return next(new ApiError('Order not found', 404))
    }
    res.status(200).json({
        success: true,
        message: 'Order delivered successfully',
        data: order,
    })
})

const createSessionUsingString = asyncHandler(
    async (req, res, next) => {
        // app settings Admin user will set it 
        const taxPrice = 0
        const shippingPrice = 0
        // 1- get and check the cart
        const cart = await cartModel.findById(req.params.id)
        if (!cart) {
            return next(new ApiError('Cart not found', 404))
        }
        // 2- check if we apply coupon or not
        const cartPrice = cart.priceAfterDiscount ? cart.priceAfterDiscount : cart.total

        const totalOrderPrice = cartPrice + taxPrice + shippingPrice

        // 3- create session 
        console.log('we now will move to the session creation')
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // this is mean that the payment will be done by card
            line_items: [
                {
                    price_data: {
                        currency: 'usd', // Specify currency
                        product_data: {
                            name: req.user.name, // Specify product name
                            // description: cart, // Optional product description
                        },
                        unit_amount: totalOrderPrice * 100, // Price in cents ($20.00)
                    },
                    quantity: 1, // Quantity of the product
                },
            ],
            mode: 'payment', // this is mean that the payment will be done on the client side
            success_url: `${req.protocol}://${req.get('host')}/api/v1/order`,// this is mean where the user will going to after make pay
            cancel_url: `${req.protocol}://${req.get('host')}/api/v1/cart`, // this is where the user will go to if cancel it
            customer_email: req.user.email,
            client_reference_id: req.params.id,
            metadata: req.body.shoppingAddress
        })

        console.log(`this is session created : ${session}`)

        // 4- send session to response 
        res.status(200).send({
            success: 'true',
            message: 'Checkout session created',
            session,
        })
    })

const createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const oderPrice = session.amount_total / 100;

    const cart = await cartModel.findById(cartId);
    const user = await userModel.findOne({ email: session.customer_email });

    // 3) Create order with default paymentMethodType card
    const order = await orderModel.create({
        user: user._id,
        cart: cart.products,
        // shippingAddress,
        totalOrderPrice: oderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethod: 'card',
    });

    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
            },
        }));
        await productModel.bulkWrite(bulkOption, {});

        // 5) Clear cart depend on cartId
        await cartModel.findByIdAndDelete(cartId);
    }
};

const createOrderOnlineUsingStripe = (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.stripe_web_hook_key);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            // Then define and call a function to handle the event checkout.session.completed
            // eslint-disable-next-line no-case-declarations
            createCardOrder(event.data.object);
            console.log('we moved in checkout.session.completed')
            res.status(200).send({
                "Status": "Success",
                "message": "received order successfully",
            })
            break;
        case 'checkout.session.expired':
            res.status(400).send({
                // Then define and call a function to handle the event checkout.session.expired
                Status: "Failed",
                message: "payment failed",
                Error: "checkout session expired"
            });
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // all the code before this comment get it from stripe webhook creation
}

module.exports = {
    payCashOrderController,
    getAllOrdersController,
    filterOrderForLoggedUserController,
    getSpecificOrdersController,
    updateOrderToPayController,
    updateOrderDeliveredController,
    createSessionUsingString,
    createOrderOnlineUsingStripe
}
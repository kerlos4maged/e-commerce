const express = require('express');

const { landingPageWelcomeController } = require('../controllers/welcome_controller')

const router = express.Router();

router.get('/', landingPageWelcomeController)

module.exports = router
const express = require('express');
const { body } = require('express-validator/check');

const utilController = require('../controllers/util-controller');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post(
    '/add-route',
    isAuth, 
    utilController.postAddRoute
    );

router.post(
    '/add-location',
    isAuth, 
    utilController.postAddLocations
);

router.post(
    '/add-address',
    isAuth, 
    utilController.postAddAddresses
);



module.exports = router;
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
    '/add-address',
    isAuth, 
    utilController.postAddAddresses
);

router.get(
    '/get-start-address/:addressId',
    utilController.getAddressStart
);

router.get(
    '/get-end-address/:addressId',
    utilController.getAddressEnd
);

router.get(
    '/get-route/:routeId',
    utilController.getRoute
);



module.exports = router;
const express = require('express');
const { body } = require('express-validator/check');

const utilController = require('../controllers/util-controller');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

/**
 * isAuth is a middleware that could 
 * be found in the middlewares folder.
 * This middleware is used to verify
 * the jwt token for its validation.
 */
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

router.post(
    '/add-manifest',
    isAuth,
    utilController.postAddManifestLocation
);

router.post(
    '/add-courier',
    isAuth,
    utilController.postAddCourier
);

router.post(
    '/add-location',
    isAuth,
    utilController.postAddLocations
);

router.post(
    '/add-shipment-state',
    isAuth,
    utilController.postShipmentState
);

router.post(
    '/add-shipment-status',
    isAuth,
    utilController.postShipmentStatus
);

router.post(
    '/add-permission',
    isAuth,
    utilController.postPermission
);

router.post(
    '/add-access',
    isAuth,
    utilController.postShipmentAccess
);

router.post(
    '/add-module',
    isAuth,
    utilController.postModule
);

router.post(
    '/add-component',
    isAuth,
    utilController.postComponent
);

router.post(
    'add-content',
    isAuth,
    utilController.postContent
);

router.post(
    '/add-heartbeat',
    isAuth,
    utilController.postHeartBeat
);

router.post(
    'add-shipment',
    isAuth,
    utilController.postShipment
)

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
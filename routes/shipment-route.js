const express = require('express');
const { body } = require('express-validator/check');

const shipmentController = require('../controllers/shipment-controller');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post(
    '/add-shipment',
    isAuth, 
    shipmentController.postAddShipment);

router.put(
    '/update-shipment/:shipmentId', 
    isAuth,
    shipmentController.putUpdatedShipment);

router.delete('/delete-shipment/:shipmentId', isAuth, shipmentController.postDeletePShipment);

router.get('/get-shipments', isAuth, shipmentController.getShipments);

router.get('/get-shipment/:shipmentId', isAuth, shipmentController.getSingleShipment);

module.exports = router;
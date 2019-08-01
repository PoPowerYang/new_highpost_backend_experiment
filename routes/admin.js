const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/add-shipment', adminController.postAddShipment);

router.post('/update-shipment/:shipmentId', adminController.postUpdatedShipment);

router.delete('/delete-shipment/:shipmentId', adminController.postDeletePShipment);

router.get('/get-shipments', adminController.getShipments);

router.get('/get-shipment/:shipmentId', adminController.getSingleShipment);


module.exports = router;
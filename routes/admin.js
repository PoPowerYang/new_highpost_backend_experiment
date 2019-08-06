const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post(
    '/add-shipment',
    isAuth,
    [
        body('title')
            .trim()
            .isLength({ min: 5 })
    ], 
    adminController.postAddShipment);

router.put(
    '/update-shipment/:shipmentId', 
    isAuth,
    [
        body('title')
            .trim()
            .isLength({ min: 5 })
    ], 
    adminController.putUpdatedShipment);

router.delete('/delete-shipment/:shipmentId', isAuth, adminController.postDeletePShipment);

router.get('/get-shipments', isAuth, adminController.getShipments);

router.get('/get-shipment/:shipmentId', isAuth, adminController.getSingleShipment);


module.exports = router;
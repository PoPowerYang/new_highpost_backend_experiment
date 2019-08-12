const unique = require('uniqid');

const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const Addresses = require('../models/addresses');
const Shipment = require('../models/shipment');
const Route = require('../models/route');
const PurchaseOrder = require('../models/purchase-order');
const ServiceType = require('../models/service-type');
const Module = require('../models/module');
const location = require('../models/location');
const Content = require('../models/contents');
const Component = require('../models/components');
const ManifestLocation = require('../models/manifest-location');
const Courier = require('../models/courier');
const ShipmentState = require('../models/shipment-state');
const ShipmentStatus = require('../models/shipment-status');
const ShipmentAccess = require('../models/shipment-access');
const Permission = require('../models/permissions');
const Heartbeat = require('../models/heartbeat');



exports.getShipments = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        const user = await User.findByPk(req.body.userId);
        const shipments = await user.getShipments();
        if(!shipments) {
            const error = new Error('Could not find shipments');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message:'Shipment found!', shipment: shipments });
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getSingleShipment = async (req, res, next) => {
    try{
        const shipId = req.params.shipmentId;
        
        const user = await User.findByPk(req.userId);

        if(!user) {
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }

        const shipment = await user.getShipments({where: {id: shipId}});

        if(!shipment) {
            const error = new Error('Could not find shipment');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ message:'Shipment found!', shipment: shipment });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }


    // User.findByPk(req.userId)
    // .then(result => {
    //    return result.getShipments({where: {id: shipId}});
    // })
    // .then(shipment => {
    //     // res.send(shipment);
    //     res.status(200).json({ message:'Shipment found!', shipment: shipment });
    // })
    // .catch(err => {
        // if (!err.statusCode) {
        //     err.statusCode = 500;
        // }
        // next(err);
    // });
};

exports.postAddShipment = async (req, res, next) => {

    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        var result = [];

        const shipment = await Shipment.create({id: unique('shipment-')});

        const user = await User.findByPk(req.body.userId);
        resultUser = await user.addShipment(shipment);
        result.push(resultUser);

        const highpostroute = await Route.findByPk(req.body.routeId);
        const resultRoute = await highpostroute.setShipment(shipment);
        result.push(resultRoute);

        const purchaseOrder = await PurchaseOrder.create({id: unique('purchase-order-')});
        const resultPurchaseOrder = await purchaseOrder.setShipment(shipment);
        result.push(resultPurchaseOrder);

        const serviceType = await ServiceType.create({id: unique('service-type-'), name: 'sss secret'});
        const resultServiceType = await serviceType.setShipment(shipment);
        result.push(resultServiceType);

        const highpostModule = await Module.findByPk(req.body.moduleId);
        const resultModule = await highpostModule.setShipment(shipment);
        result.push(resultModule);
    
        res.status(201).json({
            message: 'Shipment created successfully!',
            shipment: result
        });
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.putUpdatedShipment = async (req, res, next) => {
    try{
        const shipId = req.params.shipmentId;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        const updatedTitle = req.body.title;
        const updatedender = req.body.sender;
        const updatedRecipient = req.body.recipient;
        const updatedAddress = req.body.address;
        const updatedDescription = req.body.description;

        const user = await User.findByPk(req.userId);
        const shipment = await user.getShipments({where: {id: shipId}});
        shipment[0].title = updatedTitle;
        shipment[0].sender = updatedender;
        shipment[0].recipient = updatedRecipient;
        shipment[0].address = updatedAddress;
        shipment[0].description = updatedDescription;
        const updatedshipment = await shipment[0].save();
        res.status(200).json({ message:'Shipment updated!', shipment: updatedshipment });
    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
    User.findByPk(req.userId)
    .then(result => {
       return result.getShipments({where: {id: shipId}});
    })
    .then(shipment => {
        // res.send(shipment);
        if(!shipment[0]) {
            const error = new Error('Could not find shipment');
            error.statusCode = 404;
            throw error;
        }
        shipment[0].title = updatedTitle,
        shipment[0].sender = updatedender,
        shipment[0].recipient = updatedRecipient,
        shipment[0].address = updatedAddress,
        shipment[0].description = updatedDescription
        return shipment[0].save();
    })
    .then(result => {
        res.status(200).json({ message:'Shipment updated!', shipment: result });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.postDeletePShipment = async (req, res, next) => {
    const shipId = req.params.shipmentId;

    const user = await User.findByPk(req.userId);
    const shipmentToBeDestroy = await user.getShipments({ where: {id: shipId} });
    const result = shipmentToBeDestroy[0].destroy();
    // console.log(result);
    res.status(200).json({ message: 'Deleted shipment.', result: result});
    // User.findByPk(req.userId)
    //     .then(result => {
    //        return result.getShipments({ where: {id: shipId} });
    //     })
    //     .then(shipmentToBeDestroy => {
    //         return shipmentToBeDestroy[0].destroy();
    //     })
    //     .then(result => {
    //         console.log("Successfully deleted");
    //         console.log(result);
    //         res.status(200).json({ message: 'Deleted shipment.' });
    //     })
    //     .catch(err => {
    //         if (!err.statusCode) {
    //           err.statusCode = 500;
    //         }
    //         next(err);
    //     });
};
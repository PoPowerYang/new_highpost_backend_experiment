const path = require('path');

const { validationResult } = require('express-validator/check');

const Shipment = require('../models/shipment');


exports.getShipments = (req, res, next) => {
    Shipment.findAll()
    .then(shipments => {
            console.log('Shipments retrieved');
            res.status(200).json({
                message: 'Shipments fetched successfully.',
                shipments: shipments
            });
            // res.send(shipments); //this will send back a list of shipments data to the client
        })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getSingleShipment = (req, res, next) => {
    const shipId = req.params.shipmentId;
    Shipment.findByPk(shipId)
    .then(shipment => {
        if(!shipment) {
            const error = new Error('Could not find shipment.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ messgae: 'Shipment fetched.', shipment: shipment})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.postAddShipment = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const address = req.body.address;
    const description = req.body.description;
    Shipment.create({
        title: title,
        sender: sender,
        recipient: recipient,
        address: address,
        description: description
    })
    .then(result => {
        res.status(201).json({
            message: 'Shipment created successfully!',
            shipment: result
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.postUpdatedShipment = (req, res, next) => {
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
    Shipment.findByPk(shipId)
        .then(shipment => {
            if(!shipment) {
                const error = new Error('Could not find shipment');
                error.statusCode = 404;
                throw error;
            }
            shipment.title = updatedTitle,
            shipment.sender = updatedender,
            shipment.recipient = updatedRecipient,
            shipment.address = updatedAddress,
            shipment.description = updatedDescription
            return shipment.save();
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

exports.postDeletePShipment = (req, res, next) => {
    const shipId = req.params.shipmentId;
    Shipment.findByPk(shipId)
        .then(shipment => {
            if(!shipment) {
                const error = new Error('Could not find shipment');
                error.statusCode = 404;
                throw error;
            }
            return shipment.destroy();
        })
        .then(result => {
            console.log("Successfully deleted");
            res.status(200).json({ message: 'Deleted shipment.' });
        })
        .catch(err => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
        });
};
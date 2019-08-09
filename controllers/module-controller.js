const unique = require('uniqid');

const { validationResult } = require('express-validator/check');

const Shipment = require('../models/module');
const Module = require('../models/module');

exports.getModuleInformation = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect');
            error.statusCode = 422;
            throw error;
        }
        const moduleId = req.prarams.moduleId;
        const highpostModule = await Module.findByPk(moduleId);
        const heartbeat = await highpostModule.getHeartbeat();
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
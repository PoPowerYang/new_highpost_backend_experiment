const Shipment = require('../models/shipment');

// exports.getAddShipment = (req, res, next) => {
//     res
// }

exports.getShipments = (req, res, next) => {
    Shipment.findAll()
    .then(
        shipments => {
            console.log('Shipments retrieved');
            res.send(shipments); //this will send back a list of shipments data to the client
        }
    )
    .catch();
}

exports.getSingleShipment = (req, res, next) => {
    const shipId = req.params.shipmentId;
    console.log(shipId);
    Shipment.findByPk(shipId)
    .then(
        shipment => res.send(shipment)
    )
    .catch(
        err => {
            console.log(err);
            res.send(err);
        }
    );
};

exports.postAddShipment = (req, res, next) => {
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
        console.log('Created Shipment');
        res.send(result);
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postUpdatedShipment = (req, res, next) => {
    const shipId = req.body.shipId;
    const updatedTitle = req.body.title;
    const updatedender = req.body.sender;
    const updatedRecipient = req.body.recipient;
    const updatedAddress = req.body.address;
    const updatedDescription = req.body.description;
    Shipment.findByPk(shipId)
    .then(shipment => {
        shipment.title = updatedTitle,
        shipment.sender = updatedender,
        shipment.recipient = updatedRecipient,
        shipment.address = updatedAddress,
        shipment.description = updatedDescription
        return shipment.save();
    })
    .then(result => {
        console.log('Updated Shipment');
        res.send(result);
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postDeletePShipment = (req, res, next) => {
    const shipId = req.body.shipmentId;
    Shipment.findByPk(shipId)
        .then(shipment => {
            return shipment.destroy();
        })
        .then(result => {
            console.log("Successfully deleted");
            res.send('Shipment deleted');
        })
        .catch(err => res.send(err));
};
const Shipment = require('../models/shipment');

// exports.getAddShipment = (req, res, next) => {
//     res
// }

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
        })
        .catch(err => {
            console.log(err);
        });
};
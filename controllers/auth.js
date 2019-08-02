const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const age = req.body.age;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const address = req.body.address;
    const phone = req.body.phone;
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            return User.create({
                email: email,
                name: name,
                password: hashedPw,
                age: age,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phone: phone,
            });
        })
        .then(result => {
            res.status(201).json({ message: 'User created!', userId: result.id });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
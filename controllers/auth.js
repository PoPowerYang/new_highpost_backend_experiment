const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const unique = require('uniqid');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    try{
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
        
        const hashedPw = await bcrypt.hash(password, 12);
        const result = await User.create({
            id: unique(),
            email: email,
            name: name,
            password: hashedPw,
            age: age,
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone,
        });
        res.status(201).json({ message: 'User created!', userId: result.id });
    } catch (error) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
    // bcrypt
    //     .hash(password, 12)
    //     .then(hashedPw => {
    //         return User.create({
    //             id: unique(),
    //             email: email,
    //             name: name,
    //             password: hashedPw,
    //             age: age,
    //             firstName: firstName,
    //             lastName: lastName,
    //             address: address,
    //             phone: phone,
    //         });
    //     })
    //     .then(result => {
    //         res.status(201).json({ message: 'User created!', userId: result.id });
    //     })
    //     .catch(err => {
    //         if(!err.statusCode) {
    //             err.statusCode = 500;
    //         }
    //         next(err);
    //     });
};

exports.login = async (req, res, next) => {

    try{
        const email = req.body.email;
        const password = req.body.password;
        let loadedUser;

        const user = await User.findAll({
            where: {
                email: email,
            }
        });
        if(user[0] == null) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user[0].password);
        if(!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser.id,
            },
            'mindweaverscrecetkey123!*#',
            { expiresIn: '1h'}
        );
        res.status(200).json({ token: token, userId: loadedUser.id });
    } catch (error) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
    // User.findAll({
    //     where: {
    //         email: email,
    //     }
    // }).then(user => {
    //     if(user[0]==null) {
    //         const error = new Error('A user with this email could not be found.');
    //         error.statusCode = 401;
    //         throw error;
    //     }
    //     loadedUser = user[0];
    //     return bcrypt.compare(password, loadedUser.password);
    // }) .then(isEqual => {
    //     if(!isEqual) {
    //         const error = new Error('Wrong password!');
    //         error.statusCode = 401;
    //         throw error;
    //     }
    //     const token = jwt.sign(
    //         {
    //             email: loadedUser.email,
    //             userId: loadedUser.id,
    //         },
    //         'mindweaverscrecetkey123!*#',
    //         { expiresIn: '1h'}
    //     );
    //     res.status(200).json({ token: token, userId: loadedUser.id });
    // })
    // .catch(err => {
    //     if(!err.statusCode) {
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // });
};
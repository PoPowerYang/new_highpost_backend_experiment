const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findAll({ where: { email: value } }).then(userDoc => {
                if (userDoc[0] != null) {
                    return Promise.reject('E-Mail address already exists');
                }
            });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5}),
    body('name')
        .trim()
        .not()
        .isEmpty()
    ],
    authController.signup
);

module.exports = router;
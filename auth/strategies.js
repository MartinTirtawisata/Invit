'use strict';
const {Strategy: LocalStrategy} = require('passport-local');

const {Seller} = require('../models');

// This is the strategy / the logic behind authenticating. Will be exported to auth/router.js
const localStrategy = new LocalStrategy((userName, password, callback) => {
    let user;
    Seller.findOne({userName: userName}).then(_user => {
        user = _user;
        if (!user) {
            return Promise.reject({
                reason: "LoginError",
                message: "Incorrect username or password"
            });
        }
        return user.validatePassword(password);
    }).then(isValid => {
        if (!isValid) {
            return Promise.reject({
                reason: "LoginError",
                message: "Incorrect username or password"
            });
        }
        return callback(err, false);
    });
})

module.exports = {localStrategy};
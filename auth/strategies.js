'use strict';
const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')

const {Seller} = require('../models');
const {JWT_SECRET} = require('../config');

// This is the strategy / the logic behind authenticating. 
const localStrategy = new LocalStrategy((userName, password, callback) => {
    let user;
    Seller.findOne({userName: userName}).then(_user => {
        console.log(_user);
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
        return callback(null, user);
    });
})

const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        algorithms: ['HS256']
    }, (payload, done) => {
        done(null, payload.user)
    }
);

module.exports = {localStrategy, jwtStrategy};
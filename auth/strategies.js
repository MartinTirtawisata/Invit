'use strict';
const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')

const {Seller} = require('../models');
const {JWT_SECRET} = require('../config');

// This is the strategy / the logic behind authenticating. 
const localStrategy = new LocalStrategy({
    // usernameField = req.body.userName
    usernameField: 'userName',
    passwordField: 'password'
}, (username, password, callback) => {
    let user;
    Seller.findOne({userName: username}).then(_user => {
        user = _user;
        console.log(user)
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
    }).catch(err => {
        if (err.reason === "LoginError") {
            return callback(null, false, err);
        }
        return callback(err, false);
    });
});

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
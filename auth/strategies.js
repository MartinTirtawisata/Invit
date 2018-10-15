'use strict';
const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')

const {User} = require('../models');
const {JWT_SECRET} = require('../config');

const localStrategy = new LocalStrategy({
    // usernameField is equal to req.body.userName
    usernameField: 'userName',
    passwordField: 'password'
}, (username, password, callback) => {
    let user;
    User.findOne({userName: username}).then(_user => {
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

let jwtSecret = JWT_SECRET || "SOME_SECRET_STRING"
const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        algorithms: ['HS256']
    }, (payload, done) => {
        done(null, payload.user)
    }
);

module.exports = {localStrategy, jwtStrategy};
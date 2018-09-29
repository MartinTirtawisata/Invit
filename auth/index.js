'use strict';
//used to compile all variables in a single file
const {router} = require('./router');
const {localStrategy, jwtStrategy} = require('./strategies');

module.exports = {router, localStrategy, jwtStrategy}
'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const config = require('../config');
const router = express.Router();

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken})
})

module.exports = {router}
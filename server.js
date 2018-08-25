'use strict'

const express = require('express');
const mongoose = require('mongoose')
const app = express();

app.use(express.static('public'));

let server;

function runServer(database)

app.listen(process.env.PORT || 8080);
'use strict'

const express = require('express');
// const mongoose = require('mongoose')
const app = express();

app.use(express.static('public'));

let server;

function runServer(){
    return new Promise((resolve, reject) => {
        server = app.listen(process.env.PORT || 8080, () => {
            resolve(server);
        }).on('error', err => {
            reject(err);
        });
    });
};

function closeServer(){
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err){
                reject(err);
                return;
            }
            resolve();
        })
    });
}

if (require.main === module){
    runServer().catch(err => console.error(err))
};

module.exports = {app, runServer, closeServer}

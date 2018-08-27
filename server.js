'use strict'

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const app = express();

const homeRouter = require('./routes/homeRouter')
const paymentRouter = require('./routes/paymentRouter')
const loginRouter = require('./routes/loginRouter')
const signupRouter = require('./routes/signupRouter')
const sellerRouter = require('./routes/sellerRouter')


app.use(morgan('common'));
app.use(express.static('public'));

//this is the url for html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/home.html')
});
app.get('/home', function(req, res){
    res.sendFile(__dirname + '/views/home.html')
});

app.get('/payment', function(req, res){
    res.sendFile(__dirname + '/views/payment.html')
})

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/views/login.html')
})

app.get('/signup', function(req, res){
    res.sendFile(__dirname + '/views/signup.html')
})

app.get('/seller', function(req, res){
    res.sendFile(__dirname + '/views/seller.html')
})
//this is the url for the API
app.use('/home', homeRouter);
app.use('/payment', paymentRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/seller', sellerRouter);


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

'use strict'

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const app = express();

const {DATABASE_URL, PORT} = require('./config')

const homeRouter = require('./routes/homeRouter')
const paymentRouter = require('./routes/paymentRouter')
const loginRouter = require('./routes/loginRouter')
const signupRouter = require('./routes/signupRouter')
const sellerRouter = require('./routes/sellerRouter');
const productRouter = require('./routes/productRouter')


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
app.use('/api/home', homeRouter);
app.use('/payment', paymentRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/api', sellerRouter);
app.use('/api', productRouter);


let server;

function runServer(database_url, port = PORT){
    return new Promise((resolve, reject) => {
        mongoose.connect(database_url, err => {
            if (err){
                // console.error(err);
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`you are listening on port ${port}`)
                resolve();
            })
            .on('error', function(err){
                mongoose.disconnect();
                reject(err)
            })
        })
    })
}

function closeServer(){
    return mongoose.disconnect().then(function(){
        return new Promise((resolve, reject) => {
            console.log('closing server');
            server.close(function(err){
                // console.log(err)
                if (err) {
                    return reject(err);
                }
                resolve();
            })
        })
    })
}

if (require.main === module){
    runServer(DATABASE_URL).catch(err => console.error(err))
};

module.exports = {app, runServer, closeServer}


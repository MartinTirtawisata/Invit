'use strict'
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport');
const path = require('path');
const exphbs = require('express-handlebars');
// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const {router: usersRouter} = require('./users')
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const apiRouter = require('./routes/apiRouter');

mongoose.Promise = global.Promise;
const {DATABASE_URL, PORT} = require('./config')
const app = express();

var bodyParser = require('body-parser');

// app.use(jsonParser);

app.use(morgan('common'));
app.use(express.static('public'));

// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});

app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
        data: 'rosebud'
    });
});  

//HTML URL
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars')

app.get('/index', function(req, res){
   res.render('index', {
       title: "Invit",
       style: "index.css"
   });
})

app.get('/', function(req, res){
    res.render('index', {
        title: "Invit",
        style: "index.css"
    });
 })

app.get('/login', function(req, res){
    res.render('login', {
        style: "login.css"
    });
 })

app.get('/user', function(req, res){
    res.render('user', {
        style: "user.css"
    });
})

// API URL
app.use('/api', apiRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter)


let server;

function runServer(database_url, port = PORT){
    return new Promise((resolve, reject) => {
        mongoose.connect(database_url, {useNewUrlParser: true}, err => {
            if (err){
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`you are listening on port ${port}`)
                resolve();
            }).on('error', function(err){
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


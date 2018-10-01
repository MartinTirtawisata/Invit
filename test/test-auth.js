// 'use strict';
// global.TEST_DATABASE_URL = "mongodb://localhost/test-e-commerce-node-app";
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const jwt = require('jsonwebtoken');

// const mongoose = require('mongoose');
// const { app, runServer, closeServer } = require('../server');
// const {Seller} = require('../users');
// const { JWT_SECRET } = require('../config');

// const expect = chai.expect;

// chai.use(chaiHttp);

// describe('Auth endpoints', function() {
//     const userName = 'exampleUser';
//     const password = 'examplePass';
//     const firstName = 'Example';
//     const lastName = 'User';

//     before(function() {
//         return runServer(TEST_DATABASE_URL);
//     });

//     after(function() {
//         return closeServer();
//     });

//     beforeEach(function() {
//         return Seller.hashPassword(password).then(password => {
//             Seller.create({
//                 userName, password, firstName,lastName
//             })
//         });
//     });
    
//     afterEach(function() {
//         return Seller.remove({});
//     });

//     describe('api/auth/login', function() {
//         it('should reject requests with no credentials', function() {
//             return chai.request(app).post('api/auth/login').then(() => {
//                 expect.fail(null, null, 'Request should not succeed')
//             }).catch(err => {
//                 if (err instanceof chai.AssertionError) {
//                     throw err;
//                 }

//                 const res = err.response;
//                 expect(res).to.have.status(400);
//             });
//         });

//         it('should reject requests with incorrect userName', function() {
//             return chai.request(app).post('api/auth/login').send({userName:'wrongUserName', password}).then(() => {
//                 expect.fail(null, null, 'Request should not succeed')
//             }).catch(err => {
//                 if (err instanceof chai.AssertionError) {
//                     throw err;
//                 }

//                 const res = err.response;
//                 expect(res).to.have.status(401);
//             });
//         });

//         it('should reject requests with incorrect password', function() {
//             return chai.request(app).post('api/auth/login').send({userName, password: 'wrongPassword'}).then(() => {
//                 expect.fail(null, null, 'Request should not succeed')
//             }).catch(err => {
//                 if (err instanceof chai.AssertionError) {
//                     throw err;
//                 }

//                 const res = err.response;
//                 expect(res).to.have.status(401);
//             });
//         });

//         it('should return a valid token', function() {
//             return chai.request(app).post('/api/auth/login').send({userName, password})
//             .then(res => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 const token = res.body.authToken;
//                 expect(token).to.be.a('string');
//                 const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
//                 expect(payload.user).to.deep.equal({
//                     userName,
//                     firstName,
//                     lastName
//                 });
//             });
//         });
//     });

//     describe('/api/auth/refresh', function() {
//         it('should reject requests with no credentials', function() {
//             return chai.request(app).post('/api/auth/refresh').then(() => {
//                 expect.fail(null, null, 'Request should not succeed')
//             }).catch(err => {
//                 if (err instanceof chai.AssertionError) {
//                     throw err;
//                 }

//                 const res =  err.response;
//                 expect(res).to.have.status(401)
//             });
//         });

//         it('should reject requests with an invalid token', function() {
//             const token = jwt.sign(
//                 {
//                     userName,
//                     firstName,
//                     lastName
//                 },
//                 'wrongSecret',
//                 {
//                     algorithm: 'HS256',
//                     expiresIn: '7d'
//                 }
//             );

//             return chai.request(app).post('/api/auth/refresh').set('Authorization', `Bearer ${token}`)
//             .then(() => {
//                 if (err instanceof chai.AssertionError) {
//                     throw err;
//                 }

//                 const res = err.response;
//                 expect(res).to.have.status(401);
//             });
//         });

//         it('should reject requests with an expired token', function() {
//             const token = jwt.sign(
//                 {
//                     user: {
//                         userName,
//                         firstName,
//                         lastName
//                     },
//                     exp: Math.floor(Date.now() / 1000) - 10
//                 },
//                 JWT_SECRET,
//                 {
//                     algorithm: 'HS256',
//                     subject: userName
//                 }
//             );

//             return chai.request(app).post('/api/auth/refresh').set('authorization', `Bearer ${token}`)
//             .then(() => {
//                 expect.fail(null, null, 'Request should not succeed')
//             }).catch(err => {
//                 if (err instanceof chai.AssertionError) {
//                     throw err;
//                 }

//                 const res = err.response;
//                 expect(res).to.have.status(401);
//             });
//         });

//         it('should return a valid auth token with a newer expiry date', function() {
//             const token = jwt.sign(
//                 {
//                     user: {
//                         userName,
//                         firstName,
//                         lastName
//                     }
//                 },
//                 JWT_SECRET,
//                 {
//                     algorithm: 'HS256',
//                     subject: userName,
//                     expiresIn: '7d'
//                 }
//             );
//             const decoded = jwt.decode(token)

//             return chai.request(app).post('/api/auth/refresh').set('authorization', `Bearer ${token}`)
//             .then(() => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 const token = res.body.authToken;
//                 expect(token).to.be.a('string');
//                 const payload = jwt.verify(token, JWT_SECRET, {
//                     algorithms: ['HS256']
//                 });
//                 expect(payload.user).to.deep.equal({
//                     userName, 
//                     firstName, 
//                     lastName
//                 });
//                 expect(payload.exp).to.be.at.least(decoded.exp);
//             });
//         });
//     });
// });
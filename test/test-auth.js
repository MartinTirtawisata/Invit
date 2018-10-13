'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const {TEST_DATABASE_URL} = require('../config');

const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');
const {Seller} = require('../users');
const { JWT_SECRET } = require('../config');

const jwtSecret = JWT_SECRET || "SOME_SECRET_STRING"

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints', function() {
    const userName = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {
        return Seller.hashPassword(password).then(password => {
            Seller.create({
                userName, password, firstName,lastName
            })
        });
    });
    
    afterEach(function() {
        return Seller.remove({});
    });

    describe('/api/auth/refresh', function() {
        it('should reject requests with no credentials', function() {
            return chai.request(app).post('/api/auth/refresh').then((res) => {
                expect(res).to.have.status(401)
            }).catch(err => {
                throw err;
            });
        });

        it('should reject requests with an invalid token', function() {
            const token = jwt.sign(
                {
                    userName,
                    firstName,
                    lastName
                },
                'wrongSecret',
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );

            return chai.request(app).post('/api/auth/refresh').set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res).to.have.status(401);
            }).catch(err => {
                throw err;
            })
        });

        it('should reject requests with an expired token', function() {
            const token = jwt.sign(
                {
                    user: {
                        userName,
                        firstName,
                        lastName
                    },
                    exp: Math.floor(Date.now() / 1000) - 10
                },
                jwtSecret,
                {
                    algorithm: 'HS256',
                    subject: userName
                }
            );

            return chai.request(app).post('/api/auth/refresh').set('authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res).to.have.status(401);
            }).catch(err => {
                throw err;
            });
        });
    });
});
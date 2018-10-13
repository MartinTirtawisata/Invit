'use strict';
global.TEST_DATABASE_URL = "mongodb://localhost/test-e-commerce-node-app";

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server');
const {Seller} = require('../users');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Protected endpoints', function() {
    const userName = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'Seller';

    before(function() {
    return runServer(TEST_DATABASE_URL);
    });

    after(function() {
    return closeServer();
    });

    beforeEach(function() {
    return Seller.hashPassword(password).then(password =>
    Seller.create({
        userName,
        password,
        firstName,
        lastName
    })
    );
    });

    afterEach(function() {
    return Seller.remove({});
    });

    describe('/api/protected', function() {
        it('Should reject requests with no credentials', function() {
          return chai
            .request(app)
            .get('/api/protected')
            .then((res) =>
                expect(res).to.have.status(404)
            ).catch(err => {
              throw err;
            });
        });
    
        it('Should reject requests with an invalid token', function() {
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
    
          return chai
            .request(app)
            .get('/api/protected')
            .set('Authorization', `Bearer ${token}`)
            .then((res) =>
                expect(res).to.have.status(404)
            )
            .catch(err => {
                throw err;
              
            });
        });
        it('Should reject requests with an expired token', function() {
          const token = jwt.sign(
            {
              user: {
                userName,
                firstName,
                lastName
              },
              exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: userName
            }
          );
    
          return chai
            .request(app)
            .get('/api/protected')
            .set('authorization', `Bearer ${token}`)
            .then(() =>
              expect.fail(null, null, 'Request should not succeed')
            )
            .catch(err => {
              if (err instanceof chai.AssertionError) {
                throw err;
              }
    
              const res = err.response;
              expect(res).to.have.status(401);
            });
        });
        it('Should send protected data', function() {
          const token = jwt.sign(
            {
              user: {
                userName,
                firstName,
                lastName
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: userName,
              expiresIn: '7d'
            }
          );
    
          return chai
            .request(app)
            .get('/api/protected')
            .set('authorization', `Bearer ${token}`)
            .then(res => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body.data).to.equal('rosebud');
            });
        });
      });
})

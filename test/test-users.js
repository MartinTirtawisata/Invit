'use strict';
global.DATABASE_URL = "mongodb://localhost/e-commerce-node-app";
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const {Seller} = require('../users');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/user', function() {
    const userName = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';
    const userNameB = 'exampleUserB';
    const passwordB = 'examplePassB';
    const firstNameB = 'ExampleB';
    const lastNameB = 'UserB';

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {});
    
    afterEach(function() {
        return Seller.remove({});
    });

    describe('/api/users', function() {
        describe('POST', function() {
            it('should reject users with missing userName', function() {
                return chai.request(app).post('/api/users').send({
                    password, 
                    firstName, 
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Missing Field');
                    expect(res.body.location).to.equal('username');
                });
            });

            it('should reject users with missing password', function() {
                return chai.request(app).post('/api/users').send({
                    userName, 
                    firstName, 
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('Validation Error');
                    expect(res.body.message).to.equal('Missing Field');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('should reject users with non-string username', function() {
                return chai.request(app).post('/api/users').send({
                    userName: 1234,
                    password, 
                    firstName,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('userName');
                }); 
            });

            it('should reject users with non-string password', function() {
                return chai.request(app).post('/api/users').send({
                    userName,
                    password: 1234, 
                    firstName,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('password');
                }); 
            });

            it('should reject users with non-string firstname', function() {
                return chai.request(app).post('/api/users').send({
                    userName,
                    password, 
                    firstName: 1234,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('firstName');
                }); 
            });

            it('should reject users with non-string firstname', function() {
                return chai.request(app).post('/api/users').send({
                    userName,
                    password, 
                    firstName: 1234,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('firstName');
                }); 
            });

            it('should reject users with non-string firstname', function() {
                return chai.request(app).post('/api/users').send({
                    userName,
                    password, 
                    firstName,
                    lastName:1234
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('lastName');
                }); 
            });

            it('should reject users with non-trimmed username', function() {
                return chai.request(app).post('/api/users').send({
                    userName: ` ${userName} `,
                    password,
                    firstName,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    } 

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Cannot start or end with whitespace');
                    expect(res.body.location).to.equal('userName');
                });
            });

            it('should reject users with non-trimmed password', function() {
                return chai.request(app).post('/api/users').send({
                    userName,
                    password: ` ${password} `,
                    firstName,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(onRejected => {
                    if (onRejected instanceof chai.AssertionError) {
                        throw onRejected;
                    }

                    const res = onRejected.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal (
                        'Cannot start or end with white space for password'
                    );
                    expect(res.body.location).to.equal('password');
                });
            });

            it('should reject users with empty username', function() {
                return chai.request(app).post('/api/users').send({
                    userName: ``,
                    password,
                    firstName,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    } 

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Must be at least 1 characters long');
                    expect(res.body.location).to.equal('userName');
                });
            });

            it('should reject users with passwords less than ten characters', function() {
                return chai.request(app).post('/api/users').send({
                    userName,
                    password: '123456789',
                    firstName,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    } 

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Must be at least 10 characters long');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('should reject users with passwords less than ten characters', function() {
                return chai.request(app).post('/api/users').send({
                    userName,
                    password: new Array(73).fill('a').join(''),
                    firstName,
                    lastName
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    } 

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Must be at most 72 characters long');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('should reject users with duplicate username', function() {
                return Seller.create({
                    userName,
                    password, 
                    firstName, 
                    lastName
                }).then(() => {
                    chai.request(app).post('/api/users').send({
                        userName, 
                        password, 
                        firstName, 
                        lastName
                    })
                }).then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                }).catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    } 

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Username already taken');
                    expect(res.body.location).to.equal('userName');
                });
            });

            
        })
    })
})
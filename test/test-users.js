'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const {Seller} = require('../users');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('api/user/register', function() {
    const userName = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';
    const userNameB = 'exampleUserB';
    const passwordB = 'examplePassB';
    const firstNameB = 'ExampleB';
    const lastNameB = 'UserB';

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {});
    
    afterEach(function() {
        return Seller.remove({});
    });

    describe('/api/users/register', function() {
        describe('POST', function() {
            it('should reject users with missing userName', function() {
                return chai.request(app).post('/api/users/register').send({
                    password, 
                    firstName, 
                    lastName
                }).then((res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing Field');
                    expect(res.body.location).to.equal('userName')
                }).catch(err => {
                    throw err;
                });
            });

            it('should reject users with missing password', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName, 
                    firstName, 
                    lastName
                }).then((res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing Field');
                    expect(res.body.location).to.equal('password');
                }).catch(err => {
                    throw err;
                });
            });

            it('should reject users with non-string username', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName: 1234,
                    password, 
                    firstName,
                    lastName
                }).then((res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('userName');
                }).catch(err => {
                    throw err;
                }); 
            });

            it('should reject users with non-string password', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName,
                    password: 1234, 
                    firstName,
                    lastName
                }).then((res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('password');
                }).catch(err => {
                    throw err;
                }); 
            });

            it('should reject users with non-string firstname', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName,
                    password, 
                    firstName: 1234,
                    lastName
                }).then((res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('firstName');
                }).catch(err => {
                   throw err;
                }); 
            });

            it('should reject users with non-string lastname', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName,
                    password, 
                    firstName,
                    lastName: 1234
                }).then((res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected string');
                    expect(res.body.location).to.equal('lastName');
                }).catch(err => {
                    throw err;
                    
                }); 
            });

            it('should reject users with non-trimmed username', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName: ` ${userName} `,
                    password,
                    firstName,
                    lastName
                }).then((res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Cannot start or end with whitespace');
                    expect(res.body.location).to.equal('userName');
                }).catch(err => {
                    throw err;       
                });
            });

            it('should reject users with non-trimmed password', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName,
                    password: ` ${password} `,
                    firstName,
                    lastName
                }).then((res) => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal (
                        'Cannot start or end with whitespace'
                    );
                    expect(res.body.location).to.equal('password');
                }).catch(err => {
                    throw err
                });
            });

            it('should reject users with duplicate username', function() {
                return Seller.create({
                    userName,
                    password, 
                    firstName, 
                    lastName
                }).then(() => {
                    return chai.request(app).post('/api/users/register').send({
                        userName, 
                        password, 
                        firstName, 
                        lastName
                    }).then((res) => {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Username already taken');
                        expect(res.body.location).to.equal('userName');
                    }).catch(err => {
                        throw err;
                    })
                }).catch(err => {
                    throw err;
                });
            });

            it('should create a new user', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName, 
                    password, 
                    firstName, 
                    lastName
                }).then(res => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys(
                        'userName',
                        'firstName',
                        'lastName',
                        'password',
                        '_id',
                        '__v'
                    );
                    expect(res.body.userName).to.equal(userName);
                    expect(res.body.firstName).to.equal(firstName);
                    expect(res.body.lastName).to.equal(lastName);
                    return Seller.findOne({
                        userName
                    });
                }).then(user => {
                    expect(user).to.not.be.null;
                    expect(user.firstName).to.equal(firstName);
                    expect(user.lastName).to.equal(lastName);
                    return user.validatePassword(password);
                }).then(correctPassword => {
                    expect(correctPassword).to.be.true;
                });
            });

            it('should trim firstName and lastName', function() {
                return chai.request(app).post('/api/users/register').send({
                    userName, 
                    password, 
                    firstName: ` ${firstName} `, 
                    lastName: ` ${lastName} `
                }).then((res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys(
                        'userName',
                        'firstName',
                        'lastName',
                        'password',
                        '_id',
                        '__v'
                    );
                    expect(res.body.userName).to.equal(userName);
                    expect(res.body.firstName).to.equal(firstName);
                    expect(res.body.lastName).to.equal(lastName);
                    return Seller.findOne({
                        userName
                    });
                }).then(user => {
                    expect(user).to.not.be.null;
                    expect(user.firstName).to.equal(firstName);
                    expect(user.lastName).to.equal(lastName);
                });
            });
        });
    });
});

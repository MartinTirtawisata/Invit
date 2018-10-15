'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker')
const expect = chai.expect;

const {TEST_DATABASE_URL} = require('../config')

const {User} = require('../models')
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

function generateUserData(){
    return {
        userName: faker.lorem.word(),
        password: faker.lorem.word(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
    }
}

function seedUserData(){
    console.log('seeding user data')
    let userDataSeed = [];
    for (let i=0; i<10; i++){
        userDataSeed.push(generateUserData())
    }
    return User.insertMany(userDataSeed);
}

function tearDownDB(){
    console.log('tearing down database')
    return mongoose.connection.dropDatabase();
}

describe("Testing User and Product API resource", function(){
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedUserData()
    });

    afterEach(function(){
        return tearDownDB();
    });

    after(function(){
        return closeServer();
    });
// Users TEST
    describe('GET endpoints for user', function(){
        it('should retrieve user information', function(){
            let res;
            return chai.request(app).get('/api/users').then(_res => {
                res = _res
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.lengthOf.at.least(1);
                return User.countDocuments();
            }).then(function(userCount) {
                expect(res.body).to.have.lengthOf(userCount)
            });
        });
    });
});



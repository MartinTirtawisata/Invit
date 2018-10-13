'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker')
const expect = chai.expect;

const {TEST_DATABASE_URL} = require('../config')

const {Product, Seller} = require('../models')
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

//1) Generate the seed data using faker
function generateSellerData(){
    return {
        userName: faker.lorem.word(),
        password: faker.lorem.word(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
    }
}

//2) Seeding the seller data from the generated seller data
function seedSellerData(){
    console.log('seeding seller data')
    let sellerDataSeed = [];
    for (let i=0; i<10; i++){
        sellerDataSeed.push(generateSellerData())
    }
    return Seller.insertMany(sellerDataSeed);
}

function tearDownDB(){
    console.log('tearing down database')
    return mongoose.connection.dropDatabase();
}

describe("Testing Seller and Product API resource", function(){
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedSellerData()
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
            return chai.request(app).get('/api/sellers').then(_res => {
                res = _res
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.lengthOf.at.least(1);
                return Seller.countDocuments();
            }).then(function(sellerCount) {
                // Checks database for correct length
                expect(res.body).to.have.lengthOf(sellerCount)
            });
        });
    });
});



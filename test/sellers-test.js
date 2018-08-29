'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
//mongoose is imported because we have to run the server here and import that test database here
const mongoose = require('mongoose');
const faker = require('faker')
const expect = chai.expect;

const {Product, Seller} = require('../models')
const {TEST_DATABASE_URL} = require('../config')
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

//1) Generate the seed data using faker
function generateSellerData(){
    return {
        userName: faker.internet.userName(),
        password: faker.lorem.word(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
    }
}

//2) Seeding the seller data from the generated seller data
function seedSellerData(){
    console.log('seeding seller data')
    let seedData = [];

    for (let i=0; i<10; i++){
        seedData.push(generateSellerData())
    }
    
    return Seller.insertMany(seedData);
}

function tearDownDB(){
    console.log('tearing down database')
    return mongoose.connection.dropDatabase();
}


describe("Testing Seller API resource", function(){
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

    describe('GET endpoints for seller', function(){
        it('should retrieve seller information', function(){
            //Test for both the response and the mongoose
            let res;
            return chai.request(app).get('/api/sellers').then(_res => {
                res = _res
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.lengthOf.at.least(1);
    
                //Return - counting the sellers stored in Mongo.
                return Seller.count();
            }).then(function(sellerCount) {
                expect(res.body).to.have.lengthOf(sellerCount)
            });
        });
    });

    describe('POST endpoints for seller', function(){
        //Create a variable so it can be used for comparing with the res. 
        it('should create a new seller', function(){
            const newSellerData = generateSellerData();
            return chai.request(app).post('/api/sellers').send(newSellerData).then(res => {
                // console.log(res.body)
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
                expect(res.body).to.include.keys('_id','userName','password','email','firstName','lastName');
                expect(res.body.userName).to.equal(newSellerData.userName);
                expect(res.body.email).to.equal(newSellerData.email);
                expect(res.body.firstName).to.equal(newSellerData.firstName);
                expect(res.body.lastName).to.equal(newSellerData.lastName);
                expect(res.body.id).to.not.be.null;
                return Seller.findById(res.body._id)
            }).then(seller => {
                expect(seller.userName).to.equal(newSellerData.userName);
                expect(seller.email).to.equal(newSellerData.email);
                expect(seller.firstName).to.equal(newSellerData.firstName);
                expect(seller.lastName).to.equal(newSellerData.lastName);
            });
        });
    });
    
    describe('PUT endpoints for seller', function(){
        it('should update an existing seller data', function(){
            let updateSellerData = {
                userName: 'Martintintut',
                password: 'password'
            }

            Seller.findOne().then(seller => {
                updateSellerData.id = seller._id

                return chai.request(app).put('/api/sellers').send(updateSellerData).then(res => {
                    expect(res).to.have.status(204);
                    expect(res).to.be.json;
                    return Seller.findById(updateSellerData.id)
                }).then(seller => {
                    expect(seller._id).to.equal(updateSellerData.id);
                    expect(seller.userName).to.equal(updateSellerData.userName);
                    expect(seller.password).to.equal(updateSellerData.password);
                });
            });
        });
    });

    describe('DELETE endpoints for seller', function(){
        it('should delete an existing seller data', function(){
            //Delete through ID. Query the ID first then pass it to the endpoint
            Seller.findOne().then(seller => {
                return chai.request(app).delete(`/api/sellers/${seller._id}`).then(res => {
                    expect(res).to.have.status(204);
                    return Seller.findById(seller._id)
                }).then(seller => {
                    expect(seller).to.be.null;
                });
            });
        });
    });
});


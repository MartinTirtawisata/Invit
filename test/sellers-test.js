'use strict'
global.TEST_DATABASE_URL = "mongodb://localhost/test-e-commerce-node-app";

const chai = require('chai');
const chaiHttp = require('chai-http');
//mongoose is imported because we have to run the server here and import that test database here

// const TEST_DATABASE_URL = require('../config');
const mongoose = require('mongoose');
const faker = require('faker')
const expect = chai.expect;

const {Product, Seller} = require('../models')
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
    let sellerDataSeed = [];

    for (let i=0; i<10; i++){
        sellerDataSeed.push(generateSellerData())
    }
    
    return Seller.insertMany(sellerDataSeed);
}

function generateProductData(seller_id){
    return {
        seller: seller_id,
        product_name: faker.lorem.words(),
        product_img: faker.image.fashion(),
        product_desc: faker.lorem.sentence(),
        price: faker.random.number(),
        ceatedAt: faker.date.past()
    }
}

function seedProductData(seller_id){
    console.log('seeding product data');
    let productDataSeed = [];
    for (let i=0; i < 10; i++){
        productDataSeed.push(generateProductData(seller_id));
    }

    return Product.insertMany(productDataSeed);
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
        return seedSellerData().then(seller => {
            // console.log(seller[0]._id)
            let seller_id = seller[0]._id
            return seedProductData(seller_id)
        }).catch(err => {
            // console.error(err)
        })
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
                expect(res.body).to.include.keys('_id','userName','password','firstName','lastName');
                expect(res.body.userName).to.equal(newSellerData.userName);
                expect(res.body.firstName).to.equal(newSellerData.firstName);
                expect(res.body.lastName).to.equal(newSellerData.lastName);
                expect(res.body.id).to.not.be.null;
                return Seller.findById(res.body._id)
            }).then(seller => {
                expect(seller.userName).to.equal(newSellerData.userName);
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
                    // console.log(seller)
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

    //Describe tests for products now
    describe('GET endpoint for products', function(){
        it('should retrieve all items for products', function(){
            let res;
            return chai.request(app).get('/api/products').then(_res => {
                // console.log(_res)
                res = _res
                // console.log(expect(res))
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);
                return Product.count()
            }).then(productCount => {
                expect(res.body).to.have.lengthOf(productCount)
            })
        })
    })

    describe('POST endpoint for products', function(){
        it('should create a new product', function(){
            Seller.findOne().then(seller => {
                console.log(seller._id)
                const newProduct = generateProductData(seller._id);
                return chai.request(app).post('/api/products').send(newProduct).then(res => {
                    // console.log(newProduct)
                    // console.log(res.body)
                    expect(res).to.have.status(201)
                    expect(res).to.be.json;
                    expect(res).to.be.a('object');
                    expect(res.body).to.include.keys(['id','seller','product_name','product_img','product_desc','price']);
                    expect(res.body.product_name).to.equal(newProduct.product_name);
                    expect(res.body.product_desc).to.equal(newProduct.product_desc);
                    expect(res.body.price).to.equal(newProduct.price);
                    expect(res.body.id).to.not.be.null;
                    return Product.findById(res.body._id)
                }).then(product => {
                    expect(product.seller).to.equal(newProduct.seller)
                    expect(product.product_name).to.equal(newProduct.product_name);
                    expect(product.product_desc).to.equal(newProduct.product_desc);
                    expect(product.price).to.equal(newProduct.price);
                })
            }).catch(err => {
                // console.error(err)
            });
        });
    });

    describe('PUT endpoint for products', function(){
        it('should update an existing product data', function(){
            let updateProduct = {
                product_name: 'iPhone',
                price: 15
            }
            Product.findOne().then(product => {
                // console.log(product)
                updateProduct.id = product._id
                return chai.request(app).put(`/api/products`).send(updateProduct).then(res => {
                    // console.log(res);
                    expect(res).to.have.status(204);
                    expect(res).to.be.json;
                    expect(res.body.product_name).to.equal(updateProduct.product_name);
                    expect(res.body.price).to.equal(updateProduct.price);
                    return Product.findById(updateProduct.id)
                }).then(product => {
                    // console.log(product)
                    expect(res.body._id).is.equal(product._id);
                    expect(res.body.product_name).is.equal(product.product_name);
                    expect(res.body.price).is.equal(product.price);
                });
            });
        });
    });

    describe('DELETE endpoint for products', function(){
        it('should delete an existing product and have db = null', function(){
            Product.findOne().then(product => {
                const product_id = product._id
                return chai.request(app).delete(`/api/products/${product_id}`).then(res => {
                    expect(res).to.have.status(204);
                    return Product.findById(product_id)
                }).then(product => {
                    expect(product).to.be.null;
                })
            })
        })
    })
});



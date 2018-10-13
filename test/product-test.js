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

function generateProductData(seller_id){
    return {
        seller: seller_id,
        product_name: faker.lorem.words(),
        product_desc: faker.lorem.sentence(),
        price: faker.random.number(),
    }
}

function seedProductData(){
    console.log('seeding product data');
    let productDataSeed = [];   
    for (let i = 0; i < 10; i++ ) {
        productDataSeed.push(generateProductData());
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
        return seedSellerData().then(() => {
            return seedProductData();
        })
    });

    afterEach(function(){
        return tearDownDB();
    });

    after(function(){
        return closeServer();
    });
    
// Products TEST
    describe('GET endpoint for products', function(){
        it('should retrieve all items for products', function(){
            let res;
            return chai.request(app).get('/api/products').then(_res => {
                res = _res
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);
                return Product.count()
            }).then(productCount => {
                expect(res.body).to.have.lengthOf(productCount)
            });
        });
    });

    describe('POST endpoint for products', function(){
        it('should create a new product', function(){
            Seller.find().then(seller => {
                let seller_id = seller[0]._id;
                let newProduct = {
                    seller: seller_id,
                    product_name: "ExampleProduct",
                    product_desc: "ExampleDesc",
                    price: 1234,
                };
                return chai.request(app).post('/api/products').send(newProduct).then((res) => {
                    expect(res).to.have.status(200)
                    expect(res).to.be.json;
                    expect(res).to.be.a('object');
                    expect(res.body).to.include.keys(['seller','product_name','product_desc','price']);
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
                }).catch(err => {
                    // console.error(err);
                    res.status(400).json({err})
                });
            }).catch(err => {
                // console.error(err);
                res.status(400);
            })
        });
    });

    describe('PUT endpoint for products', function(){
        it('should update an existing product data', function(){

            let updateProduct = {
                product_name: 'iPhone XS MAX',
                price: 15
            }
            Product.findOne().then(product => {
                updateProduct.id = product._id
                return chai.request(app).put(`/api/products`).send(updateProduct).then(res => {
                    expect(res).to.have.status(204);
                    expect(res).to.be.json;
                    expect(res.body.product_name).to.equal(updateProduct.product_name);
                    expect(res.body.price).to.equal(updateProduct.price);
                    return Product.findById(updateProduct.id)
                }).then(product => {
                    expect(res.body._id).is.equal(product._id);
                    expect(res.body.product_name).is.equal(product.product_name);
                    expect(res.body.price).is.equal(product.price);
                }).catch(onRejected => {
                    console.error(onRejected);
                    res.status(400).json(onRejected)
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



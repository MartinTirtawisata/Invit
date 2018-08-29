'use strict'

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const faker = require('faker')

const {Product} = require('../models')

//API endpoint for products

router.get('/products', jsonParser, (req, res) => {
    Product.find().then(products => {
        res.status(200).json(products)
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(500).json({error: "Internal Service Error"})
    })
})

router.get('/product/:id',jsonParser, (req, res) => {
    Product.findOne({_id: req.params.id}).then(product => {
        res.json(product);
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(400).json({message: "something bad happened"})
    });
});

router.post('/products', jsonParser, (req, res) => {
    //Checking for required fields
    const requiredFields = ['seller_id', 'product_name','product_img','product_desc','price']
    requiredFields.forEach(field => {
        if (!(field in req.body)){
            let message = `the ${field} field is missing`
            console.log(message);
            res.status(400).json({error: message});
        }
    })

    //We have to check whether the seller exists to connect it with the product
    Seller.findById(req.body.seller_id).then(seller => {
        if (seller){
            Product.create({
                seller: req.body.seller_id,
                product_name: req.body.product_name,
                product_img: req.body.product_img,
                product_desc: req.body.product_desc,
                price: req.body.price
            }).then(product => {
            res.status(201).json(product);
            }).catch(onRejected => {
            console.error(onRejected);;
            res.status(400).json({error: "Something terrible happened"});
            })
        } else {
            let message = `the seller with the id ${req.body.seller_id} doesn't exist`
            console.log(onRejected);
            res.status(500).json({error: message});
        }
    }).catch(onRejected => {
        console.log(onRejected);
        res.status(500).json({error: "something went wrong"});
    })
})

router.put('/products/:id', jsonParser, (req, res) => {
  
    //If one of the updateable fields are in the req.body. Set it in productUpdate
    const productUpdate = {}
    const updateableField = ['product_name','product_img','product_desc','price']
    updateableField.forEach(item => {
        if (item in req.body){
            productUpdate[item] = req.body[item]
        }
    })

    Product.findByIdAndUpdate(req.params.id, {$set: productUpdate})
    .then(product => {
        res.status(203).json(product).end();
    })
})

router.delete('/products/:id', jsonParser, (req, res)=> {
    Product.findByIdAndRemove(req.params.id).then(product => {
        res.status(204).end();
    }).catch(onRejected => {
        console.log(onRejected)
        res.status(500).json({error: onRejected})
    })
})

module.exports = router;
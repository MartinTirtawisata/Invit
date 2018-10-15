'use strict'

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Product, User} = require('../models')

//GET all users
router.get('/users', jsonParser, (req, res) => {
    User.find().then(user => {
        res.json(user);
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(400).json({message: "something bad happened"})
    });
});

//GET user by id
router.get('/users/:id',jsonParser, (req, res) => {
    User.findOne({_id: req.params.id}).then(user => {
        res.json(user);
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(400).json({message: "something bad happened"})
    });
});

//API endpoint for products --

// GET all products
router.get('/products', jsonParser, (req, res) => {
    Product.find().then(products => {
        res.status(200).json(products)
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(500).json({error: "Internal Service Error"})
    })
})

// GET product by id
router.get('/products/:id',jsonParser, (req, res) => {
    Product.findOne({_id: req.params.id}).then(product => {
        res.json(product);
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(400).json({message: "something bad happened"})
    });
});

// POST products
router.post('/products', jsonParser, (req, res) => {
    const requiredFields = ['user', 'product_name','product_desc','price']
    requiredFields.forEach(field => {
        if (!(field in req.body)){
            let message = `the ${field} field is missing`
            console.log(message);
            res.status(400).json({error: message});
        }
    })

    User.findById(req.body.user).then(user => {
        if (user){
            Product.create({
                user: req.body.user,
                product_name: req.body.product_name,
                product_desc: req.body.product_desc,
                price: req.body.price
            }).then(function(product) {
                res.status(200).json(product);
            })
        } else {
            let message = `the user with the id ${req.body.user} doesn't exist`
            res.status(500).json({error: message});
        }
    }).catch(onRejected => {
        console.log(onRejected);
        res.status(500).json({error: "something went wrong"});
    })
})

// PUT products
router.put('/products/:id', jsonParser, (req, res) => {
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

// DELETE products
router.delete('/products/:id', jsonParser, (req, res)=> {
    Product.findByIdAndRemove(req.params.id).then(product => {
        res.status(204).end();
    }).catch(onRejected => {
        console.log(onRejected)
        res.status(500).json({error: onRejected})
    })
})

module.exports = router;
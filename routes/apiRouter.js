'use strict'

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Product, Seller} = require('../models')

//GET all sellers
router.get('/sellers', jsonParser, (req, res) => {
    Seller.find().then(sellers => {
        res.json(sellers);
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(400).json({message: "something bad happened"})
    });
});

//GET seller by id
router.get('/sellers/:id',jsonParser, (req, res) => {
    Seller.findOne({_id: req.params.id}).then(seller => {
        res.json(seller);
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(400).json({message: "something bad happened"})
    });
});

// PUT seller
router.put('/sellers/:id', jsonParser, (req, res) => {
    if (req.params.id !== req.body._id){
        let message = `The param id ${req.params.id} and body id ${req.body._id} does not match`
        console.error(message);
        res.status(400).json({error: message});
    }

    //Check for existing username
    Seller.findOne({userName: req.body.userName}).then(seller => {
        if (seller){
            let message = `The username ${req.body.userName} has been taken`
            console.error(message);
            res.status(400).json({error: message});
        } else {
            Seller.findByIdAndUpdate(req.params.id, {$set: {
                _id: req.params.id,
                userName: req.body.userName,
                password: req.body.password,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }}).then(seller => {
                    res.status(203).json({success: `the ${seller} has been updated`}).end()
            }).catch(onRejected => {
                    console.error(onRejected);
                    res.status(500).json({error: onRejected})
            })
        };
    });   
});

// DELETE seller
router.delete('/sellers/:id', jsonParser, (req, res)=> {
    Seller.findByIdAndRemove(req.params.id).then(seller => {
        res.status(204).end();
    }).catch(onRejected => {
        console.log(onRejected)
        res.status(500).json({error: onRejected})
    })
})

//API endpoint for products --
// GET all products
router.get('/products', jsonParser, (req, res) => {
    // add product.find({seller:sellerID})
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
    //Checking for required fields[keys]
    const requiredFields = ['seller', 'product_name','product_desc','price']
    requiredFields.forEach(field => {
        if (!(field in req.body)){
            let message = `the ${field} field is missing`
            console.log(message);
            res.status(400).json({error: message});
        }
    })

    Seller.findById(req.body.seller).then(seller => {
        console.log(seller);
        if (seller){
            Product.create({
                seller: req.body.seller,
                product_name: req.body.product_name,
                product_desc: req.body.product_desc,
                price: req.body.price
            }).then(function(product) {
                res.status(200).json(product);
            })
        } else {
            let message = `the seller with the id ${req.body.seller} doesn't exist`
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
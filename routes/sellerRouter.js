'use strict'

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const faker = require('faker')

const {Product, Seller} = require('../models')

//We get all of the products the seller put on the listing
router.get('/sellers',jsonParser, (req, res) => {
    Seller.find().then(sellers => {
        res.json(sellers);
        
        // console.log(faker.lorem.word())

    }).catch(onRejected => {
        console.error(onRejected);
        res.status(400).json({message: "something bad happened"})
    });
});

router.get('/sellers/:id',jsonParser, (req, res) => {
    Seller.findOne({_id: req.params.id}).then(seller => {
        res.json(seller);
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(400).json({message: "something bad happened"})
    });
});

router.post('/sellers',jsonParser, (req, res) => {
    //Checking for the required fields in the keys
    const requiredFields = ['userName','password','email','firstName','lastName']
    requiredFields.forEach(field => {
        if (!(field in req.body)){
            let message = `the ${field} field is missing`
            console.error(message);
            res.status(500).json({error: message});
        }
    });
    //Check to make sure the username is not taken
    Seller.findOne({userName: req.body.userName}).then(seller => {
        if (seller){
            let message = `the ${seller.userName} username has been taken. Choose another one`
            res.status(400).json({error: message});
        } else{
            Seller.create({
                userName: req.body.userName,
                password: req.body.password,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }).then(seller => {
                res.status(201).json(seller)
            }).catch(err => {
                res.status(500).json({message: err});
            })
        }
    }).catch(onRejected => {
        console.error(onRejected);
        res.status(500).json({error: "Something wrong happened"})
    })
});

router.put('/sellers/:id', jsonParser, (req, res) => {
    //This cross checks that the parameter ID is equal to the req.body ID so that we are updating the correct one
    if (req.params.id !== req.body._id){
        let message = `The param id ${req.params.id} and body id ${req.body._id} does not match`
        console.error(message);
        res.status(400).json({error: message});
    }

    //We are now again checking for existing usernames
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

router.delete('/sellers/:id', jsonParser, (req, res)=> {
    Seller.findByIdAndRemove(req.params.id).then(seller => {
        res.status(204).end();
    }).catch(onRejected => {
        console.log(onRejected)
        res.status(500).json({error: onRejected})
    })
})

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
    //Checking for required fields[keys]
    const requiredFields = ['seller', 'product_name','product_img','product_desc','price']
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
                seller: req.body.seller,
                product_name: req.body.product_name,
                product_img: req.body.product_img,
                product_desc: req.body.product_desc,
                price: req.body.price
            }).then(product => {
            res.status(201).json(product);
            }).catch(onRejected => {
            // console.error(onRejected);;
            res.status(400).json({error: "Something terrible happened"});
            })
        } else {
            let message = `the seller with the id ${req.body.seller} doesn't exist`
            res.status(500).json({error: message});
        }
    }).catch(onRejected => {
        // console.log(onRejected);
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
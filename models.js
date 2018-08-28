'use strict'
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let sellerSchema = mongoose.Schema({
    userName: {
        type: 'string',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
        required: true,
        unique: true
    },
    firstName: 'string',
    lastName: 'string',
    
});

sellerSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password)
};

sellerSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

// let imageSchema = mongoose.Schema({img: 'string'});

let productSchema = mongoose.Schema({
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller'},
    product_name: 'string',
    product_img: 'string',
    product_desc: 'string',
    price: 'number',
    createdAt: {type: Date, default: Date.now}
    
})

productSchema.pre('find', function(next){
    this.populate('seller');
    next();
});

productSchema.pre('findOne', function(next){
    this.populate('seller');
    next();
});

productSchema.virtual('sellerName').get(function(){
    return `${this.seller.firstName} ${this.seller.lastName}`
});

productSchema.methods.serialize = function(){
    return {
        id: this._id,
        seller: this.sellerName,
        product_name: this.product_name,
        product_desc: this.product_desc
    };
};



const Seller = mongoose.model('Seller', sellerSchema);
const Product = mongoose.model('Product', productSchema);

module.exports = {Seller, Product}



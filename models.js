'use strict'
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// sellerSchema
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
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    
});

sellerSchema.methods.serialize = function() {
    return {
        userName: this.userName || '',
        firstName: this.firstName || '',
        lastName: this.lastName || ''
    };
;}

sellerSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password)
};

sellerSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

// Product Schema
let imageSchema = mongoose.Schema({img: 'string'});

let productSchema = mongoose.Schema({
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller'},
    product_name: 'string',
    product_img: [imageSchema],
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
        product_desc: this.product_desc,
        // product_img: this.product_img
    };
};



const Seller = mongoose.model('Seller', sellerSchema);
const Product = mongoose.model('Product', productSchema);

module.exports = {Seller, Product}



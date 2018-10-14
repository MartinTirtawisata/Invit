'use strict'
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// userSchema
let userSchema = mongoose.Schema({
    userName: {
        type: 'string',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true,
    },
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    
});

userSchema.methods.serialize = function() {
    return {
        userName: this.userName || '',
        firstName: this.firstName || '',
        lastName: this.lastName || ''
    };
;}

userSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password)
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

// Product Schema
let productSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    product_name: 'string',
    product_desc: 'string',
    price: 'number',
    createdAt: {type: Date, default: Date.now}
})

productSchema.pre('find', function(next){
    this.populate('user');
    next();
});

productSchema.pre('findOne', function(next){
    this.populate('user');
    next();
});

productSchema.virtual('username').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`
});

productSchema.methods.serialize = function(){
    return {
        id: this._id,
        user: this.username,
        product_name: this.product_name,
        product_desc: this.product_desc,
    };
};



const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

module.exports = {User, Product}



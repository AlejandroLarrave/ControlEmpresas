'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productsSchema = Schema({
    name: String,
    price: String,
    category: String,
    quantity: []
});

module.exports = mongoose.model('products', productsSchema);
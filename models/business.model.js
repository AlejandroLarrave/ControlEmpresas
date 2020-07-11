'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var businessSchema = Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    address: String,
    phone: Number,
    role: String,
    employees: [{type: Schema.Types.ObjectId, ref: 'employees'}],
    branchOffice: [{type: Schema.Types.ObjectId, ref: 'branchOffice'}],
    products: [{type: Schema.Types.ObjectId, ref: 'products'}]
});

module.exports = mongoose.model('business', businessSchema); 
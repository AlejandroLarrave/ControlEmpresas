'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var branchOfficeSchema = Schema({
    name: String,
    carer: String,
    address: String,
    phone: Number,
    products: [{type: Schema.Types.ObjectId, ref: 'products'}]
});

module.exports = mongoose.model('branchOffice', branchOfficeSchema);


'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeesSchema = Schema({
    name: String,
    position: String,
    departament: String,
    phone: Number,
    business: {type: Schema.Types.ObjectId, ref: 'business'}
});

module.exports = mongoose.model('employees', employeesSchema);
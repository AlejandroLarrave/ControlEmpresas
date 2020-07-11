'use strict'

var express = require('express');
var productsController = require('../controllers/products.controller');
var api = express.Router();

api.post('/saveProducts', productsController.saveProducts);
api.put('/updateProducts/:id', productsController.updateProducts);
api.delete('/deleteProducts/:id', productsController.deleteProducts);
api.put('/setQuantity/:id', productsController.setQuantity);

module.exports = api;
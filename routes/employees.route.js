'use strict'

var express = require('express');
var employeeController = require('../controllers/employees.controller');
var api = express.Router();

api.post('/saveEmployee', employeeController.saveEmployee);
api.delete('/deleteEmployee/:id', employeeController.deleteEmployee);
api.put('/updateEmployees/:id', employeeController.updateEmployees);


module.exports = api;  
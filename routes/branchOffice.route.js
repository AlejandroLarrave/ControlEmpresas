'use strict'

var express = require('express');
var branchOfficeController = require('../controllers/branchOffice.controller');
var api = express.Router();

api.post('/saveBranchOffice', branchOfficeController.saveBranchOffice);
api.put('/updateBranchOffice/:id', branchOfficeController.updateBranchOffice);
api.delete('/deleteBranchOffice/:id', branchOfficeController.deleteBranchOffice);
api.get('/listBranchOffice', branchOfficeController.listBranchOffice);
api.put('/setProductsToBranchOffice/:idB/:idBO/:idP', branchOfficeController.setProductsToBranchOffice); 

module.exports = api;

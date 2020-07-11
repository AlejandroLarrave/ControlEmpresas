'use strict'

var express = require('express');
var businessController = require('../controllers/business.controller');
var api = express.Router();
var middlewareAuth = require('../middlewares/authenticated');

api.get('/prueba', businessController.prueba);
api.post('/saveBusiness', businessController.saveBusiness);
api.post('/login', businessController.login);
api.put('/updateBusiness/:id', middlewareAuth.ensureAuth, businessController.updateBusiness);
api.delete('/deleteBusiness/:id', middlewareAuth.ensureAuth, businessController.deleteBusiness);
//------------------EMPLEADOS------------------------------------------------------
api.put('/:id/setEmployee', middlewareAuth.ensureAuth, businessController.setEmployee);
api.put('/:idB/updateEmployee/:idE', middlewareAuth.ensureAuth, businessController.updateEmployee);
api.delete('/removeEmployee/:idB/:idE', middlewareAuth.ensureAuth,businessController.removeEmployee);
api.get('/employeesAmount/:id', middlewareAuth.ensureAuth,businessController.employeesAmount);
api.get('/SearchEmployee', middlewareAuth.ensureAuth, businessController.SearchEmployee);
api.get('/listBusiness', businessController.listBusiness);
// ------------------- SUCURSALES -----------------------------------------------------
api.put('/:id/setBranchOffice', middlewareAuth.ensureAuth, businessController.setBranchOffice);
api.put('/:idB/updateBranchOffice/:idBO', middlewareAuth.ensureAuth, businessController.updateBranchOffice);
api.delete('/removeBranchOffice/:idB/:idBO', middlewareAuth.ensureAuth, businessController.removeBranchOffice);
// --------------------------PRODUCTOS---------------------------------------------
api.put('/:id/setProducts', middlewareAuth.ensureAuth, businessController.setProducts); 
api.put('/:idB/updateProducts/:idP', middlewareAuth.ensureAuth, businessController.updateProducts);
api.delete('/removeProducts/:idB/:idP', middlewareAuth.ensureAuth, businessController.removeProducts);
// ------------------------------- FUNCIONES ---------------------------------------------------
api.get('/productsForBusinessAmount/:id', middlewareAuth.ensureAuth, businessController.productsForBusinessAmount);
api.get('/productsForBranchOfficeAmount/:id', middlewareAuth.ensureAuth, businessController.productsForBranchOfficeAmount);
api.get('/searchNameForBusiness/:id', middlewareAuth.ensureAuth, businessController.searchNameForBusiness);
api.get('/searchNameForBranchOffice/:id', middlewareAuth.ensureAuth, businessController.searchNameForBranchOffice);
api.get('/quantityForBusiness/:id', middlewareAuth.ensureAuth, businessController.quantityForBusiness);

api.get('/searchQuantity/:id', businessController.searchQuantity);
api.get('/listBranchOffice/:id', businessController.listBranchOffice);

module.exports = api;
 
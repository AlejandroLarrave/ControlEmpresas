'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var businessRoutes = require('./routes/business.routes');
var employeesRoutes = require('./routes/employees.route');
var branchOfficeRoutes = require('./routes/branchOffice.route');
var products = require('./routes/products.route');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/business', businessRoutes);
app.use('/employees', employeesRoutes);
app.use('/branchOffices', branchOfficeRoutes);
app.use('/products', products);

module.exports = app;
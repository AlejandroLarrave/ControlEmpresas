'use strict'

var Products = require('../models/products.model');

function saveProducts(req,res){
    var products = Products();
    var params = req.body;

    if( params.name &&
        params.price &&
        params.category){

            Products.findOne({name: params.name}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(productFind){
                    res.status(200).send({message: 'El nombre ya existe, ve a revisarlo'});
                }else{
                    products.name = params.name;
                    products.price = params.price;
                    products.category = params.category;

                    products.save((err, productSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        }else if(productSaved){
                            res.status(200).send({productSaved});
                        }else{
                            res.status(200).send({message: 'Error al guardarlo'});
                        }
                    });
                }
            })
        }else{
            res.status(200).send({message: 'Por favor ingresa todos los datos'});
        }
}

function updateProducts(req, res){
    let productId = req.params.id;
    let update = req.body;

    Products.findByIdAndUpdate(productId, update, {new: true}, (err, productsUpdate)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else{
            if(productsUpdate){
                res.status(200).send({productsUpdate: productsUpdate});
            }else{
                res.status(200).send({message: 'Error al actualizar'});
            }
        }
    })
}

function deleteProducts(req, res){
    var productId = req.params.id;

    Products.findByIdAndRemove(productId, (err, productDelete)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(productDelete){
            res.status(200).send({message: 'Producto eliminado'});
        }else{
            res.status(404).send({message: 'Error al eliminar'});
        }
    })
}

function setQuantity(req, res){
    let productId = req.params.id;
    let params = req.body;

        if(params.quantity){
            Products.findById(productId, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(productFind){
                    
                    Products.findByIdAndUpdate(productId, {$push: {quantity: new Number(params.quantity)}}, {new: true}, (err, productsUpdate)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        }else if(productsUpdate){
                            res.status(200).send({productsUpdate: productsUpdate});
                        }else{
                            res.status(418).send({message: 'Error al actualizar'});
                        }
                    })
                }else{
                    res.status(404).send({message: 'Producto no encontrado'});
                }
            })
        }else{
            res.status(200).send({message: 'No está ingresando la cantidad'});
        }
}

module.exports = {
    saveProducts,
    updateProducts,
    deleteProducts,
    setQuantity
}
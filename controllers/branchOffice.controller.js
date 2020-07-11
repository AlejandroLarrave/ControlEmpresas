'use strict'

var BranchOffice = require('../models/branchOffice.model');
var Business = require('../models/business.model');
var Products = require('../models/products.model');


function saveBranchOffice(req, res){
    var branchOffice = BranchOffice();
    var params = req.body;

    if( params.name &&
        params.carer &&
        params.address &&  
        params.phone){

            BranchOffice.findOne({$or:[{name: params.name},{carer: params.carer},
                                {address: params.address}, {phone: params.phone}]}, (err, branchOfficeFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general'});
                                    }else if(branchOfficeFind){
                                        res.status(200).send({message: 'Alguno de los campos se está repitiendo'});
                                    }else{
                                        branchOffice.name = params.name;
                                        branchOffice.carer = params.carer;
                                        branchOffice.address = params.address;
                                        branchOffice.phone = params.phone;

                                    branchOffice.save((err, branchOfficeSaved)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error general'});
                                        }else if(branchOfficeSaved){
                                            res.status(200).send({branchOfficeSaved});
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

function listBranchOffice(req, res){
    BranchOffice.find({}).exec((err, branchOffice)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(branchOffice){
                res.status(200).send({branchOffice: branchOffice});
            }else{
                res.status(200).send({message: 'No se obtuvieron datos'});
            }
        }
    });
}

function updateBranchOffice(req, res){
    let branchOfficeId = req.params.id;
    let update = req.body;

    BranchOffice.findByIdAndUpdate(branchOfficeId, update, {new: true}, (err, branchOfficeUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(branchOfficeUpdated){
                res.status(200).send({branchOfficeUpdated: branchOfficeUpdated});
            }else{
                res.status(200).send({message: 'Error al actualizar'});
            }
        }
    })
}

function deleteBranchOffice(req, res){
    var branchOfficeId = req.params.id;

    BranchOffice.findByIdAndRemove(branchOfficeId, (err, branchOfficeDelete)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(branchOfficeDelete){
            res.status(200).send({message: 'Sucursal eliminada'});
        }else{
            res.status(404).send({message: 'Error al eliminar'});
        }
    })
}


//  ---------------------------------------PRODUCTOS-------------------------------------------------------

function setProductsToBranchOffice(req, res){
    let businessId = req.params.idB;
    let branchOfficeId = req.params.idBO;
    let productsId = req.params.idP;
    let params = req.body;


    Products.findById({idProducts: params.idProducts}, (err, productsFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
                console.log(err);
            }else if(productsFind){
                res.status(200).send({message: 'El producto ya está seteado'});
            }else{
                if(params.idProducts){
                    Products.findById(productsId, (err, productsFind)=>{
                        if(err){
                            res.status(500).send({message: 'Error general Producto'});
                            console.log(err);
                        }else if(productsFind){
                            BranchOffice.findById(branchOfficeId, (err, branchOfficeFind)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general Sucursal'});
                                    console.log(err);
                                }else if(branchOfficeFind){
                                    Business.findById(businessId, (err, businessFind)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error general Empresa'});
                                        }else if(businessFind){
                                            Business.findOne({_id:businessId,'branchOffices._id':branchOfficeId});
                                            BranchOffice.findByIdAndUpdate(branchOfficeId, {$push: {products: params.idProducts}},
                                                {new: true}, (err, branchOfficeUpdated)=>{
                                                    if(err){
                                                        res.status(500).send({message: 'Error general Empresa 2'});
                                                    }else if(branchOfficeUpdated){
                                                        res.status(200).send({branchOfficeUpdated: branchOfficeUpdated});
                                                    }else{
                                                        res.status(418).send({message: 'Error al actualizar'});
                                                    }
                                                }).populate('products');
            
                                        }else{
                                            res.status(404).send({message: 'Empresa no encontrado'});
                                        }
                                    })
                                }else{
                                    res.status(404).send({message: 'Sucursal no encontrada'});
                                }
                            })
                        }else{
                            res.status(404).send({message: 'Producto no encontrada'});
                        }
                    })
                
                }else{
                    res.status(200).send({message: 'Faltan datos'});
            }
        }
    })
}


module.exports = {
    saveBranchOffice,
    updateBranchOffice,
    deleteBranchOffice,
    listBranchOffice,
    setProductsToBranchOffice
}
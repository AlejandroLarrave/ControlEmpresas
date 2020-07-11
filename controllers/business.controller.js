'use strict'

var Business = require('../models/business.model');
var Employee = require('../models/employees.model');
var BranchOffice = require('../models/branchOffice.model');
var Products = require('../models/products.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function prueba(req, res){
    res.status(200).send({message: 'Ruta de prueba'})
}

function saveBusiness(req, res){
    var params = req.body;
    var business = Business();

    if( params.name &&
        params.username &&
        params.email &&
        params.password &&
        params.address &&
        params.phone){
            Business.findOne({$or:[{name: params.name},{username: params.username},
                                {email: params.email},{password: params.password},
                                {address: params.address}, {phone: params.phone}]}, (err, businessFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general'});
                                    }else if(businessFind){
                                        res.send({message: 'Uno de los campos ya existe en otra empresa, pruebe cambiarlos'});
                                    }else{
                                        business.name = params.name;
                                        business.username = params.username;
                                        business.email = params.email;
                                        business.password = params.password;
                                        business.address = params.address;
                                        business.phone = params.phone;
                                        business.role = 'ADMIN';

                                    bcrypt.hash(params.password, null, null, (err, hashPassword)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error al encriptar contraseña'});
                                        }else{
                                            business.password = hashPassword;

                                    business.save((err, businessSaved)=>{
                                                if(err){
                                                    res.status(500).send({message: 'Error al guardar empresa', err});
                                                }else if(businessSaved){
                                                        res.status(200).send({businessSaved});
                                                }else{
                                                    res.status(200).send({message: 'Error al guardarlo'})
                                                }
                                            });
                                        }
                                    });
                                }
                            });
        }else{
            res.send({message: 'Ingrese todos los datos'});
        }
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            Business.findOne({$or:[{username: params.username},{email: params.email}]},(err, businessFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(businessFind){
                    bcrypt.compare(params.password, businessFind.password, (err, checkPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error al comparar contraseñas'});
                        }else if(checkPassword){
                            if(params.gettoken){
                                res.send({token: jwt.createToken(businessFind)});
                            }else{
                                jwt.createToken(businessFind)
                                res.send({business: businessFind});
                            }
                        }else{
                            res.status(418).send({message: 'Contraseña incorrecta'});
                        }
                    });
                }else{
                    res.send({message: 'Empresa no encontrada'});
                }
            });
        }else{
            res.send({message: 'Por favor ingrese la contraseña'});
        }
    }else{
        res.send({message: 'Ingrese el nombre de usuario o email'});
    }
}

function updateBusiness(req, res){
    let businessId = req.params.id;
    let update = req.body;

    if(businessId != req.business.sub){
        res.status(403).send({message: 'Error de permisos, empresa no logeada'});
    }else{
        Business.findByIdAndUpdate(businessId, update, {new: true}, (err, businessUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }else{
                if(businessUpdated){
                    res.status(200).send({businessUpdated: businessUpdated});
                }else{
                    res.status(200).send({message: 'Error al actualizar'});
                }
            }
        })
    }
}

function deleteBusiness(req, res){
    var businessId = req.params.id;

    if(businessId != req.business.sub){
        res.status(403).send({message: 'Error de permisos, empresa no logeada'});
    }else{
    Business.findByIdAndRemove(businessId, (err, businessDelete)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(businessDelete){
            res.status(200).send({message: 'Empresa eliminada'});
        }else{
            res.status(404).send({message: 'Error al eliminar'});
        }
    }).populate('employees');
}
}

function listBusiness(req, res){
    Business.find({}).exec((err, business)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(business){
                res.status(200).send({business: business});
            }else{
                res.status(200).send({message: 'No se obtuvieron datos'});
            }
        }
    });
}
// ---------------------------------------------------- EMPLEADOS ------------------------------------------------------------------------------
function setEmployee(req, res){
    let businessId = req.params.id;
    let params = req.body;

    if(businessId != req.business.sub){
        res.status(403).send({message: 'Error de permisos, empresa no logeada'});
    }else{
    if( params.idEmployee){
        Business.findById(businessId, (err, businessFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'}); 
            }else if(businessFind){ 

                Business.findByIdAndUpdate(businessId, {$push: {employees: params.idEmployee}}, {new: true}, (err, businessUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                        console.log(err)
                    }else if(businessUpdated){
                        res.status(200).send({businessUpdated: businessUpdated});
                    }else{
                        res.status(418).send({message: 'Error al actualizar'});
                    }
                }).populate('employees');
            }else{
                res.status(404).send({message: 'Empresa no encontrada'});
            }
        })
    }else{
        res.status(200).send({message: 'Faltan datos'});
    }
}
}

//Business
/*function updateEmployee(req, res){
    let businessId = req.params.idB;
    let employeeId = req.params.idE;
    let params = req.body;

    Business.findById(businessId, (err, businessOk)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
            console.log(err)
        }else if(businessOk){
            Business.findOneAndUpdate({_id:businessId, "employees._id": employeeId},
            {   "employees.$.name": params.name,
                "employees.$.position": params.position,
                "employees.$.departament": params.departament,
                "employees.$.phone": params.phone}, {new:true}, (err, businessUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                        console.log(err)
                    }else if(businessUpdated){ 
                        res.send({business: businessUpdated});
                    }else{
                        res.status(418).send({message: 'No se actualizo el empleado'});
                        console.log(err)
                    }
                }
            );
        }else{
            res.status(418).send({message: 'No existe el empleado'});
        }
    }).populate('employees')  
} */

function updateEmployee(req,res){

    var idBusiness = req.params.idB;
    var idEmployee = req.params.idE;
    var update = req.body;

    Business.findById(idBusiness,(err, BusinessFound)=>{
        if(err){
            res.status(500).send({message:'Error interno del servidor.'});
            console.log(err);
        }else if(BusinessFound){
           Employee.findByIdAndUpdate(idEmployee,update,(err,employeeUpdated)=>{
               if(err){
                   res.status(500).send({message:'Error interno del servidor.'});
                   console.log(err);
               }else if(employeeUpdated){
                    Business.findByIdAndUpdate({_id:idBusiness,'employees._id':idEmployee},
                    {$set:{employee:idEmployee}},{new:true}, (err,employeeUpdated)=>{
                        if(err){
                            res.status(500).send({message:'Error interno del servidor.'});
                            console.log(err);
                        }else if(employeeUpdated){
                         
                        }else{
                            res.status(418).send({message: 'Error al actualizar empleado.'});
                        }
                    });
                    res.send({'Empleado Actualizado':employeeUpdated});
               }
           });
        }else{
            res.send({message:'ID de empresa incorrecto, o la empresa no existe.'});
        }
    });  
}

function removeEmployee(req,res){
    var idBusiness = req.params.idB;
    var idEmployee = req.params.idE;
    
    Business.findById(idBusiness,(err,BusinessFound)=>{
        if(err){
            res.status(500).send({message:'Error general'});
            console.log(err);
        }else if(BusinessFound){
            Employee.findByIdAndDelete(idEmployee,(err,employeeDeleted)=>{
                if(err){
                    res.status(500).send({message:'Error general'});
                    console.log(err);
                }else if(employeeDeleted){
                    Business.findByIdAndUpdate({_id:idBusiness,"employees._id":idEmployee},{$inc:{nEmployees:-1},$pull:{employees:employeeDeleted._id}},{new:true}, (err,employeeDeleted)=>{
                        if(err){
                            res.status(500).send({message:'Error general'});
                            console.log(err);
                        }else if(employeeDeleted){
                           
                        }else{
                            res.status(418).send({message: 'Error al eliminar'});
                        }
                    });
                    
                    res.send({'Empleado eliminado':employeeDeleted});

                }else{
                    res.status(418).send({message:'Empleado no eliminado'});
                }
            });
        }else{
            res.send({message:'ID de empresa incorrecto, o la empresa no existe'});
        }
    });
}

function employeesAmount(req, res) {
    var businessId = req.params.id;
    Business.findById(businessId, (err, business) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (business) {
            res.send({Business: business.name, Employees: business.employees.length});
        } else {
            res.send({message: 'No se encontro ninguna compañia'});
        }
    });
}

function SearchEmployee(req, res){
    var txt = req.body.search;
    
        Employee.find({$or:[{id: {$regex: txt,$options:'i'}}, 
            {name: {$regex: txt,$options:'i'}}, 
            {position: {$regex: txt,$options:'i'}}, 
            {departament: {$regex: txt,$options:'i'}}]}, (err, SearchEmployee)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else{
            if(SearchEmployee){
                res.status(200).send({SearchEmployee: SearchEmployee});
            }else{
                res.status(200).send({message: 'No hay registros'})
            }
        }
    })  
}

// -------------------------------------------------------------- SUCURSALES ---------------------------------------------------------------------

function setBranchOffice(req, res){
    let businessId = req.params.id;
    let params = req.body;

    if(businessId != req.business.sub){
        res.status(403).send({message: 'Error de permisos, empresa no logeada'});
    }else{
        if(params.idBranchOffice){
            Business.findById(businessId, (err, businessFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(businessFind){

                    Business.findByIdAndUpdate(businessId, {$push: {branchOffice: params.idBranchOffice}},
                        {new: true}, (err, businessUpdated)=>{
                            if(err){
                                res.status(500).send({message: 'Error general'});
                            }else if(businessUpdated){
                                res.status(200).send({businessUpdated: businessUpdated});
                            }else{
                                res.status(418).send({message: 'Error al actualizar'});
                            }
                        }).populate('branchOffice');
                }else{
                    res.status(404).send({message: 'Empresa no encontrada'});
                }
            })
        }else{
            res.status(200).send({message: 'Faltan datos'});
        }
    }
}

function updateBranchOffice(req, res){
    var idBusiness = req.params.idB;
    var idBranchOffice = req.params.idBO;
    var update = req.body;

    Business.findById(idBusiness, (err, BusinessFound)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(BusinessFound){
            BranchOffice.findByIdAndUpdate(idBranchOffice, update, (err, branchOfficeUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error general 2'});
                }else if(branchOfficeUpdated){
                    Business.findByIdAndUpdate({_id:idBusiness, 'branchOffice._id':idBranchOffice},
                    {$set:{branchOffice:idBranchOffice}},{new: true}, (err, branchOfficeUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        }else if(branchOfficeUpdated){

                        }else{
                            res.status(418).send({message: 'Error al actualizar la Sucursal'});
                        }
                    });
                    res.send({'Sucursal Actualizada': branchOfficeUpdated});
                }
            })
        }else{
            res.send({message: 'ID de empresa incorrecto, o la empresa no existe'});
        }
    });
}
// ----------------ARREGLAR; ENCONTRAR ERROR------------------------
function removeBranchOffice(req,res){
    var idBusiness = req.params.idB;
    var idBranchOffice = req.params.idBO;
    
    Business.findById(idBusiness,(err,BusinessFound)=>{
        if(err){
            res.status(500).send({message:'Error general'});
        }else if(BusinessFound){
            BranchOffice.findByIdAndDelete(idBranchOffice,(err,branchOfficeDeleted)=>{
                if(err){
                    res.status(500).send({message:'Error general'});
                }else if(branchOfficeDeleted){
                    Business.findByIdAndUpdate({_id:idBusiness,"branchOffices._id":idBranchOffice},{$inc:{nBranchOffice:-1},
                    $pull:{branchOffices:branchOfficeDeleted._id}},{new:true}, (err,branchOfficeDeleted)=>{
                        if(err){
                            res.status(500).send({message:'Error general'});
                            console.log(err);
                        }else if(branchOfficeDeleted){
                           
                        }else{
                            res.status(418).send({message: 'Error al eliminar'});
                        }
                    });                   
                    res.send({'Sucursal eliminada':branchOfficeDeleted});

                }else{
                    res.status(418).send({message:'Sucursal no eliminada'});
                    console.log(err); 
                }
            });
        }else{
            res.send({message:'ID de empresa incorrecto, o la empresa no existe'});
        }
    });
}


//-----------------------------------------------PRODUCTOS--------------------------------------------------------- 
function setProducts(req, res){
    let businessId = req.params.id;
    let params = req.body;

    if(businessId != req.business.sub){
        res.status(403).send({message: 'Inicie sesión'});
    }else{

        
        if(params.idProducts){
            
            Business.findById(businessId, (err, businessFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(businessFind){
                    Business.findByIdAndUpdate(businessId, {$push: {products: params.idProducts}},
                        {new: true}, (err, businessUpdated)=>{
                            if(err){
                                res.status(500).send({message: 'Error general'});
                            }else if(businessUpdated){
                                res.status(200).send({businessUpdated: businessUpdated});
                            }else{
                                res.status(418).send({message: 'Error al actualizar'});
                            } 
                        }).populate('products');
                }else{
                    res.status(404).send({message: 'Empresa no encontrada'});
                }
            })
        }else{
            res.status(200).send({message: 'Faltan datos'});
        }
    }
}

function updateProducts(req, res){
    var idBusiness = req.params.idB;
    var idProducts = req.params.idP;
    var update = req.body;

    Business.findById(idBusiness, (err, BusinessFound)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(BusinessFound){
            Products.findByIdAndUpdate(idProducts, update, (err, productsUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error general 2'});
                }else if(productsUpdated){
                    Business.findByIdAndUpdate({_id:idBusiness, 'products._id':idProducts},
                    {$set:{products:idProducts}},{new: true}, (err, productsUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general 3'});
                        }else if(productsUpdated){

                        }else{
                            res.status(418).send({message: 'Error al actualizar Producto'});
                        }
                    });
                    res.send({'Producto Actualizado': productsUpdated});
                }
            })
        }else{
            res.send({message: 'ID de la empresa incorrecto o la empresa no existe'});
        }
    })
}

function removeProducts(req,res){
    var idBusiness = req.params.idB;
    var idProducts = req.params.idP;
    
    Business.findById(idBusiness,(err,BusinessFound)=>{
        if(err){
            res.status(500).send({message:'Error general'});
            console.log(err);
        }else if(BusinessFound){
            Products.findByIdAndDelete(idProducts,(err, productsDeleted)=>{
                if(err){
                    res.status(500).send({message:'Error general'});
                    console.log(err);
                }else if(productsDeleted){
                    Business.findByIdAndUpdate({_id:idBusiness,"products._id":idProducts},{$inc:{nProducts:-1},$pull:{products:productsDeleted._id}},{new:true}, (err,productsDeleted)=>{
                        if(err){
                            res.status(500).send({message:'Error general'});
                            console.log(err);
                        }else if(productsDeleted){
                           
                        }else{
                            res.status(418).send({message: 'Error al eliminar'});
                        }
                    });
                    
                    res.send({'Producto eliminado':productsDeleted});

                }else{
                    res.status(418).send({message:'Producto no eliminado'});
                }
            });
        }else{
            res.send({message:'ID de empresa incorrecto, o la empresa no existe'});
        }
    });
}

// ---------------------------------------------Búsqueda de Productos---------------------------------------------------------------

function productsForBusinessAmount(req, res){
    var businessId = req.params.id;
    Business.findById(businessId, (err, business)=>{
        if(err){
            res.status(500).send({message: 'Error en la base de datos'});
        }else if(business){
            res.send({Business: business.name, Products: business.products.quantity.length});
        }else{
            res.send({message: 'No se encontro ninguna Empresa'});
        }
    });
}

function productsForBranchOfficeAmount(req, res){
    var branchOfficeId = req.params.idBO;
    var productsId = req.params.idP;
    BranchOffice.findById(branchOfficeId, productsId,(err, branchOffice, products)=>{
        if(err){
            res.status(500).send({message: 'Error en la base de datos'});
        }else if(branchOffice, products){
            res.send({BranchOffice: branchOffice.name, Products: products.length});
        }else{
            res.send({message: 'No se encontro ninguna Empresa'});
        }
    });
}

// ---------------------------------------------------- -----------------------------------       ------------------------       ---------------- --------
function quantityForBusiness(req, res){
    let id = req.params.id;
    let quantity = req.body;

    Products.findOne({quantity},(err, productsFound)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(productsFound){
            Business.findById(id, (err, business)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(business){
                    business.products.forEach((products, i)=>{
                        if(productsFound._id.equals(products)){
                            res.send(productsFound);
                        }else{
                            res.status(404).send({message: 'No hay productos con esa cantidad'});
                        }
                    });
                }else{
                    res.send({message: 'Empresa no encontrada'});
                }
            });
        }else{
            res.status(404).send({message: 'No hay productos con esa cantidad'});
        }
    });
}

function searchQuantity(req, res){
    let id = req.params.id;
    var params = req.body;
    
    if(params.quantity){
        Products.find({quantity: params.quantity}, (err, productsFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(productsFind){
                
                Business.findById(id, (err, business)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(business){
                        res.send({business: business.name, productsFind: productsFind});
                        business.products.forEach((products, i)=>{
                            if(productsFind._id.equals(products)){
                                res.send(productsFind);
                            }else{
                                res.status(404).send({message: 'No hay productos con esa cantidad'});
                            }
                        });
                    }else{
                        res.send({message: 'Empresa no encontrada'});
                    }
                });
            }else{
                res.status(200).send({message: 'Sin registros'});
            }
        });
    }else{
        res.status(200).send({message: 'Ingrese la cantidad'});
    }
    
}
// ------------------------------------------------------------------------------------------------
function searchNameForBusiness(req,res){
    let id = req.params.id;
    let name = req.body.name;
    
        Products.findOne({name:{$regex:name,$options:'i'}},(err, productsFound)=>{
            if(err){
                res.status(500).send({message:'Error general'});
                console.log(err);
            }else if(productsFound){
                Business.findById(id,(err, business)=>{
                    if(err){
                        res.status(500).send({message:'Error general'});
                        console.log(err);
                    }else if(business){
                        business.products.forEach((products, i)=>{
                            if(productsFound._id.equals(products)){
                                res.send(productsFound);
                            }else{
                                res.status(404).send({message:'Producto no encontrado'});
                            }
                        });
                    }else{
                        res.send({message:'Empresa no encontrada'});
                    }
                });
            }else{
                res.status(404).send({message:'Producto no encontrado'});
            }
        });
}

function searchNameForBranchOffice(req,res){
    let id = req.params.id;
    let name = req.body.name;
    
        Products.findOne({name:{$regex:name,$options:'i'}},(err, productsFound)=>{
            if(err){
                res.status(500).send({message:'Error general'});
                console.log(err);
            }else if(productsFound){
                BranchOffice.findById(id,(err, branchOffice)=>{
                    if(err){
                        res.status(500).send({message:'Error general'});
                        console.log(err);
                    }else if(branchOffice){
                        branchOffice.products.forEach((products,i)=>{
                            if(productsFound._id.equals(products)){
                                res.send(productsFound);
                            }else{
                                res.status(404).send({message:'Producto no encontrado'});
                            }
                        });
                    }else{
                        res.send({message:'Sucursal no encontrada'});
                    }
                });
            }else{
                res.status(404).send({message:'Producto no encontrado'});
            }
        });
}
// ------------------------------------------------------------------------------------------------
function listBranchOffice(req,res){
    let idBranchOffice = req.params.id;
    
        Products.find({}).exec((err, productsFound)=>{
            if(err){
                res.status(500).send({message:'Error general'});
                console.log(err);
            }else if(productsFound){

                BranchOffice.findById(idBranchOffice,(err, branchOffice)=>{
                    if(err){ 
                        res.status(500).send({message:'Error general'});
                        console.log(err);
                    }else if(branchOffice){
                        res.send({branchOffice: branchOffice.name, productsFound: productsFound});
                        branchOffice.products.forEach((products,i)=>{
                            if(productsFound._idBranchOffice.equals(products)){
                                res.status(200).send({productsFound: productsFound});
                            }else{
                                res.status(404).send({message:'Producto no encontrado'});
                            }
                        });
                    }else{
                        res.send({message:'Sucursal no encontrada'});
                    }
                });
            }else{
                res.status(404).send({message:'Producto no encontrado'});
            }
        
        });
        
}

module.exports = {
    prueba,
    saveBusiness,
    login,
    updateBusiness,
    deleteBusiness,
    setEmployee,
    updateEmployee,
    removeEmployee,
    SearchEmployee,
    employeesAmount,
    listBusiness,
    setBranchOffice,
    removeBranchOffice,
    setProducts,
    removeProducts,
    updateBranchOffice,
    updateProducts,
    productsForBusinessAmount,
    productsForBranchOfficeAmount,
    searchNameForBusiness,
    searchNameForBranchOffice,
    quantityForBusiness,
    searchQuantity,
    listBranchOffice
}

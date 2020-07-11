'use strict'

var Employee = require('../models/employees.model');

function saveEmployee(req, res){
    var employee = Employee();
    var params = req.body;
 
    if( params.name &&
        params.position &&
        params.departament &&
        params.phone){

            Employee.findOne({phone: params.phone}, (err, employeeFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(employeeFind){
                    res.status(200).send({message: 'El número de teléfono ya existe'});
                }else{
                    employee.name = params.name;
                    employee.position = params.position;
                    employee.departament = params.departament;
                    employee.phone = params.phone;

                employee.save((err, employeeSaved)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(employeeSaved){
                        res.status(200).send({employeeSaved});
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

function updateEmployees(req, res){
    let employeeId = req.params.id;
    let update = req.body;
    Employee.findByIdAndUpdate(employeeId, update, {new: true}, (err, employeeUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(employeeUpdated){
                res.status(200).send({employeeUpdated: employeeUpdated});
            }else{
                res.status(200).send({message: 'Error al actualizar'});
            }
        }
    })
}

function deleteEmployee(req, res){
    var employeeId = req.params.id;

    Employee.findByIdAndRemove(employeeId, (err, employeeDelete)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(employeeDelete){
            res.status(200).send({message: 'Empleado eliminado'});
        }else{
            res.status(404).send({message: 'Error al eliminar'});
        }
    });
}




module.exports = { 
    saveEmployee,
    updateEmployees,
    deleteEmployee
}
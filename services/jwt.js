'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_secreta';

exports.createToken = (business)=>{
    var payload = {
        sub: business._id,
        name: business.name,
        role: business.role,
        iat: moment().unix(),
        exp: moment().add(60, 'minutes').unix()
    };

    return jwt.encode(payload, key)
}
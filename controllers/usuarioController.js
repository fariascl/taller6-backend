'use strict'
const bcrypt = require('bcrypt-nodejs')

var Usuario = require('../models/usuario.js');
const servicio = require('../services/index')

function guardar(req, res){
    let User = new Usuario();
    User.nombre = req.body.nombre;
    User.mail = req.body.mail;
    User.pass = req.body.pass;
    User.activo = req.body.activo; // campo 

    User.save((err, usuarioStore) => {
        if (err){
            res.status(500).send(`Error base de datos > ${err}`)
        }
        res.status(200).send({"msg": "creado correctamente", 'usuario': usuarioStore})
    })
}

function validar(req, res){
    var password = req.body.pass;
    Usuario.findOne({'mail': req.body.mail}, (err, user) => {
        if (err){
            return res.status(500).send({ mensaje: 'error al realizar la peticion' })
        }
        if (!user){
            return res.status(401).send({ mensaje: `Error usuario no existe ${req.body.mail}`})
        }
        bcrypt.compare(password, user.pass, function(error, isMatch) {
            if (error) {
                res.status(500).send(`Error al validar usuario> ${error}`)
            } 
            else if (!isMatch) {
                res.status(401).send({ 'mensaje':'incorrecto'})
            } 
            else {
                res.status(200).send({ 'mensaje':'correcto','token':servicio.createToken(user), 'activo': user.activo })
            }
        })
    })
}

function todos(req, res) {
    Usuario.find({}, (err, usuario) => {
        if (err){
            return res.status(500).send({ message: 'error al realizar la peticion' })
        } 
        if (!usuario){
            return res.status(404).send({ message: 'Error la persona no existe' })
        }
        res.status(200).send({ usuario })
    })

}

const validaVigenciaUsuario = (req,res) =>{
    Usuario.findById(req.user, function (err, usuario) {
        if (err) return res.status(401).send({'mensaje':'usuario no autorizado'})

        return  res.status(200).send({'usuario':usuario.mail});
    });
}

module.exports = {
    guardar,
    todos,
    validar,
    validaVigenciaUsuario
};
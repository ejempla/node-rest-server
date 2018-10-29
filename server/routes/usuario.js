const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado gogle img')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            Usuario.count({ estado: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    usuarios
                });
            });

        });

    //res.json({ accion: 'get Usuario' })
});

app.post('/usuario', (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });





});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });


});

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (error, usuarioBorrado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    /*
        Usuario.findByIdAndRemove(id, (error, usuarioBorrado)=>{
    
            if(error){
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            if(!usuarioBorrado){
                return res.status(400).json({
                    ok: false,
                    error: {
                        id,
                        message: 'Usuario no encontrado'
                    }
                }); 
            }
            res.json({
                ok: true,
                usuario: usuarioBorrado
            });
        });
        
    
        //res.json({ accion: 'delet Usuario' });
    */
});

module.exports = app;
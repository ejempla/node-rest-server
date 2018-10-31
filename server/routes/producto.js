const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


/*************************
**-Obtener categoria
**-paginado y solo los que tengas disponible = true
*************************/

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);



    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((error, productoDB) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            if (!productoDB) {
                return res.status(403).json({
                    ok: false,
                    error: {
                        message: 'no hay producto par mostrar  :('
                    }
                });
            }

            Producto.count({ disponible: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos: productoDB
                });
            });

        });



});

/*************************
**-Obtener categoria por ID
*************************/

app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((error, productoDB) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'no se encontro producto por id'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

/*************************
**-Buscar productos
*************************/
app.get('/producto/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex})
        .populate('categoria', 'nombre')
        .exec((error, productos)=>{
            if(error){
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            res.json({
                ok: true,
                productos
            });
        });

});


/*************************
**-Crea un nuevo producto 
*************************/
app.post('/producto', verificaToken, (req, res) => {

    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        usuario: req.usuario._id,
        categoria: req.body.categoria

    });

    producto.save((error, productoDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'no se pudo crear la categoria por problema de base de datso :('
                }
            });
        }
        res.json({
            ok: true,
            categoria: productoDB
        });
    });
});

/*************************
**-Modificar Producto
*************************/

app.put('/producto/:id', verificaToken, (req, res) => {

/*
    let id = req.params.id;
    let body = req.body;


    Producto.findById(id, (error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'el producto no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;

        productoDB.save((error, productoGuardado) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });


    });
    _.pick(req.body, ['descripcion']);
    */
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productoDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        if (!productoDB) {
            return res.status(403).json({
                ok: false,
                error: {
                    message: `no se pudo actualizar el producto con id ${id}`
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

/*************************
**-Eliminar Producto por ID
*************************/

app.delete('/producto/:id', verificaToken, (req, res) => {


    let id = req.params.id;
    //let body = _.pick(req.body, [ 'disponible' ]);
    let cambiaDisponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true, runValidators: true }, (error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'no se encontro usuario para eliminar'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'producto borrado'
        });
    });

});


module.exports = app;
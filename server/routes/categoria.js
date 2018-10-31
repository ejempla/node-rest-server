const express = require('express');

const _ = require('underscore');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

/*************************
**-Mostrar todas las categorias
*************************/

app.get('/categoria', verificaToken, (req, res) => {


    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((error, categoria) => {


        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        /*************************
                if ( categoria === undefined ) {
                    return res.status(403).json({
                        ok: true,
                        error: {
                            message: 'no se encontraron datos en la bade de datos '
                        }
                    });
                }
        *************************/
        Categoria.count((error, cantidad) => {

            return res.json({
                ok: true,
                categoria,
                cantidad
            });

        });


    });
});
/*************************
**-Mostrar una categoria por ID
*************************/

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (error, categoriaDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                error: {
                     message: 'categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/*************************
**-Crear categoria
*************************/
app.post('/categoria', verificaToken, (req, res) => {

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((error, categoriaBD) => {
        if (!categoriaBD) {
            return res.json({
                ok: true,
                error: {
                    message: 'no se encontro categoria'
                }
            });
        }
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });


});

/*************************
**-Modifica una categoria por id 
*************************/
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id || '';

    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, categoriaBD) => {

        if (!categoriaBD) {
            return res.json({
                ok: true,
                error: {
                    message: 'no se encontro categoria'
                }
            });
        }
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

/*************************
**-categoria Delete 
*************************/

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role ], (req, res) => {

    let id = req.params.id || '';

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    Categoria.findByIdAndRemove(id, (error, categoriaBD) => {

        if (!categoriaBD) {
            return res.json({
                ok: true,
                error: {
                    message: 'no se encontro categoria'
                }
            });
        }

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

module.exports = app;
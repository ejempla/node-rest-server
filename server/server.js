
require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json({ accion: 'get Usuario' })
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje : 'el nombre es nesesario'
        });
    } else {
        res.json({
            body,
            nombre: body.nombre,
            edad: body.edad,
            accion: "post Usuario"
        });
    }


});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id,
        accion: 'put Usuario'
    });
});

app.delete('/usuario', (req, res) => {
    res.json({ accion: 'delet Usuario' });
});

app.listen(process.env.PORT, () => {
    console.log(`activo en puerto ${ process.env.PORT }`);

});
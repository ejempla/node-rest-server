
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(require('./routes/usuario'));


mongoose.connect(process.env.URLDB, (error, res) => {
    if (error) {
        throw error;
    } else {
        console.log('base de datos ONLINE');

    }
});


app.listen(process.env.PORT, () => {
    console.log(`activo en puerto ${process.env.PORT}`);

});
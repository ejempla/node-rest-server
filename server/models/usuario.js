const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol vávido'
}


let Schema = mongoose.Schema;



let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'el nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el email es necesario']
    },
    password: {
        type: String,
        required: [true, 'el password es necesario']
    },
    img:{
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, 'el role es necesario'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function (){
    let user = this;
    let userObject =  user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);


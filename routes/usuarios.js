const express = require('express');
const rutas = express.Router();
const Joi = require('@hapi/joi');

const usuarios = [
    {id:1, nombre:'Carlos'},
    {id:2, nombre:'Robert'},
    {id:3, nombre:'Cristopher'},
    {id:4, nombre:'Lucas'}
];


rutas.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

rutas.get('/', (req, res) => {
    res.send(usuarios);
});


rutas.post('/', (req, res) => {
    const {
        error,
        value
    } = validarUsuario(req.body.nombre);
    if (!error) {
        const objeto = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(objeto);
        res.send(objeto);
    } else {
        res.status(400).send(error.details[0].message);
    }
});

rutas.put('/:id', (req, res) => {

    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    };

    const {
        error,
        value
    } = validarUsuario(req.body.nombre);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };

    usuario.nombre = value.nombre;
    res.send(usuario);

});

rutas.delete('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    };

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios);
});


function existeUsuario(id) {
    return (usuarios.find(u => u.id === parseInt(id)))
};

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(30).required()
    });
    return (schema.validate({
        nombre: nom
    }));
}

module.exports = rutas;
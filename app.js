const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
const morgan = require('morgan');
const log = require('./logger');
const config = require('config');

app.listen(3000, () =>{
    console.log("Servidor corriendo en puerto 3000");
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(log);

//configuracion de entornos
console.log('Aplicacion: ' + config.get('nombre'));
console.log('Database: ' + config.get('ConfigDB.host'));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
}


const usuarios = [
    {id:1, nombre:'Grover'},
    {id:2, nombre:'Peruca'},
];

app.get('/', (req, res) => {
    res.send('hola mundo desde node');
 
 });

 app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
 });

 app.get('/api/usuarios', (req, res) => {
      res.send(usuarios);
 });


 app.post('/api/usuarios', (req, res) =>{
    const {error , value} = validarUsuario(req.body.nombre);
    if(!error){
        const objeto = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
            usuarios.push(objeto);
            res.send(objeto); 
    }
    else{
        res.status(400).send(error.details[0].message);
    }
 });

 app.put('/api/usuarios/:id', (req, res) =>{
          //Encontrar si existe el objeto usuario que hay que modificar
          //let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
          let usuario = existeUsuario(req.params.id);
          if(!usuario){
            res.status(404).send('El usuario no fue encontrado');
            return;
          };

         const {error , value} = validarUsuario(req.body.nombre);
          if(error){
                res.status(400).send(error.details[0].message);
                return;
            };

            usuario.nombre = value.nombre;
            res.send(usuario);

 });

 app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
      res.status(404).send('El usuario no fue encontrado');
      return;
    };
    
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios);
 });

 function existeUsuario(id){
    return(usuarios.find(u => u.id === parseInt(id)))
 };

 function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(30).required()
      });
    return(schema.validate({nombre: nom}));
 }




const express = require('express');
const app = express();
const usuarios = require('./routes/usuarios')
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/usuarios', usuarios);






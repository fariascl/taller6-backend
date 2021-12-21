'use strict'
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

var cors = require('cors')
app.use(cors());
app.options('*',cors());

var usuario_routes = require('./routes/usuarioRoute');
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

const mongoose = require('mongoose')

app.use('/api', usuario_routes);

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true, //this is the code I added that solved it all
    keepAlive: true,
    poolSize: 10,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    useFindAndModify: false,
    useUnifiedTopology: true
}

mongoose.connect(`mongodb://localhost:27017/taller6?security=false`, options)
.then(() => console.log('> Conectado exitosamente a la BD'))
.catch(err => console.log(err))

app.listen(5000, () => {

})
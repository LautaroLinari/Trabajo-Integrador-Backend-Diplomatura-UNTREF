const mongoose = require('mongoose')

// Definir el esquema y el modelo de Mongoose
const productosSchema = new mongoose.Schema({
    codigo: Number,
    nombre: String,
    precio: Number,
    categoria: String,

  })
  const Productos = mongoose.model('Product', productosSchema)

module.exports = Productos

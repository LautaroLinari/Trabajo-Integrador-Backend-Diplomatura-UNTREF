const express = require('express')
const app = express()
const port = process.env.PORT ?? 3000
const database = require('./database.js')
const Productos = require('./product.js')


//Middleware
app.use(express.json())

//Ruta principal
app.get('/', (req, res) => {
    res.json('Bienvenido al trabajo integrador de Productos de Computación!')
})

//Obtener todos los productos de computación.
app.get('/productos', async (req, res) => {
    try {
      const productos = await Productos.find({})
      res.json(productos)
    } catch (error) {
      res.status(500).send('Error al obtener los productos de computación.')
    }
})

//Obtener un producto por su ID (codigo).
app.get('/productos/:codigo', (req, res) => {
    const { codigo } = req.params
    const query = { codigo: codigo }
    Productos.findOne(query)
     .then((producto) => {
        if (producto) return res.json(producto)
        res.status(404).json({ message: 'Producto no encontrado por ese Codigo!' })
    })
     .catch(() => {
        res.status(500).json({ message: 'Error al obtener el producto!' })
    })
})

//Devuelve los productos que coinciden con el nombre especificado (búsqueda parcial).
app.get('/productos/nombre/:nombre', async (req, res) => {
    const { nombre } = req.params
    const query = { nombre: { $regex: nombre, $options: 'i' } }
    const productos = await Productos.find(query)
    .then((producto) => {
        if(producto){
            res.json(producto)
        } else{
            res.status(404).json({ message: 'Producto no encontrado por ese Nombre!' })
        }
    })
    .catch(() => {
        res.status(500).json({ message: 'Error al obtener el producto!' })
    })
  })


//Escucha del Puerto/Servidor
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})

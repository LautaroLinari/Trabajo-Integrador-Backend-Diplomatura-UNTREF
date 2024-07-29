const express = require('express')
const app = express()
const connectDB = require('./database.js');
const port = process.env.PORT ?? 3000
const Productos = require('./product.js')

//Middleware
app.use(express.json())

//Ruta principal
app.get('/', (req, res) => {
    res.json('Bienvenidos al Trabajo Integrador de Backend sobre Productos de Computación!')
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

//Obtener un producto por su ID.
app.get('/productos/id/:id', async (req, res) => {
    const { id } = req.params
    try {
      if (!id) {
        res.status(400).json({ message: 'Error, no ingreso ningún ID.' })
        return
      }
      const producto = await Productos.findById(id)
      if (producto) return res.status(200).json(producto)
      res.status(404).json({ message: 'Producto no encontrado por este Id!.' })
    } catch (err) {
      res.status(500).json({ message: 'Error interno en el servidor!.' })
    }
})

//Devuelve los productos que coinciden con el nombre especificado (búsqueda parcial).
app.get('/productos/nombre/:nombre', async (req, res) => {
    const { nombre } = req.params
    try {
        const producto = await Productos.find({ nombre: new RegExp(nombre, "i"), })
        producto ? res.json(producto) : res.status(404).json({ message: "Error al obtener el producto, compruebe si el nombre ingresado está vacío o es incorrecto!."})   
    } catch (error) {
        res.status(500).json({ message: "Error en la búsqueda por nombre." })
    }
  })

// Crear/Agregar un nuevo producto  
app.post('/productos', async (req, res) => {
    try {
        // Contar la cantidad de códigos que hay en la BD y sumarle uno para generar el nuevo código al producto creado.
        const total = await Productos.countDocuments(req.params.codigo)
        const nuevoCodigo = total + 1
        const nuevoProducto = new Productos({...req.body, codigo: nuevoCodigo })
        const guardarProducto = await nuevoProducto.save()
        res.status(201).json(guardarProducto)
    } catch (error) {
        return res.status(500).json({ message: 'Error en la creación del producto!' })
    }
})

// Actualizar/Modificar el precio de un producto
app.patch('/productos/:id', async (req, res) => {
    const { id } = req.params
    try {
      if (!id) {
        res.status(400).json({ message: 'Error, el Id es invalido!' })
        return
      }
      const producto = await Productos.findByIdAndUpdate(id, req.body, { new: true })
      producto
        ? res.status(200).json({ message: 'El producto fue actualizado con éxito!', producto })
        : res.status(404).json({ message: 'No se encontró el producto con este Id!' })
    } catch (err) {
      res.status(500).json({ message: 'Error en el servidor!' })
    }
})

//Borrar un producto
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params
    try {
      if (!id) {
        res.status(400).json({ message: 'Error, el Id ingresado es invalido!' })
        return
      }
      const productoAeliminar = await Productos.findByIdAndDelete(id)
      productoAeliminar
        ? res.status(204).json({ message: 'El producto ha sido eliminado!' })
        : res.status(404).json({ message: 'No se encontró el producto por este Id para eliminar!' })
    } catch (err) {
      res.status(500).json({ message: 'Error en el servidor!' })
    }
})

//Si la ruta no coincide con ninguna de las anteriores, responde con un mensaje de error 404.
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta Inexistente!' })  
})

//Conectarse a la base de datos
connectDB();

//Escucha del Puerto/Servidor
app.listen(port, () => {
    console.log(`App corriendo en: http://localhost:${port}`)
})

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

//Obtener un producto por su ID (codigo).
app.get('/productos/:codigo', (req, res) => {
    const { codigo } = req.params
    const query = { codigo: codigo }
    Productos.findOne(query)
     .then((producto) => {
        if (producto) return res.json(producto)
        res.status(404).json({ message: 'Producto no encontrado por ese código!' })
    })
     .catch(() => {
        res.status(500).json({ message: 'Error al obtener el producto, compruebe si el código ingresado es correcto!' })
    })
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
        return res.status(500).json({ message: 'Error al crear el producto!' })
    }
})

// Actualizar/Modificar el precio de un producto
app.patch('/productos/:codigo', async (req, res) => {
    try {
        const actualizarProducto = await Productos.findOneAndUpdate(
            req.params,
            { precio: req.body.precio },
            { new: true }
        )
        if (!actualizarProducto) {
            return res.status(404).json({ message: 'Producto no encontrado!' })
        }
        res.json(actualizarProducto)
    } catch (error) {
        res.status(500).json({ message: 'Error al modificar el precio del producto seleccionado!' })
    }
})

//Borrar un producto
app.delete('/productos/:codigo', async (req, res) => {
    try {
        const borrarProducto = await Productos.findOneAndDelete(req.params)
        if (!borrarProducto) {
            return res.status(404).json({ message: 'Producto no encontrado!' })
        }
        res.json({ message: 'Producto eliminado con éxito!' })
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto seleccionado!' })
    }
})

//Conectarse a la base de datos
connectDB();

//Escucha del Puerto/Servidor
app.listen(port, () => {
    console.log(`App corriendo en: http://localhost:${port}`)
})

process.loadEnvFile()
// const port = process.env.PORT ?? 3000
const mongoose = require('mongoose')

//Obtenemos la URI desde las variables de entorno
const URI = process.env.MONGODB_URLSTRING
const DATABASE_NAME = process.env.DATABASE_NAME

// Conectar a MongoDB usando Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(URI + DATABASE_NAME)
    console.log('Conectado a MongoDB')
  } catch (error) {
    console.error('Error al conectarse: ', error)
  }
}

module.exports = connectDB
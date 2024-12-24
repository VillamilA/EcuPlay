// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routergames from './routers/game_routes.js'
import routerClientes from './routers/cliente_routes.js'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("server running")
})

app.use('/api',routerClientes)

app.use("/api", routergames)
app.use((req,res)=>{
    res.status(400).json({error:"Ruta no encontrada"})
})

// Exportar la instancia de express por medio de app
export default  app
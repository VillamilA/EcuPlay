import Router from 'express'
import {
    loginCliente,   
    perfilCliente,
    registrarCliente,
    actualizarCliente,
    eliminarCliente,
    compraCliente
    
} from '../controllers/cliente_controller.js'

const router = Router()

router.post('/cliente/login', loginCliente) 

router.get('/cliente/perfil', perfilCliente)

router.get('/cliente/compras', compraCliente)

router.post('/cliente/registro',   registrarCliente)

router.put('/cliente/actualizar/:id', actualizarCliente)

router.delete('/cliente/eliminar/:id', eliminarCliente)

export default router
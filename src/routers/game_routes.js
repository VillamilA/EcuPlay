import {Router} from 'express'
import { registerUser, confirmEmail, login, recuperarPassword, comprobarToken, nuevoPassword } from '../controllers/seller_controller.js'
const router = Router()


router.post('/registro',registerUser)
router.get('/confirmar/:token',confirmEmail)
router.post('/login',login)
router.post('/recuperar-password',recuperarPassword)
router.get('/recuperar-password/:token',comprobarToken)
router.post('/nuevo-password/:token',nuevoPassword)

export default router
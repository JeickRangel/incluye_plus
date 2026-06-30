const { Router } = require('express')
const { crearTamizaje } = require('../controllers/tamizaje.controller')
const { verificarToken } = require('../middleware/auth.middleware')

const router = Router()
router.post('/', verificarToken, crearTamizaje)

module.exports = router
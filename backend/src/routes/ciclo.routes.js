const { Router } = require('express')
const { obtenerOCrearCicloActivo } = require('../controllers/ciclo.controller')
const { verificarToken } = require('../middleware/auth.middleware')

const router = Router()
router.get('/activo/:pcdId', verificarToken, obtenerOCrearCicloActivo)

module.exports = router
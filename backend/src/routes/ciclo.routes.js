const { Router } = require('express')
const { obtenerOCrearCicloActivo } = require('../controllers/ciclo.controller')

const router = Router()
router.get('/activo/:pcdId', obtenerOCrearCicloActivo)

module.exports = router
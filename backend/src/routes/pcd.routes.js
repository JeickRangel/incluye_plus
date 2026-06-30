const { Router } = require('express')
const { crearPcd, obtenerPcd, buscarPcdPorDocumento, buscarPcdPorNombre } = require('../controllers/pcd.controller')
const { verificarToken } = require('../middleware/auth.middleware')

const router = Router()
router.post('/', verificarToken, crearPcd)
router.get('/buscar', verificarToken, buscarPcdPorDocumento)
router.get('/buscar-nombre', verificarToken, buscarPcdPorNombre)
router.get('/:id', verificarToken, obtenerPcd)

module.exports = router
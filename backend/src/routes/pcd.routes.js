const { Router } = require('express')
const { crearPcd, obtenerPcd, buscarPcdPorDocumento, buscarPcdPorNombre } = require('../controllers/pcd.controller')

const router = Router()
router.post('/', crearPcd)
router.get('/buscar', buscarPcdPorDocumento)  // ← nueva, va ANTES de /:id
router.get('/buscar-nombre', buscarPcdPorNombre)
router.get('/:id', obtenerPcd)

module.exports = router
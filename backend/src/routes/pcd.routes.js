const { Router } = require('express')
const { crearPcd, obtenerPcd } = require('../controllers/pcd.controller')

const router = Router()
router.post('/', crearPcd)
router.get('/:id', obtenerPcd)

module.exports = router
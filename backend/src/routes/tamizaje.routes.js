const { Router } = require('express')
const { crearTamizaje } = require('../controllers/tamizaje.controller')

const router = Router()
router.post('/', crearTamizaje)

module.exports = router
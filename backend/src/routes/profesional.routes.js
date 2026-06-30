const { Router } = require('express')
const { listarProfesionales } = require('../controllers/profesional.controller')
const { verificarToken } = require('../middleware/auth.middleware')

const router = Router()
router.get('/', verificarToken, listarProfesionales)

module.exports = router
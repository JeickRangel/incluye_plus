const { Router } = require('express')
const { listarProfesionales } = require('../controllers/profesional.controller')

const router = Router()
router.get('/', listarProfesionales)

module.exports = router
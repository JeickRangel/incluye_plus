require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pcdRoutes = require('./routes/pcd.routes')
const tamizajeRoutes = require('./routes/tamizaje.routes')
const profesionalRoutes = require('./routes/profesional.routes')
const cicloRoutes       = require('./routes/ciclo.routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use('/api/profesionales', profesionalRoutes)
app.use('/api/ciclos', cicloRoutes)

app.use('/api/pcd', pcdRoutes)
app.use('/api/tamizaje', tamizajeRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, proyecto: 'Incluye+', fecha: new Date().toISOString() })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err, _req, res, _next) => {
  console.error('[Error no controlado]', err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`✅  Incluye+ API corriendo en http://localhost:${PORT}`)
})
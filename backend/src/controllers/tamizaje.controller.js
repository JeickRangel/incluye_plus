const prisma = require('../lib/prisma')

async function crearTamizaje(req, res) {
  const { cicloId, profesionalId, nivelApoyoGeneral, tipoApoyoGeneral, respuestas, resultadosCategoria } = req.body

  const requeridos = { cicloId, profesionalId, tipoApoyoGeneral, respuestas, resultadosCategoria }
  const faltantes = Object.entries(requeridos).filter(([, v]) => v === undefined || v === null || v === '').map(([k]) => k)
  if (faltantes.length > 0) return res.status(400).json({ error: 'Faltan campos requeridos', campos: faltantes })

  if (![0, 1, 2, 3].includes(Number(nivelApoyoGeneral))) return res.status(400).json({ error: 'nivelApoyoGeneral debe ser 0, 1, 2 o 3' })

  try {
    const ciclo = await prisma.ciclo.findUnique({ where: { id: cicloId } })
    if (!ciclo) return res.status(404).json({ error: 'Ciclo no encontrado' })
    if (ciclo.estado === 'CERRADO') return res.status(400).json({ error: 'No se puede registrar tamizaje en ciclo cerrado' })

    const profesional = await prisma.profesional.findUnique({ where: { id: profesionalId } })
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' })

    const tamizaje = await prisma.tamizaje.create({
      data: { cicloId, profesionalId, nivelApoyoGeneral: Number(nivelApoyoGeneral), tipoApoyoGeneral, respuestas, resultadosCategoria }
    })

    return res.status(201).json({ mensaje: 'Tamizaje registrado exitosamente', data: tamizaje })
  } catch (error) {
    console.error('[crearTamizaje]', error)
    return res.status(500).json({ error: 'No se pudo registrar el tamizaje' })
  }
}

module.exports = { crearTamizaje }
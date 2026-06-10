const prisma = require('../lib/prisma')

async function obtenerOCrearCicloActivo(req, res) {
  const { pcdId } = req.params
  const anioActual = new Date().getFullYear()

  try {
    const pcd = await prisma.pcd.findUnique({ where: { id: pcdId } })
    
    // Agregar este log para ver qué está llegando
    console.log('[ciclo] pcdId recibido:', pcdId)
    console.log('[ciclo] pcd encontrada:', pcd)

    if (!pcd) {
      return res.status(404).json({ error: 'PCD no encontrada', pcdId })
    }

    let ciclo = await prisma.ciclo.findFirst({
      where: { pcdId, anio: anioActual, estado: 'EN_CURSO' }
    })

    let fueCreado = false
    if (!ciclo) {
      ciclo = await prisma.ciclo.create({
        data: { pcdId, anio: anioActual, fechaInicio: new Date() }
      })
      fueCreado = true
    }

    return res.json({ data: ciclo, creado: fueCreado })

  } catch (error) {
    console.error('[obtenerOCrearCicloActivo]', error)
    return res.status(500).json({ error: 'No se pudo obtener el ciclo activo' })
  }
}

module.exports = { obtenerOCrearCicloActivo }
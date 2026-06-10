const prisma = require('../lib/prisma')

// Lista todos los profesionales activos de una entidad
async function listarProfesionales(req, res) {
  const { entidadId } = req.query

  if (!entidadId) {
    return res.status(400).json({ error: 'Falta el parámetro entidadId' })
  }

  try {
    const profesionales = await prisma.profesional.findMany({
      where: { entidadId, activo: true },
      select: {
        id: true,
        nombre: true,
        disciplina: true,
        rol: true
      },
      orderBy: { nombre: 'asc' }
    })

    return res.json({ data: profesionales })
  } catch (error) {
    console.error('[listarProfesionales]', error)
    return res.status(500).json({ error: 'No se pudo obtener la lista de profesionales' })
  }
}

module.exports = { listarProfesionales }
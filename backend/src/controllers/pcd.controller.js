const prisma = require('../lib/prisma')

async function crearPcd(req, res) {
  const { entidadId, nombre, documento, fechaNacimiento, sexo, localidad, diagnosticoPrincipal, tipoDiscapacidad } = req.body

  const requeridos = { entidadId, nombre, documento, fechaNacimiento, localidad, diagnosticoPrincipal, tipoDiscapacidad }
  const faltantes = Object.entries(requeridos).filter(([, v]) => !v).map(([k]) => k)
  if (faltantes.length > 0) return res.status(400).json({ error: 'Faltan campos requeridos', campos: faltantes })

  const tiposValidos = ['intelectual', 'multiple']
  if (!tiposValidos.includes(tipoDiscapacidad)) return res.status(400).json({ error: `tipoDiscapacidad debe ser: ${tiposValidos.join(', ')}` })

  try {
    const duplicado = await prisma.pcd.findFirst({ where: { documento, entidadId } })
    if (duplicado) return res.status(409).json({ error: `Ya existe una PCD con documento ${documento}` })

    const resultado = await prisma.$transaction(async (tx) => {
      const pcd = await tx.pcd.create({
        data: { entidadId, nombre, documento, fechaNacimiento: new Date(fechaNacimiento), sexo, localidad, diagnosticoPrincipal, tipoDiscapacidad }
      })
      const ciclo = await tx.ciclo.create({
        data: { pcdId: pcd.id, anio: new Date().getFullYear(), fechaInicio: new Date() }
      })
      return { pcd, ciclo }
    })

    return res.status(201).json({ mensaje: 'PCD y ciclo creados exitosamente', data: resultado })
  } catch (error) {
    console.error('[crearPcd]', error)
    return res.status(500).json({ error: 'No se pudo crear la PCD' })
  }
}

async function obtenerPcd(req, res) {
  const { id } = req.params
  try {
    const pcd = await prisma.pcd.findUnique({
      where: { id },
      include: {
        ciclos: {
          where: { estado: 'EN_CURSO' },
          orderBy: { anio: 'desc' },
          take: 1,
          include: {
            tamizajes: { orderBy: { creadoEn: 'desc' } },
            ppa: { include: { objetivos: { orderBy: { creadoEn: 'asc' } } } }
          }
        }
      }
    })

    if (!pcd) return res.status(404).json({ error: 'PCD no encontrada' })

    const { ciclos, ...dataPcd } = pcd
    return res.json({ data: { ...dataPcd, cicloActivo: ciclos[0] ?? null } })
  } catch (error) {
    console.error('[obtenerPcd]', error)
    return res.status(500).json({ error: 'No se pudo obtener la PCD' })
  }
}

module.exports = { crearPcd, obtenerPcd }

// Busca una PCD por número de documento dentro de una entidad
async function buscarPcdPorDocumento(req, res) {
  const { documento, entidadId } = req.query

  if (!documento || !entidadId) {
    return res.status(400).json({ error: 'Faltan parámetros: documento y entidadId son requeridos' })
  }

  try {
    const pcd = await prisma.pcd.findFirst({
      where: { documento, entidadId },
      include: {
        ciclos: {
          where: { estado: 'EN_CURSO' },
          orderBy: { anio: 'desc' },
          take: 1
        }
      }
    })

    if (!pcd) {
      return res.status(404).json({ error: 'PCD no encontrada', encontrada: false })
    }

    const { ciclos, ...dataPcd } = pcd
    return res.json({
      data: {
        ...dataPcd,
        cicloActivo: ciclos[0] ?? null,
        encontrada: true
      }
    })
  } catch (error) {
    console.error('[buscarPcdPorDocumento]', error)
    return res.status(500).json({ error: 'No se pudo buscar la PCD' })
  }
}

// Actualizar el module.exports
module.exports = { crearPcd, obtenerPcd, buscarPcdPorDocumento }
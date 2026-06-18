const prisma = require('../lib/prisma')

// Crea una PCD nueva junto con su ficha de caracterización y su ciclo activo
async function crearPcd(req, res) {
  const { pcd: datosPcd, ficha: datosFicha } = req.body

  // Validar que llegaron los dos bloques de datos
  if (!datosPcd || !datosFicha) {
    return res.status(400).json({ error: 'El body debe tener los campos pcd y ficha' })
  }

  const { entidadId, tipoDocumento, documento, nombre, fechaNacimiento, etapaCicloVital, fechaIngresoSDIS, sexo, estadoCivil } = datosPcd

  // Validar campos obligatorios de pcd
  const requeridos = { entidadId, tipoDocumento, documento, nombre, fechaNacimiento, etapaCicloVital, fechaIngresoSDIS, sexo, estadoCivil }
  const faltantes = Object.entries(requeridos).filter(([, v]) => v === undefined || v === null || v === '').map(([k]) => k)
  if (faltantes.length > 0) {
    return res.status(400).json({ error: 'Faltan campos requeridos en pcd', campos: faltantes })
  }

  try {
    // Verificar que no exista ya una PCD con ese documento en esa entidad
    const duplicado = await prisma.pcd.findFirst({ where: { documento, entidadId } })
    if (duplicado) {
      return res.status(409).json({ error: `Ya existe una PCD con documento ${documento}` })
    }

    // Crear PCD + FichaPcd + Ciclo en una sola transacción
    const resultado = await prisma.$transaction(async (tx) => {
      const pcd = await tx.pcd.create({
        data: {
          entidadId,
          tipoDocumento,
          documento,
          nombre,
          fechaNacimiento: new Date(fechaNacimiento),
          etapaCicloVital,
          fechaIngresoSDIS: new Date(fechaIngresoSDIS),
          sexo,
          estadoCivil,
        }
      })

      const ficha = await tx.fichaPcd.create({
        data: {
          pcdId: pcd.id,
          ...datosFicha
        }
      })

      const ciclo = await tx.ciclo.create({
        data: {
          pcdId: pcd.id,
          anio: new Date().getFullYear(),
          fechaInicio: new Date()
        }
      })

      return { pcd, ficha, ciclo }
    })

    return res.status(201).json({ mensaje: 'PCD registrada exitosamente', data: resultado })

  } catch (error) {
    console.error('[crearPcd]', error)
    return res.status(500).json({ error: 'No se pudo crear la PCD' })
  }
}

// Obtiene una PCD por ID con su ciclo activo
async function obtenerPcd(req, res) {
  const { id } = req.params
  try {
    const pcd = await prisma.pcd.findUnique({
      where: { id },
      include: {
        ficha: true,
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
    return res.json({ data: { ...dataPcd, cicloActivo: ciclos[0] ?? null, encontrada: true } })

  } catch (error) {
    console.error('[buscarPcdPorDocumento]', error)
    return res.status(500).json({ error: 'No se pudo buscar la PCD' })
  }
}

// Busca PCDs por nombre parcial dentro de una entidad
async function buscarPcdPorNombre(req, res) {
  const { nombre, entidadId } = req.query

  if (!nombre || !entidadId) {
    return res.status(400).json({ error: 'Faltan parámetros: nombre y entidadId son requeridos' })
  }

  try {
    const pcds = await prisma.pcd.findMany({
      where: {
        entidadId,
        nombre: { contains: nombre, mode: 'insensitive' }
      },
      include: {
        ciclos: {
          where: { estado: 'EN_CURSO' },
          orderBy: { anio: 'desc' },
          take: 1
        }
      }
    })

    const data = pcds.map(({ ciclos, ...pcd }) => ({
      ...pcd,
      cicloActivo: ciclos[0] ?? null
    }))

    return res.json({ data })

  } catch (error) {
    console.error('[buscarPcdPorNombre]', error)
    return res.status(500).json({ error: 'No se pudo buscar la PCD' })
  }
}

module.exports = { crearPcd, obtenerPcd, buscarPcdPorDocumento, buscarPcdPorNombre }
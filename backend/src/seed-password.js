// Script de uso único: asigna contraseña encriptada a un profesional existente
const bcrypt = require('bcrypt')
const prisma = require('./lib/prisma')

async function asignarPassword() {
  const email = 'Moni@gmail.com'
  const claveNueva = 'Incluye2026*'             // clave temporal para pruebas

  const hash = await bcrypt.hash(claveNueva, 10)

  const actualizado = await prisma.profesional.update({
    where: { email },
    data: { password: hash }
  })

  console.log('✅ Contraseña asignada a:', actualizado.nombre)
  console.log('   Email:', actualizado.email)
  console.log('   Clave (texto plano, solo para pruebas):', claveNueva)
  await prisma.$disconnect()
}

asignarPassword().catch(e => {
  console.error('❌ Error:', e.message)
  prisma.$disconnect()
  process.exit(1)
})
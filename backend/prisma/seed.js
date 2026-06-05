const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Crear entidad de prueba
  const entidad = await prisma.entidad.create({
    data: {
      nombre: 'Fundación Incluye+',
      nit: '900123456-1',
    },
  });
  console.log('Entidad creada:', entidad.id);

  // Crear profesional de prueba
  const profesional = await prisma.profesional.create({
    data: {
      nombre: 'Jeisson Rangel',
      documento: '1234567890',
      disciplina: 'coordinador',
      email: 'jeisson@incluye.com',
      password: '123456',
      rol: 'COORDINADOR',
      entidadId: entidad.id,
    },
  });
  console.log('Profesional creado:', profesional.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('COORDINADOR', 'PROFESIONAL');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INACTIVO', 'EGRESO');

-- CreateEnum
CREATE TYPE "EstadoCiclo" AS ENUM ('EN_CURSO', 'CERRADO');

-- CreateEnum
CREATE TYPE "EstadoPpa" AS ENUM ('BORRADOR', 'ACTIVO', 'CERRADO');

-- CreateEnum
CREATE TYPE "EstadoObjetivo" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'LOGRADO');

-- CreateEnum
CREATE TYPE "TipoSesion" AS ENUM ('GRUPAL', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('PRESENCIAL', 'VIRTUAL');

-- CreateTable
CREATE TABLE "Entidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profesional" (
    "id" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'PROFESIONAL',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profesional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pcd" (
    "id" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "sexo" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "diagnosticoPrincipal" TEXT NOT NULL,
    "tipoDiscapacidad" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pcd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ciclo" (
    "id" TEXT NOT NULL,
    "pcdId" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "estado" "EstadoCiclo" NOT NULL DEFAULT 'EN_CURSO',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ciclo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tamizaje" (
    "id" TEXT NOT NULL,
    "cicloId" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nivelApoyoGeneral" INTEGER NOT NULL,
    "tipoApoyoGeneral" TEXT NOT NULL,
    "respuestas" JSONB NOT NULL,
    "resultadosCategoria" JSONB NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tamizaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ppa" (
    "id" TEXT NOT NULL,
    "cicloId" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoPpa" NOT NULL DEFAULT 'BORRADOR',
    "actividadesCasa" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ppa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjetivoPpa" (
    "id" TEXT NOT NULL,
    "ppaId" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoObjetivo" NOT NULL DEFAULT 'PENDIENTE',
    "fechaLogro" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObjetivoPpa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sesion" (
    "id" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoSesion" NOT NULL,
    "modalidad" "Modalidad" NOT NULL DEFAULT 'PRESENCIAL',
    "descripcionGeneral" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroSesion" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "pcdId" TEXT NOT NULL,
    "cicloId" TEXT NOT NULL,
    "asistio" BOOLEAN NOT NULL DEFAULT true,
    "descripcion" TEXT,
    "huboAvance" BOOLEAN NOT NULL DEFAULT false,
    "descripcionAvance" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroSesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjetivoTrabajado" (
    "id" TEXT NOT NULL,
    "registroSesionId" TEXT NOT NULL,
    "objetivoPpaId" TEXT NOT NULL,

    CONSTRAINT "ObjetivoTrabajado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entidad_nit_key" ON "Entidad"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_email_key" ON "Profesional"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ppa_cicloId_key" ON "Ppa"("cicloId");

-- CreateIndex
CREATE UNIQUE INDEX "ObjetivoTrabajado_registroSesionId_objetivoPpaId_key" ON "ObjetivoTrabajado"("registroSesionId", "objetivoPpaId");

-- AddForeignKey
ALTER TABLE "Profesional" ADD CONSTRAINT "Profesional_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pcd" ADD CONSTRAINT "Pcd_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ciclo" ADD CONSTRAINT "Ciclo_pcdId_fkey" FOREIGN KEY ("pcdId") REFERENCES "Pcd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tamizaje" ADD CONSTRAINT "Tamizaje_cicloId_fkey" FOREIGN KEY ("cicloId") REFERENCES "Ciclo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tamizaje" ADD CONSTRAINT "Tamizaje_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ppa" ADD CONSTRAINT "Ppa_cicloId_fkey" FOREIGN KEY ("cicloId") REFERENCES "Ciclo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetivoPpa" ADD CONSTRAINT "ObjetivoPpa_ppaId_fkey" FOREIGN KEY ("ppaId") REFERENCES "Ppa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetivoPpa" ADD CONSTRAINT "ObjetivoPpa_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "Entidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroSesion" ADD CONSTRAINT "RegistroSesion_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "Sesion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroSesion" ADD CONSTRAINT "RegistroSesion_pcdId_fkey" FOREIGN KEY ("pcdId") REFERENCES "Pcd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroSesion" ADD CONSTRAINT "RegistroSesion_cicloId_fkey" FOREIGN KEY ("cicloId") REFERENCES "Ciclo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetivoTrabajado" ADD CONSTRAINT "ObjetivoTrabajado_registroSesionId_fkey" FOREIGN KEY ("registroSesionId") REFERENCES "RegistroSesion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetivoTrabajado" ADD CONSTRAINT "ObjetivoTrabajado_objetivoPpaId_fkey" FOREIGN KEY ("objetivoPpaId") REFERENCES "ObjetivoPpa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

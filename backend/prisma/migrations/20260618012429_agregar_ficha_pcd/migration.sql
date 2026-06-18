/*
  Warnings:

  - You are about to drop the column `diagnosticoPrincipal` on the `Pcd` table. All the data in the column will be lost.
  - You are about to drop the column `localidad` on the `Pcd` table. All the data in the column will be lost.
  - You are about to drop the column `tipoDiscapacidad` on the `Pcd` table. All the data in the column will be lost.
  - Added the required column `estadoCivil` to the `Pcd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `etapaCicloVital` to the `Pcd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaIngresoSDIS` to the `Pcd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDocumento` to the `Pcd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pcd" DROP COLUMN "diagnosticoPrincipal",
DROP COLUMN "localidad",
DROP COLUMN "tipoDiscapacidad",
ADD COLUMN     "estadoCivil" TEXT NOT NULL DEFAULT 'no_registrado',
ADD COLUMN     "etapaCicloVital" TEXT NOT NULL DEFAULT 'no_registrado',
ADD COLUMN     "fechaIngresoSDIS" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
ADD COLUMN     "tipoDocumento" TEXT NOT NULL DEFAULT 'CC';

-- CreateTable
CREATE TABLE "FichaPcd" (
    "id" TEXT NOT NULL,
    "pcdId" TEXT NOT NULL,
    "tieneHijos" BOOLEAN NOT NULL,
    "nivelEducativo" TEXT NOT NULL,
    "estudiaActualmente" BOOLEAN NOT NULL,
    "regimensSalud" TEXT NOT NULL,
    "nombreEps" TEXT NOT NULL,
    "antecedentesHabitaCalle" BOOLEAN NOT NULL,
    "perteneceGrupoEtnico" BOOLEAN NOT NULL,
    "perteneceGrupoLgbti" BOOLEAN NOT NULL,
    "victimaConflicto" BOOLEAN NOT NULL,
    "tipoDiscapacidad" TEXT NOT NULL,
    "diagnosticoCognitivo" TEXT,
    "diagnosticoMental" TEXT,
    "diagnosticoNeurologico" TEXT,
    "diagnosticoSensorial" TEXT,
    "sistemaApoyoGeneral" TEXT NOT NULL,
    "porcentajeSistemaApoyo" DOUBLE PRECISION NOT NULL,
    "catAprendizaje" TEXT NOT NULL,
    "catComunicacion" TEXT NOT NULL,
    "catIndependencia" TEXT NOT NULL,
    "catParticipacion" TEXT NOT NULL,
    "catMovilidad" TEXT NOT NULL,
    "requiereOxigeno" BOOLEAN NOT NULL,
    "numMedicamentos" INTEGER NOT NULL,
    "enuresis" TEXT NOT NULL,
    "recibePaniales" BOOLEAN NOT NULL,
    "cantidadPanialesMes" INTEGER,
    "requiereCuraciones" BOOLEAN NOT NULL,
    "autoagresividad" BOOLEAN NOT NULL,
    "heteroagresividad" BOOLEAN NOT NULL,
    "destruccionObjetos" BOOLEAN NOT NULL,
    "conductasEscapistas" BOOLEAN NOT NULL,
    "movimientosRepetitivos" BOOLEAN NOT NULL,
    "requiereAyudaTecnica" BOOLEAN NOT NULL,
    "tipoAyudaTecnica" TEXT,
    "tenenciaAyudaTecnica" TEXT,
    "nombreReferente" TEXT NOT NULL,
    "documentoReferente" TEXT NOT NULL,
    "parentescoReferente" TEXT NOT NULL,
    "edadReferente" INTEGER NOT NULL,
    "cicloVitalReferente" TEXT NOT NULL,
    "direccionReferente" TEXT NOT NULL,
    "telefonoReferente" TEXT NOT NULL,
    "correoReferente" TEXT,
    "barrioReferente" TEXT NOT NULL,
    "localidadReferente" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FichaPcd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FichaPcd_pcdId_key" ON "FichaPcd"("pcdId");

-- AddForeignKey
ALTER TABLE "FichaPcd" ADD CONSTRAINT "FichaPcd_pcdId_fkey" FOREIGN KEY ("pcdId") REFERENCES "Pcd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

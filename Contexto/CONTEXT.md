# CONTEXT.md — Proyecto Incluye+
> Archivo de memoria persistente para usar entre conversaciones con Claude.
> Actualizar manualmente al finalizar cada sesión de trabajo.

---

## 1. Descripción del proyecto

**Nombre:** Incluye+
**Tipo:** Aplicación web de gestión de información para fundaciones e IPS
**Enfoque:** Atención a personas con discapacidad (PCD) desde perspectiva social y/o de salud
**Objetivo principal:** Facilitar procesos de intervención individual y grupal mediante:
- Valoración del sistema de apoyos (tamizaje)
- Registro y seguimiento individual de cada PCD
- Visualización de evolución y avance funcional
- Generación automática de documentos oficiales (formato SDIS FOR-PSS-159)
- Análisis grupal para toma de decisiones

**Contexto del servicio:**
- Población: personas con discapacidad intelectual o múltiple asociada a intelectual, entre 18 y 60 años, residentes en Bogotá
- Tamaño típico: 50–60 PCD por servicio
- Dos tipos de servicio: apoyo intermitente/limitado y apoyo extenso/generalizado
- El ingreso al sistema implica que la persona ya es elegible; no se hace verificación dentro de la app

**Usuarios objetivo:**
- Coordinador (acceso total a todos los módulos)
- Profesionales: terapeuta ocupacional, educador especial, psicólogo/a, educador físico, talleristas
- Apoyo: trabajador/a social, nutricionista, auxiliar de enfermería

**Referencia normativa:** Formato FOR-PSS-159 v2 — SDIS Bogotá (Memo I2024022831 – 16/08/2024)

**Escalabilidad:** Diseñado para iniciar con una entidad y escalar a multi-tenant (varias fundaciones/IPS)

---

## 2. Stack tecnológico

### Actual (fase inicial — prototipo funcional)
| Capa                      | Tecnología                                            |
|---------------------------|-------------------------------------------------------|
| Frontend                  | HTML + CSS propio + Bootstrap 5.2 (en transición)     |
| Lógica                    | JavaScript vanilla                                    |
| Documentos                | docxtemplater + PizZip + FileSaver.js                 |
| Almacenamiento            | localStorage (temporal) + PostgreSQL (activo)         |
| Backend                   | Node.js + Express (activo)                            |
| ORM                       | Prisma 5.22.0                                         |
| Estilos                   | CSS propio con variables (paleta verde azulado)       |

### Objetivo (fase profesional)
| Capa          | Tecnología                        | Razón                         |
|---------------|-----------------------------------|------------------------------ |
| Frontend      | React + Vite                      | Componentes, escalabilidad    |
| Estilos       | Tailwind CSS                      | Más limpio que Bootstrap      |
| Backend       | Node.js + Express                 | JS full stack                 |
| Base de datos | PostgreSQL + Prisma ORM           | Profesional, legible          |
| Autenticación | JWT + bcrypt                      | Estándar seguro               |
| Documentos    | docxtemplater (ya funciona)       | Mantener                      |
| Hosting       | Vercel (front) + Railway (back+BD)| Gratuito inicial              |

### Paleta de colores definida
```css
--color-principal:   #006064;  /* verde azulado oscuro */
--color-secundario:  #00838F;  /* verde azulado medio */
--color-acento:      #4DD0E1;  /* celeste */
--color-fondo:       #E0F7FA;  /* fondo claro */
--color-texto:       #212121;
--color-texto-suave: #546E7A;
--color-borde:       #CFD8DC;
```

---

## 3. Estructura de carpetas actual

```
incluye_plus/
├── assets/
│   ├── favicon.ico
│   ├── logoSDIS.png
│   └── formato_tamizaje_plantilla.docx
├── Contexto/
│   └── CONTEXT.md
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   └── scripts.js
├── libs/
│   ├── pizzip.min.js
│   ├── docxtemplater.js
│   └── FileSaver.min.js
├── index.html
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   ├── pcd.controller.js        ✅
    │   │   ├── tamizaje.controller.js   ✅
    │   │   ├── profesional.controller.js ✅ nuevo
    │   │   └── ciclo.controller.js      ✅ nuevo
    │   ├── routes/
    │   │   ├── pcd.routes.js            ✅ actualizado
    │   │   ├── tamizaje.routes.js       ✅
    │   │   ├── profesional.routes.js    ✅ nuevo
    │   │   └── ciclo.routes.js          ✅ nuevo
    │   ├── lib/
    │   │   └── prisma.js
    │   └── index.js
    └── prisma/
        └── schema.prisma
```

### Estructura objetivo (cuando migre a React)
```
incluye-plus/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   └── prisma/
└── CONTEXT.md
```

---

## 4. Flujo de atención — ciclo anual

Ingreso PCD → Sistema de apoyos → Estudio de caso → PPA → Sesiones → Seguimiento → Reporte

- Cada año se re-aplica el sistema de apoyos para iniciar un nuevo ciclo
- El comparativo entre ciclos evidencia reducción del nivel de apoyo
- Las sesiones son diarias, predominantemente grupales con objetivos individuales
- El PPA lo construye todo el equipo, cada profesional aporta desde su disciplina

---

## 5. Módulos y su estado

### Módulo 1 — Sistema de apoyos ✅ Completo (frontend + backend integrados)
- [x] Flujo 3 pantallas, 25 preguntas, cálculo por categoría y general
- [x] Panel de análisis con acordeón
- [x] Exportar Word con todas las etiquetas correctas
- [x] Validación de campos obligatorios
- [x] Backend Express + PostgreSQL + Prisma funcionando
- [x] POST /api/tamizaje guardando en BD
- [x] Pantalla de inicio conectada a BD: búsqueda de PCD por nombre (datalist en vivo)
- [x] Card de profesional conectada a BD: select de profesionales, autocompleta cargo
- [x] IDs dinámicos: cicloActivoId y profesionalSeleccionadoId reemplazaron hardcodeados
- [x] nivelApoyoGeneral acepta equivalencia 0-4 (incluye APOYO GENERALIZADO)
- [x] Formulario de registro de nueva PCD — backend completo
- [x] Formulario de registro de nueva PCD — frontend + backend completos ✅

### Módulo 2 — PPA / Plan Personalizado de Apoyo 🔲 Siguiente
### Módulo 3 — Sesiones e intervención 🔲 Fase 2
### Módulo 4 — Seguimiento y reportes 🔲 Fase 2
### Módulo 5 — Dashboard general 🔲 Fase 3

---

## 6. API — Endpoints disponibles

| Método | Ruta | Descripción | Estado |
|--------|------|-------------|--------|
| POST | `/api/tamizaje` | Crea un nuevo tamizaje | ✅ |
| POST | `/api/pcd` | Registra una nueva PCD + crea ciclo | ✅ |
| GET | `/api/pcd/:id` | Obtiene PCD por ID con ciclo activo | ✅ |
| GET | `/api/pcd/buscar?documento=X&entidadId=X` | Busca PCD por documento | ✅ nuevo |
| GET | `/api/profesionales?entidadId=X` | Lista profesionales de una entidad | ✅ nuevo |
| GET | `/api/ciclos/activo/:pcdId` | Obtiene o crea el ciclo activo del año | ✅ nuevo |
| GET | `/api/health` | Verifica que el servidor está activo | ✅ |
| GET | /api/pcd/buscar-nombre?nombre=X&entidadId=X | Busca PCDs por nombre (parcial, insensible a mayúsculas) | ✅ nuevo |
| POST | `/api/pcd` | Crea PCD + FichaPcd + Ciclo en transacción | ✅ actualizado |

---

## 7. Modelo de datos — ERD

### Tablas principales y relaciones

| Tabla                 | Descripción               | Relaciones clave |
|-----------------------|---------------------------|-----------------|
| `entidad`             | Fundación o IPS           | Tiene muchos profesionales y PCD |
| `profesional`         | Usuario del sistema       | Pertenece a entidad, tiene rol |
| `pcd`                 | Persona con discapacidad  | Pertenece a entidad, tiene ciclos |
| `ciclo`               | Año de atención de una PCD| Eje central — conecta tamizaje, PPA y sesiones |
| `tamizaje`            | Resultado del sistema de apoyos | Pertenece a ciclo y profesional |
| `ppa`                 | Plan Personalizado de Apoyo | Uno por ciclo (relación 1 a 1) |
| `objetivo_ppa`        | Objetivo individual dentro del PPA | Pertenece a PPA y profesional |
| `sesion`              | Evento de intervención grup o ind | Pertenece a profesional y entidad |
| `registro_sesion`     | Lo que le pasó a cada PCD en la sesión | Conecta sesión + PCD + ciclo |
| `objetivo_trabajado`  | Qué objetivos del PPA se abordaron en una sesión | Tabla puente muchos a muchos |
| `ficha_pcd` | Caracterización completa de la PCD | Relación 1 a 1 con pcd |

### Decisiones de diseño de BD
- Todas las tablas principales tienen `entidad_id` para soportar multi-tenant futuro
- `id` es `uuid` en todas las tablas (no autoincremental)
- `ciclo` es el eje que permite comparar evolución entre años
- Campos cualitativos se guardan como `text` en PostgreSQL

### Roles del sistema
- `coordinador`: acceso total a todos los módulos
- `profesional`: acceso a sus sesiones, objetivos y los registros de sus PCD asignadas

---

## 8. Convenciones de código

### JavaScript
- Funciones con nombre descriptivo en camelCase: `calcularResultadoGeneral()`
- Variables con `const` por defecto, `let` solo si se reasigna
- Comentarios en español, código en inglés para nombres técnicos
- Cada función tiene un comentario de una línea explicando qué hace

### CSS
- Variables en `:root` para todos los colores y tamaños
- Clases en kebab-case: `.card-profesional`, `.panel-analisis`
- Mobile-first con `@media (min-width: 768px)` para desktop

### Nombrado de etiquetas Word (docxtemplater)
- Datos personales: `{fecha}`, `{nombre}`, `{documento}`
- Preguntas: `{p1c0}` a `{p25c3}`
- Categorías: `{cat1p1}` a `{cat5equiv}`
- General: `{sumaGeneral}`, `{resultadoGeneral}`, `{tipoApoyoGeneral}`
- Profesional: `{nombreProfesional}`, `{cargoProfesional}`, `{conceptoTecnico}`

---

## 9. Archivos clave y su rol

| Archivo | Rol |
|---------|-----|
| `js/data.js` | Arreglo `preguntas[]` y `escalaCalificacion[]` |
| `js/scripts.js` | Lógica: pantallas, cálculos, panel, exportar, guardar |
| `css/styles.css` | Estilos completos con variables de color |
| `index.html` | Estructura de 3 pantallas + referencias a scripts |
| `assets/formato_tamizaje_plantilla.docx` | Plantilla Word con 155 etiquetas |
| `backend/src/controllers/pcd.controller.js` | CRUD de PCD + búsqueda por documento |
| `backend/src/controllers/tamizaje.controller.js` | Crear tamizaje en BD |
| `backend/src/controllers/profesional.controller.js` | Listar profesionales |
| `backend/src/controllers/ciclo.controller.js` | Obtener o crear ciclo activo |
| `backend/prisma/schema.prisma` | Definición completa del modelo de datos |
| `docs/diario_tecnico_incluye_plus.md` | Diario técnico del proyecto |

---

## 10. Decisiones técnicas tomadas

| Decisión | Razón |
|----------|-------|
| Librerías locales en `/libs` en vez de CDN | CDN bloqueado por ERR_BLOCKED_BY_ORB en el entorno |
| CSS propio en vez de solo Bootstrap | Bootstrap traía demasiado CSS no usado |
| 3 pantallas en una sola página (sin router) | Simplicidad en la fase inicial sin React |
| localStorage temporal para guardar | Permite probar sin backend, fácil de reemplazar |
| docxtemplater en lugar de generar PDF | El formato oficial es Word |
| uuid como PK en todas las tablas | Preparado para multi-tenant y sincronización futura |
| Tabla `ciclo` como eje central | Permite comparar evolución anual por PCD |
| `entidad_id` en tablas principales desde el inicio | Soporte multi-tenant sin migración futura |
| Migración a React solo cuando módulo 1 esté completo | Evitar debuggear lógica y framework al mismo tiempo |
| Prisma 5.22.0 (no v6 ni v7) | Prisma 7 es incompatible con Node 22 |
| CommonJS en todo el backend | ESM con Prisma 5 en Node 22 causa conflictos |
| Sin `"type": "module"` en package.json | Necesario para que CommonJS funcione correctamente |
| `GET /buscar` antes de `GET /:id` en rutas | Express lee en orden — rutas específicas antes que dinámicas |
| `select` en queries de profesionales | No exponer el campo `password` en respuestas de la API |
| Patrón "obtener o crear" en ciclo activo | El frontend no necesita saber si el ciclo ya existía |
| API-first: backend antes que frontend | El frontend necesita datos reales para probarse |
| contains + mode: insensitive en Prisma para búsqueda por nombre | Permite encontrar coincidencias parciales sin importar mayúsculas |
| <datalist> en vez de dropdown custom | Más simple, autocompletado nativo del navegador |
| `profesionalSeleccionadoNombre` declarado en scope global | Necesario para que btnGuardar y btnExportarWord puedan leerlo — variables dentro de un evento no sobreviven fuera de él |
| nivelApoyoGeneral acepta 0-4 | La equivalencia numérica incluye APOYO GENERALIZADO (4), distinto de los puntajes de preguntas (0-3) |
---

## 11. Sesión actual

## 11. Sesión actual

**Fecha:** 18 de junio de 2026

### Objetivo de la sesión
Completar el formulario HTML de registro de nueva PCD y conectarlo al backend.

### Lo que se hizo
- Secciones 2 a 7 del formulario HTML completadas
- Correcciones de UX: EPS como select (13 opciones), 7 tipos de discapacidad, categorías de apoyo como select, tipo de ayuda técnica como select, porcentaje con símbolo %
- Función registrarNuevaPcd() implementada en scripts.js con helpers bool/val/num/float
- Validación de campos obligatorios antes del fetch
- POST /api/pcd probado y funcionando — Status 201 ✅
- Console.logs de prueba eliminados
- mostrarPantallaInicio() restaurada como pantalla de arranque

### Pendientes
- Diseñar y construir menú principal (pantalla hub entre módulos)
- Definir flujo de navegación: ¿el profesional elige acción primero o busca PCD primero?
- Conectar módulo 2 — PPA

## 12. Preguntas o dudas abiertas

- [ ] ¿Base de datos en la nube desde el inicio o local primero?
- [ ] ¿El formato Word necesita página 3 completa (texto legal + firma)?
- [ ] ¿El estudio de caso va dentro del módulo PPA o es un módulo separado?
- [ ] ¿Cómo manejar el PPC para niveles extenso/generalizado vs PPA?
- [X] Definir schema completo de Prisma antes de construir el backend

---

## 13. Decisiones técnicas aprendidas en sesión

| Decisión | Razón |
|----------|-------|
| Prisma 5.22.0 (no v6 ni v7) | Prisma 7 es incompatible con Node 22 |
| CommonJS en todo el backend | ESM con Prisma 5 en Node 22 causa conflictos |
| Sin `"type": "module"` en package.json | Necesario para que CommonJS funcione |
| `prisma.config.ts` renombrado a `.bak` | Interfiere con la generación del cliente Prisma |
| `url = env("DATABASE_URL")` obligatorio en schema | Sin esta línea Prisma 5 no valida ni genera el cliente |
| Correr comandos npm/npx siempre desde `backend/` | Desde la raíz los scripts no existen |
| Rutas específicas antes que rutas con parámetros | Express lee en orden — `/buscar` antes de `/:id` |
| `select` en Prisma para no exponer `password` | Buena práctica de seguridad desde el inicio |

*Actualizado por:* Jeisson Rangel
*Proyecto iniciado:* 2026

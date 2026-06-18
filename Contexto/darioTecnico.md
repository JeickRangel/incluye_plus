# 📓 Diario Técnico — Proyecto Incluye+

> **¿Qué es un diario técnico?**
> Es un registro cronológico de lo que se hace en cada sesión de desarrollo. Sirve para tres cosas clave:
> 1. **Trazabilidad**: saber exactamente qué se hizo, cuándo y por qué.
> 2. **Aprendizaje**: documentar errores y soluciones consolida el conocimiento técnico.
> 3. **Continuidad**: permite retomar el trabajo días o semanas después sin perder contexto.
>
> En equipos profesionales este registro se complementa con commits de Git y tickets en herramientas como Jira o Linear.

---

## 📋 Plantilla para cada sesión

> Copia este bloque al inicio de cada nueva sesión y rellénalo.

```
---

## Sesión N — [Fecha]

### 🎯 Objetivo de la sesión
¿Qué querías lograr al sentarte a trabajar?

### ✅ Lo que se hizo
Lista concisa de acciones completadas.

### 🐛 Problemas encontrados y soluciones
| Problema | Causa raíz | Solución aplicada |
|----------|-----------|-------------------|
| ...      | ...       | ...               |

### 🧠 Conceptos aprendidos
Explicar con tus propias palabras algo nuevo que entendiste hoy.

### 📌 Estado al cerrar la sesión
¿Qué quedó funcionando? ¿Qué quedó pendiente?

### ⏭️ Próximo paso
La primera tarea concreta de la siguiente sesión.

---
```

---

---

## Sesión 1 — Fecha aproximada: inicio del proyecto (2026, fase inicial)

### 🎯 Objetivo de la sesión
Definir la estructura del proyecto y construir el primer prototipo funcional del Módulo 1 (Sistema de Apoyos / Tamizaje).

### ✅ Lo que se hizo
- Se definió la arquitectura inicial: HTML + CSS propio + Bootstrap 5.2 + JavaScript vanilla.
- Se creó la estructura de carpetas del proyecto (`assets/`, `css/`, `js/`, `libs/`).
- Se desarrolló el flujo de 3 pantallas dentro de un solo `index.html` (sin router, sin React).
- Se escribió `data.js` con el arreglo `preguntas[]` (25 preguntas) y `escalaCalificacion[]`.
- Se implementó la lógica de navegación entre pantallas en `scripts.js`.
- Se definió la paleta de colores con variables CSS (`--color-principal: #006064`, etc.).

### 🧠 Conceptos aprendidos

**¿Por qué una sola página (SPA sin framework)?**
En esta etapa no se usa React ni un sistema de rutas. En cambio, todas las "pantallas" son `<div>` que se muestran u ocultan con JavaScript. Esto simplifica el desarrollo inicial: no hay que configurar un framework, no hay build, y se puede abrir el archivo directamente en el navegador.

**¿Por qué librerías locales en `/libs` y no CDN?**
Normalmente las librerías externas (como `docxtemplater`) se cargan desde una URL pública (CDN). En este proyecto, el entorno bloqueaba esas solicitudes con el error `ERR_BLOCKED_BY_ORB` (un control de seguridad del navegador que bloquea recursos de origen cruzado en ciertos contextos). La solución fue descargar los archivos `.js` y servirlos localmente.

### 📌 Estado al cerrar la sesión
- Estructura de carpetas creada.
- Pantalla 1 del tamizaje con datos personales funcional.
- Sin lógica de cálculo aún.

### ⏭️ Próximo paso
Implementar las 25 preguntas de valoración y la lógica de calificación por categoría.

---

---

## Sesión 2 — Fecha aproximada: desarrollo del módulo de tamizaje

### 🎯 Objetivo de la sesión
Implementar las 25 preguntas, el cálculo por categorías y el panel de análisis de resultados.

### ✅ Lo que se hizo
- Se implementó la pantalla 2 con las 25 preguntas del sistema de apoyos (formato de grilla).
- Se creó la función `calcularResultadosPorCategoria()` que agrupa las preguntas en 5 categorías.
- Se creó la función `calcularResultadoGeneral()` que produce el nivel de apoyo global.
- Se implementó el panel de análisis con acordeón (sección expandible por categoría).
- Se añadió validación de campos obligatorios antes de avanzar de pantalla.

### 🧠 Conceptos aprendidos

**¿Qué es una función de cálculo y por qué separarla?**
`calcularResultadosPorCategoria()` es una función pura: recibe datos y devuelve un resultado, sin tocar la pantalla. Esto es una buena práctica de programación llamada *separación de responsabilidades*. Si en el futuro cambia el cálculo, solo se modifica esa función, sin tocar el código de la interfaz.

**¿Qué es un acordeón en UI?**
Es un componente de interfaz donde varias secciones pueden expandirse y colapsarse. Bootstrap 5 lo incluye de forma nativa con el componente `accordion`. Es útil para mostrar información densa (como 5 categorías de resultados) sin abrumar al usuario con todo el contenido a la vez.

**¿Qué significa "validación de campos obligatorios"?**
Antes de dejar al usuario pasar a la siguiente pantalla, el código verifica que todos los campos requeridos estén llenos. Si alguno falta, muestra un mensaje de error y detiene la navegación. Esto previene que se guarden datos incompletos en la base de datos.

### 📌 Estado al cerrar la sesión
- Pantalla 2 con las 25 preguntas funcional.
- Cálculo por categorías funcionando.
- Panel de análisis visible con acordeón.

### ⏭️ Próximo paso
Conectar los resultados con la exportación del documento Word oficial.

---

---

## Sesión 3 — Fecha aproximada: exportación del documento Word

### 🎯 Objetivo de la sesión
Generar el documento Word oficial (formato FOR-PSS-159 SDIS) a partir de los resultados del tamizaje.

### ✅ Lo que se hizo
- Se preparó la plantilla Word `formato_tamizaje_plantilla.docx` con 155 etiquetas (marcadores de posición).
- Se definió el sistema de nombrado de etiquetas: `{p1c0}` a `{p25c3}`, `{cat1p1}` a `{cat5equiv}`, etc.
- Se implementó la función de exportación usando `docxtemplater` + `PizZip` + `FileSaver.js`.
- Se verificó que el documento generado coincide con el formato oficial de la SDIS.

### 🧠 Conceptos aprendidos

**¿Cómo funciona `docxtemplater`?**
Un archivo `.docx` es en realidad un archivo ZIP que contiene XML por dentro. `docxtemplater` abre ese ZIP, busca las etiquetas `{nombreEtiqueta}` en el XML, las reemplaza con los valores reales, y vuelve a empacar todo como un nuevo `.docx`. Es como un sistema de plantillas, similar a cómo funcionan los correos automáticos personalizados.

**¿Por qué Word y no PDF?**
El formato oficial exigido por la SDIS Bogotá es el archivo `.docx`. Generarlo como PDF requeriría un servidor con LibreOffice o una librería adicional. Al mantenerlo como Word, el resultado es idéntico al formato original y no se necesita infraestructura adicional.

**¿Qué son las etiquetas y cómo se nombran?**
Las etiquetas siguen una convención específica: `{p1c0}` significa "pregunta 1, columna 0 (el valor de la calificación)". Esta consistencia permite escribir código que genera las etiquetas dinámicamente en un bucle, en lugar de escribir 155 líneas individuales.

### 📌 Estado al cerrar la sesión
- Exportación a Word funcional con todas las etiquetas correctas.
- Módulo 1 completo a nivel de frontend (sin backend aún).

### ⏭️ Próximo paso
Diseñar el backend y la base de datos para persistir los datos reales.

---

---

## Sesión 4 — Fecha aproximada: diseño del modelo de datos

### 🎯 Objetivo de la sesión
Definir el esquema completo de la base de datos antes de construir el backend.

### ✅ Lo que se hizo
- Se diseñó el ERD (Entity Relationship Diagram) con 10 tablas principales.
- Se definió `ciclo` como la tabla eje que conecta tamizaje, PPA y sesiones.
- Se decidió usar `uuid` como clave primaria en todas las tablas (en lugar de enteros autoincrementales).
- Se añadió `entidad_id` en las tablas principales para soportar multi-tenant desde el inicio.
- Se escribió el archivo DBML para visualizar el ERD en `dbdiagram.io`.
- Se definió el schema de Prisma (`schema.prisma`).

### 🧠 Conceptos aprendidos

**¿Qué es un ERD?**
Entity Relationship Diagram. Es un diagrama que muestra las tablas de una base de datos y cómo se relacionan entre sí. Es el "plano" de la base de datos, igual que un arquitecto dibuja los planos antes de construir.

**¿Por qué `uuid` y no autoincremental?**
Los IDs autoincrementales (`1, 2, 3...`) son simples pero tienen un problema: si hay varias bases de datos o servicios (multi-tenant), los IDs pueden colisionar. Un `uuid` es un identificador globalmente único (ej: `550e8400-e29b-41d4-a716-446655440000`) que no depende de ningún sistema centralizado para generarse.

**¿Qué es multi-tenant?**
Es una arquitectura donde una misma aplicación sirve a múltiples organizaciones (en este caso, múltiples fundaciones o IPS), manteniendo sus datos separados. Añadir `entidad_id` desde el inicio significa que más adelante se puede filtrar todo por organización sin rediseñar la base de datos.

**¿Qué es Prisma ORM?**
ORM = Object-Relational Mapping. Es una herramienta que permite interactuar con la base de datos usando JavaScript (objetos y funciones) en lugar de escribir SQL crudo. Prisma además genera automáticamente el cliente de TypeScript/JavaScript a partir del esquema, lo que reduce errores.

**¿Por qué `ciclo` es el eje central?**
Cada PCD tiene un ciclo de atención por año. Todos los datos (tamizaje, PPA, sesiones) pertenecen a un ciclo específico. Esto permite comparar la evolución de una persona entre el ciclo 2025 y el ciclo 2026, que es el objetivo clínico del sistema.

### 📌 Estado al cerrar la sesión
- ERD completo definido.
- Schema de Prisma listo.
- Sin backend implementado aún.

### ⏭️ Próximo paso
Crear el backend con Node.js + Express y conectarlo a PostgreSQL.

---

---

## Sesión 5 — 8 de junio de 2026

### 🎯 Objetivo de la sesión
Conectar el frontend del Módulo 1 (Tamizaje) con el backend real y validar el guardado en PostgreSQL.

### ✅ Lo que se hizo
- Se verificó el funcionamiento de Prisma Studio (interfaz visual de la base de datos).
- Se confirmó que el backend Express estaba activo con:
  - `GET /api/health` → responde con estado del servidor.
  - `POST /api/tamizaje` → recibe y guarda el tamizaje.
- Se inspeccionó el payload (los datos que envía el frontend) antes de mandarlo al backend.
- Se confirmó que el objeto enviado contenía:
  - `respuestas`: las 25 preguntas respondidas.
  - `resultadosCategoria`: los resultados de las 5 categorías.
  - `nivelApoyoGeneral` y `tipoApoyoGeneral` calculados correctamente.
- Se creó la función `guardarTamizajeBackend()` en el frontend.
- Se integró el botón "Guardar evaluación" con una llamada `POST` a `http://localhost:3000/api/tamizaje`.
- Se mantuvo `localStorage` como respaldo temporal (por si el backend no está disponible).
- Se identificó y resolvió el error `ERR_CONNECTION_REFUSED`.
- Se realizó prueba completa desde la interfaz.
- Se verificó en Prisma Studio la creación del nuevo registro en la tabla `Tamizaje`.

### 🐛 Problemas encontrados y soluciones

| Problema | Causa raíz | Solución aplicada |
|----------|-----------|-------------------|
| `ERR_CONNECTION_REFUSED` al intentar guardar | El backend no estaba corriendo (`npm run dev` estaba cerrado) | Iniciar el servidor antes de probar desde el frontend |
| Prisma 7 incompatible con Node 22 | Prisma v7 tiene cambios de ruptura con Node 22 | Usar Prisma 5.22.0 específicamente |
| Conflictos ESM vs CommonJS con Prisma 5 | `import`/`export` (ESM) causa problemas de resolución de módulos en esta configuración | Usar `require`/`module.exports` (CommonJS) en todo el backend |
| `prisma.config.ts` interfería con la generación del cliente | Prisma lee ese archivo como configuración y genera conflictos | Renombrar el archivo a `.bak` mientras no se usa |
| Prisma no encontraba el schema | El comando se ejecutó desde la raíz del proyecto en lugar de desde `backend/` | Siempre correr `npx prisma generate` desde dentro de `backend/` |

### 🧠 Conceptos aprendidos

**¿Qué es un endpoint REST?**
Un endpoint es una URL específica del servidor que realiza una acción concreta. Por ejemplo:
- `GET /api/health` → solo "lee" (consulta) el estado del servidor.
- `POST /api/tamizaje` → "escribe" (crea) un nuevo registro de tamizaje.
Los verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`) indican qué tipo de operación se hace. Esta convención se llama REST (Representational State Transfer).

**¿Qué es un payload?**
Es el cuerpo de datos que se envía en una solicitud HTTP, típicamente en formato JSON. Cuando el frontend llama a `POST /api/tamizaje`, el payload es el objeto JavaScript con las respuestas del tamizaje, convertido a texto JSON. Es como el "contenido" de un sobre: el endpoint es la dirección, el payload es la carta.

**¿Qué es `ERR_CONNECTION_REFUSED`?**
Este error significa que el navegador intentó conectarse a una dirección (ej: `localhost:3000`) pero nadie estaba escuchando en ese puerto. Es el equivalente a llamar a un teléfono que está apagado. La solución siempre es verificar que el servidor esté corriendo.

**¿Qué es Prisma Studio?**
Es una interfaz web que Prisma genera automáticamente para explorar y editar la base de datos visualmente, sin necesidad de escribir SQL. Se abre con `npx prisma studio` y es muy útil para verificar que los datos se guardaron correctamente durante el desarrollo.

**¿Qué diferencia hay entre CommonJS y ESM?**
Son dos sistemas de módulos de JavaScript:
- **CommonJS** (más antiguo): `const algo = require('./modulo')` / `module.exports = algo`
- **ESM** (más moderno): `import algo from './modulo'` / `export default algo`

Node.js soporta ambos, pero mezclarlos puede causar errores. Prisma 5 con Node 22 tiene mejor compatibilidad con CommonJS, por lo que se decidió usarlo en todo el backend para evitar conflictos.

**¿Por qué se mantiene `localStorage` como respaldo?**
`localStorage` es el almacenamiento del navegador. Si en algún momento el backend no está disponible (por ejemplo, en una demo sin internet), el frontend sigue funcionando y guarda los datos localmente. Cuando el backend esté disponible, se pueden sincronizar. Este patrón se llama *offline-first*.

### 📌 Estado al cerrar la sesión
- ✅ Frontend funcional
- ✅ Backend funcional (Express + Node.js)
- ✅ Integración frontend ↔ backend funcionando
- ✅ Persistencia en PostgreSQL confirmada
- ✅ Prisma Studio operativo

### ⏭️ Próximo paso
Eliminar los IDs hardcodeados de prueba (`cicloId` y `profesionalId`) y construir el flujo real:
1. Registrar PCD
2. Crear ciclo
3. Buscar PCD existente
4. Obtener ciclo activo
5. Realizar evaluación
6. Guardar tamizaje asociado al ciclo real

---

---

## Sesión 6 — 9 de junio de 2026

### 🎯 Objetivo de la sesión
Construir los endpoints del backend necesarios para eliminar los IDs hardcodeados (`cicloId` y `profesionalId`) del módulo de tamizaje, y verificarlos con datos reales en PostgreSQL.

### ✅ Lo que se hizo
- Se creó `profesional.controller.js` con la función `listarProfesionales()`.
- Se creó `ciclo.controller.js` con la función `obtenerOCrearCicloActivo()`.
- Se actualizó `pcd.controller.js` agregando la función `buscarPcdPorDocumento()`.
- Se creó `profesional.routes.js` con `GET /api/profesionales`.
- Se creó `ciclo.routes.js` con `GET /api/ciclos/activo/:pcdId`.
- Se actualizó `pcd.routes.js` agregando `GET /api/pcd/buscar` (antes de `/:id`).
- Se registraron las nuevas rutas en `app.js`.
- Se insertaron datos de prueba en PostgreSQL usando Prisma Studio:
  - 1 Entidad: "Marta Chacon pruebas"
  - 1 Profesional asociado a la entidad
  - 1 PCD: "Weiny Rodriguez"
- Se probaron los tres endpoints con Thunder Client y los tres respondieron 200 OK.
- Se creó el diario técnico del proyecto como archivo `.md` con sesiones reconstruidas desde el inicio.

## Sesión 7 — 12 de junio de 2026

### 🎯 Objetivo de la sesión
Conectar la pantalla de inicio con la base de datos (búsqueda de PCD por nombre, carga de profesionales) y corregir el layout CSS.

### ✅ Lo que se hizo
- Se creó `buscarPcdPorNombre()` en el backend usando `contains` + `mode: insensitive`.
- Se registró la ruta GET /api/pcd/buscar-nombre.
- Se implementó búsqueda en vivo con <datalist> en el campo "Nombre completo".
- Se creó `cargarProfesionales()` y se conectó al select de la card final.
- Se autocompleta el campo "Cargo" con la disciplina del profesional.
- Se corrigió la estructura HTML de pantalla-inicio (faltaba el div contenedor).
- Se reestructuró el CSS de esa pantalla con card/card-body/row/col-md-4.

### 🐛 Problemas encontrados y soluciones

| Problema | Causa raíz | Solución |
|----------|-----------|----------|
| `router is not defined` en controller | Línea de ruta pegada en el archivo equivocado (controller en vez de routes) | Mover la línea a pcd.routes.js |
| `pcdController is not defined` | Se usó pcdController.algo pero el patrón del proyecto importa funciones directo | Cambiar a import directo `{ buscarPcdPorNombre }` |
| `Identifier 'crearPcd' has already been declared` | Quedaron dos líneas `require` duplicadas en pcd.routes.js | Eliminar la línea duplicada, dejar solo un require |
| `Cannot read properties of null (reading 'style')` | Faltaba `<div id="pantalla-inicio">` en el HTML | Agregar el div contenedor con su cierre correspondiente |
| Layout "a lo ancho" / feo | Faltaba .card > .card-body > .row.g-3 > .col-md-4 alrededor de los inputs | Reestructurar el HTML con esas clases |
| "message channel closed" en consola | Error de extensión del navegador, no del código | Ignorar — no es un error del proyecto |

### 🧠 Conceptos aprendidos

**¿Qué es `contains` + `mode: insensitive` en Prisma?**
`contains` busca coincidencias parciales (no exactas) dentro de un texto. `mode: insensitive` hace que no importe si escribes mayúsculas o minúsculas. Juntos permiten que escribir "wei" encuentre "Weiny".

**¿Qué es `<datalist>`?**
Es un elemento HTML nativo que conecta con un `<input>` mediante el atributo `list`, mostrando sugerencias mientras el usuario escribe — sin necesidad de armar un dropdown personalizado con CSS/JS.

**Diferencia entre eventos `input` y `change`:**
`input` se dispara con cada tecla presionada (ideal para búsqueda en vivo). `change` se dispara solo cuando el valor se "confirma" (por ejemplo, al elegir una opción del datalist o al salir del campo).

**`encodeURIComponent()`:**
Convierte caracteres especiales (espacios, tildes, ñ) a un formato seguro para usar en URLs. Necesario al enviar nombres con espacios o acentos como parámetro de búsqueda.

**Patrón `find()` para relacionar datos guardados:**
Cuando guardamos una lista completa en una variable (como `profesionalesEncontrados`), podemos usar `.find()` para recuperar el objeto completo a partir de un id seleccionado, y así acceder a otros campos (como `disciplina`) sin hacer una nueva petición al servidor.

### 📌 Estado al cerrar la sesión
✅ Búsqueda de PCD por nombre con autocompletado funcionando
✅ Carga de profesionales y autocompletado de cargo funcionando
✅ Layout de pantalla de inicio corregido
⏳ IDs hardcodeados aún pendientes de reemplazar en el payload del tamizaje

### ⏭️ Próximo paso
Reemplazar los IDs hardcodeados (cicloId, profesionalId) en el payload de guardarTamizajeBackend con las variables reales: pcdSeleccionadaId, cicloActivoId, profesionalSeleccionadoId.

---

## 📖 Lecciones aprendidas — Cómo leer errores (guía de referencia)

| Tipo de error | Qué significa | Dónde mirar |
|---|---|---|
| `ReferenceError: X is not defined` | Usaste X pero no se declaró/importó en ese archivo | Revisa require/import y que el nombre coincida exactamente |
| `SyntaxError` | Algo en la estructura del código está mal (paréntesis, comas, duplicados) | Mira la línea exacta indicada |
| `TypeError: Cannot read properties of null` | Buscaste un elemento HTML que no existe en la página | Revisa que el id exista en el HTML, sin errores de tipeo |
| `ERR_CONNECTION_REFUSED` | El backend no está corriendo o se cayó | Revisa la terminal del backend |
| `404` | La ruta existe pero la URL no coincide | Revisa el archivo .routes.js, orden y nombres |
| `500` | El servidor recibió la petición pero falló al procesarla | Revisa console.error en la terminal del backend |
| "message channel closed" / errores de `chrome-extension://` | Vienen de extensiones del navegador, no del proyecto | Ignorar |

### 🐛 Problemas encontrados y soluciones

| Problema | Causa raíz | Solución aplicada |
|----------|-----------|-------------------|
| Prueba 1 devolvía `"data": []` | El `entidadId` usado en Thunder Client no coincidía con el de la BD | Verificar en Prisma Studio el UUID exacto de la Entidad |
| Prueba 2 devolvía 404 | Se estaba usando el `id` de la PCD en lugar del `entidadId` en el query param | Entender que la búsqueda necesita dos parámetros: `documento` y `entidadId` |
| Prueba 3 devolvía 404 | Se mezcló el UUID de la PCD con el de la Entidad en la URL | Usar el `id` de la tabla `Pcd`, no de la tabla `Entidad` |
| URL mal formada en Thunder Client | Se pegaron dos URLs juntas accidentalmente | Borrar el campo y pegar solo la URL correcta |
| Bug en `creado: !ciclo` | La variable ya tenía valor en ese punto, siempre devolvía `false` | Usar una variable booleana `fueCreado` separada |
| ID en blanco en Prisma Studio | Se intentó asignar un ID manual que luego se borró | Dejar el campo `id` completamente vacío — PostgreSQL lo genera automáticamente |

### 🧠 Conceptos aprendidos

**¿Por qué `/buscar` debe ir antes de `/:id` en las rutas?**
Express lee las rutas en el orden en que están registradas. Si `/:id` está primero, la palabra "buscar" se interpreta como si fuera un ID y nunca llega al controlador correcto. Las rutas más específicas siempre van antes que las rutas con parámetros dinámicos.

**¿Qué es `select` en Prisma y por qué usarlo?**
`select` le indica a Prisma qué campos traer de la base de datos. En lugar de traer todos los campos de un registro (incluyendo el `password`), se especifican solo los necesarios. Es una buena práctica de seguridad: nunca exponer datos sensibles aunque no los uses en la respuesta.

**¿Qué es la lógica "obtener o crear"?**
Es un patrón muy común en backends: primero busca si el registro existe, y si no existe lo crea en ese momento. Así el frontend no tiene que preocuparse por si el ciclo ya fue creado antes — el backend lo resuelve solo. En inglés este patrón se llama *upsert* o *find-or-create*.

**¿Qué es Thunder Client?**
Es una extensión de VS Code para hacer peticiones HTTP directamente desde el editor, sin necesidad de abrir Postman u otra aplicación. Permite probar endpoints del backend antes de conectarlos al frontend, lo que acelera el desarrollo y facilita encontrar errores.

**¿Por qué primero el backend y luego el frontend?**
El frontend necesita datos reales para probarse. Si se construye la pantalla primero, no se puede verificar que funciona porque no tiene de dónde traer los datos. Construir el backend primero (API-first) permite probar cada endpoint de forma independiente antes de conectar la interfaz.

### 📌 Estado al cerrar la sesión
- ✅ `GET /api/profesionales?entidadId=X` funcionando
- ✅ `GET /api/pcd/buscar?documento=X&entidadId=X` funcionando
- ✅ `GET /api/ciclos/activo/:pcdId` funcionando (crea el ciclo si no existe)
- ✅ Datos de prueba reales en PostgreSQL
- ✅ Diario técnico creado y actualizado
- ⏳ Frontend: pantalla de inicio antes del tamizaje (pendiente)
- ⏳ Eliminar IDs hardcodeados del frontend (pendiente)

### ⏭️ Próximo paso
Construir la pantalla de inicio del frontend que use los tres endpoints nuevos para:
1. Seleccionar el profesional desde un `<select>` cargado desde la BD
2. Buscar una PCD por número de documento
3. Obtener el ciclo activo automáticamente
4. Con esos datos reales, abrir el formulario de tamizaje sin IDs hardcodeados

---
## Sesión 8 — 16 de junio de 2026

### 🎯 Objetivo de la sesión
Reemplazar los IDs hardcodeados en el payload del tamizaje con variables dinámicas reales.

### ✅ Lo que se hizo
- Reemplazado `cicloId: "uuid-fijo"` por `cicloId: cicloActivoId`
- Reemplazado `profesionalId: "uuid-fijo"` por `profesionalId: profesionalSeleccionadoId`
- Agregada variable global `profesionalSeleccionadoNombre`
- Corregido `nivelApoyoGeneral` para aceptar equivalencia 0-4
- Corregido `btnGuardar` y `btnExportarWord` que leían input inexistente
- Corregido bug: `profesionalId` usaba `pcdSeleccionadaId` por error de tipeo en el payload

### 🐛 Problemas encontrados y soluciones

| Problema | Causa raíz | Solución |
|----------|-----------|----------|
| "Ciclo no encontrado" | cicloId llegaba como string "cicloActivoId" con comillas | Quitar comillas — usar variable, no texto |
| "Profesional no encontrado" | payload usaba `pcdSeleccionadaId` en lugar de `profesionalSeleccionadoId` | Corregir nombre de variable en el payload |
| btnGuardar no encontraba nombreProfesional | El input fue reemplazado por un select, pero el código seguía buscando el input viejo | Leer `profesionalSeleccionadoNombre` en lugar del input |
| nivelApoyoGeneral rechazaba valor 4 | Validación solo incluía `[0,1,2,3]` | Agregar 4 a la validación — APOYO GENERALIZADO es equivalencia 4 |
| profesionalSeleccionadoNombre no disponible en btnGuardar | Variable declarada dentro del evento change — moría al terminar el evento | Declarar en scope global junto a las otras variables |

### 🧠 Conceptos aprendidos

**¿Qué es el scope?**
El scope (alcance) define dónde vive una variable. Una variable declarada dentro de un evento `{}` solo existe mientras ese evento se ejecuta. Si otro evento necesita ese valor, la variable debe declararse afuera, en un scope compartido.

**Diferencia entre un string y una variable:**
`"cicloActivoId"` es texto literal — siempre vale eso. `cicloActivoId` es una variable — vale lo que se le haya asignado. Las comillas son la diferencia entre mandar el nombre y mandar el valor.

**¿Por qué usar console.log con JSON.stringify?**
`console.log("obj:", objeto)` muestra `Object` — hay que hacer clic para expandir. `JSON.stringify(objeto)` convierte el objeto a texto plano visible de inmediato, lo que acelera la depuración.

### 📌 Estado al cerrar la sesión
✅ Módulo 1 completamente funcional end-to-end
✅ Tamizaje guardado en BD con IDs correctos
✅ Exportar Word funcionando

### ⏭️ Próximo paso
Construir el formulario de registro de nueva PCD (caso "PCD no existe") y comenzar Módulo 2 — PPA.
---

## 📚 Glosario técnico del proyecto

> Referencia rápida de términos que aparecen en el diario.

| Término | Definición sencilla |
|---------|---------------------|
| **Backend** | La parte del software que corre en el servidor. Recibe solicitudes, procesa datos y habla con la base de datos. El usuario nunca lo ve directamente. |
| **Frontend** | La parte visible del software: HTML, CSS, JavaScript que corre en el navegador del usuario. |
| **API** | Interfaz de Programación de Aplicaciones. Es el conjunto de endpoints que el frontend usa para comunicarse con el backend. |
| **REST** | Estilo de arquitectura para APIs. Usa URLs y verbos HTTP (GET, POST, PUT, DELETE) para definir operaciones. |
| **Endpoint** | Una URL específica del backend que realiza una acción concreta. |
| **Payload** | Los datos que se envían en el cuerpo de una solicitud HTTP, generalmente en formato JSON. |
| **JSON** | JavaScript Object Notation. Formato de texto para intercambiar datos entre sistemas. `{"nombre": "Juan", "edad": 30}` |
| **PostgreSQL** | Sistema de base de datos relacional (tablas, filas, columnas). Robusto, gratuito y muy usado en producción. |
| **Prisma** | ORM para Node.js. Permite interactuar con PostgreSQL usando JavaScript sin escribir SQL. |
| **Prisma Studio** | Interfaz visual generada por Prisma para explorar y editar la base de datos desde el navegador. |
| **ORM** | Object-Relational Mapping. Capa de abstracción que traduce objetos JavaScript a operaciones de base de datos. |
| **UUID** | Identificador único universal. Cadena larga y aleatoria que garantiza unicidad sin necesidad de un contador central. |
| **Multi-tenant** | Arquitectura donde una misma aplicación sirve a múltiples organizaciones con datos separados. |
| **ERD** | Diagrama de entidades y relaciones. El "plano" de la base de datos. |
| **Migration** | Cambio controlado en la estructura de la base de datos. Prisma los genera automáticamente. |
| **CommonJS** | Sistema de módulos de Node.js que usa `require()` y `module.exports`. |
| **ESM** | ES Modules, sistema moderno de módulos que usa `import` y `export`. |
| **LocalStorage** | Almacenamiento del navegador. Persiste datos entre recargas pero solo en ese dispositivo. |
| **CDN** | Content Delivery Network. Servidores que distribuyen librerías JS públicas. |
| **docxtemplater** | Librería JS que reemplaza etiquetas `{campo}` en archivos Word con datos reales. |
| **Commit** | Punto de guardado en Git. Registra qué archivos cambiaron y con qué mensaje. |
| **localhost** | Dirección que apunta al propio computador. `localhost:3000` = "el servidor que corre en mi máquina en el puerto 3000". |
| **Puerto** | Canal de comunicación de red. Una misma máquina puede tener muchos servicios corriendo en puertos distintos. |
| **Express** | Framework de Node.js para construir servidores web y APIs de forma sencilla. |

---

## Sesión 9 — 17 de junio de 2026

### 🎯 Objetivo
Construir el formulario de registro de nueva PCD.

### ✅ Lo que se hizo
- Diseñada estructura de dos tablas: Pcd (identidad) + FichaPcd (caracterización)
- Schema de Prisma actualizado y migración aplicada
- pcd.controller.js reescrito sin IDs hardcodeados ni module.exports duplicado
- POST /api/pcd crea PCD + FichaPcd + Ciclo en una sola transacción
- index.html corregido: estaba duplicado, pantalla-registro ahora es pantalla independiente

### 🐛 Problemas encontrados
| Problema | Causa | Solución |
|----------|-------|----------|
| Error P1012 en migración | FichaPcd referenciada antes de existir en el schema | El modelo ya estaba — era problema de entorno |
| Migración fallaba con 2 filas existentes | Columnas nuevas NOT NULL sin default | Editar migration.sql manualmente agregando DEFAULT |
| EPERM al generar cliente Prisma | Archivo bloqueado por Windows | Cerrar y reabrir VS Code |
| index.html duplicado | Se pegó el contenido dos veces | Reemplazar con archivo limpio |

### 🧠 Conceptos aprendidos
- Una migración se puede editar manualmente antes de aplicarse usando --create-only
- DEFAULT en SQL permite agregar columnas NOT NULL a tablas con datos existentes
- Las pantallas deben tener class="pantalla" para que el JS las pueda mostrar/ocultar

### ⏭️ Próximo paso
1. Secciones 2 a 7 del formulario HTML (datos socioeconómicos, discapacidad, sistema de apoyos, cuidado, conducta, referente familiar)
2. JavaScript para recoger todos los campos y hacer POST /api/pcd
3. Botón en pantalla-inicio que lleve a pantalla-registro cuando la PCD no existe

*Proyecto iniciado: 2026 — Autor: Jeisson Rangel*
*Actualizar al finalizar cada sesión de trabajo.*

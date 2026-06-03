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
| Almacenamiento            | localStorage (temporal)                               |
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
│   └── formato_tamizaje_plantilla.docx   # Plantilla Word con etiquetas
├── Contexto
│   └── CONTEXT.md                  # Este archivo
├── css/
│   └── styles.css              # CSS propio limpio con variables
├── js/
│   ├── data.js                 # Preguntas, escala de calificación
│   └── scripts.js              # Lógica principal
├── libs/                       # Librerías locales (sin CDN)
│   ├── pizzip.min.js
│   ├── docxtemplater.js
│   └── FileSaver.min.js
└── index.html                  # Página principal (tamizaje)
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
│   │   ├── models/         # Prisma schemas
│   │   └── middleware/
│   └── prisma/
└── CONTEXT.md
```

## 6. Modelo de datos — ERD

### Tablas principales y relaciones

| Tabla                 | Descripción               | Relaciones clave |
|-----------------------|---------------------------|-----------------|
| `entidad`             | Fundación o IPS           | Tiene muchos profesionales y PCD |
| `profesional`         | Usuario del sistema       | Pertenece a entidad, tiene rol |
| `pcd`                 | Persona con discapacidad  | Pertenece a entidad, tiene ciclos |
| `ciclo`               | Año de atención de una PCD|Eje central — conecta tamizaje, PPA y sesiones|
| `tamizaje`            | Resultado del sistema de apoyos | Pertenece a ciclo y profesional |
| `ppa`                 | Plan Personalizado de Apoyo | Uno por ciclo (relación 1 a 1) |
| `objetivo_ppa`        | Objetivo individual dentro del PPA | Pertenece a PPA y profesional |
| `sesion`              | Evento de intervención grup o ind | Pertenece a profesional y entidad |
| `registro_sesion`     | Lo que le pasó a cada PCD en la sesión | Conecta sesión + PCD + ciclo |
| `objetivo_trabajado`  | Qué objetivos del PPA se abordaron en una sesión | Tabla puente muchos a muchos |

### Decisiones de diseño de BD
- Todas las tablas principales tienen `entidad_id` para soportar multi-tenant futuro
- `id` es `uuid` en todas las tablas (no autoincremental)
- `ciclo` es el eje que permite comparar evolución entre años
- Campos cualitativos (observaciones, descripciones) se guardan como `text` en PostgreSQL
- El archivo DBML para dbdiagram.io está en `/docs/incluye_plus_erd.dbml`

### Roles del sistema
- `coordinador`: acceso total a todos los módulos
- `profesional`: acceso a sus sesiones, objetivos y los registros de sus PCD asignadas

---

## 7. Convenciones de código

### JavaScript
- Funciones con nombre descriptivo en camelCase: `calcularResultadoGeneral()`
- Variables con `const` por defecto, `let` solo si se reasigna
- Comentarios en español, código en inglés para nombres técnicos
- Cada función tiene un comentario de una línea explicando qué hace

### CSS
- Variables en `:root` para todos los colores y tamaños
- Clases en kebab-case: `.card-profesional`, `.panel-analisis`
- Agrupar por sección con comentarios: `/* NAVBAR */`, `/* CARDS */`
- Mobile-first con `@media (min-width: 768px)` para desktop

### HTML
- IDs para elementos únicos referenciados en JS: `id="btnIniciar"`
- Clases para estilos reutilizables: `class="btn btn-primary"`
- Comentarios de sección: `<!-- PANTALLA 1: INICIO -->`

### Nombrado de etiquetas Word (docxtemplater)
- Datos personales: `{fecha}`, `{nombre}`, `{documento}`
- Preguntas: `{p1c0}` a `{p25c3}` (pregunta N, columna valor)
- Matriz: `{cat1p1}` a `{cat5equiv}`
- General: `{sumaGeneral}`, `{divisionGeneral}`, `{calculoGeneral}`, `{resultadoGeneral}`, `{tipoApoyoGeneral}`
- Profesional: `{nombreProfesional}`, `{cargoProfesional}`, `{conceptoTecnico}`

---

## 8. Archivos clave y su rol

| Archivo                                   | Rol |
|---------                                  |-----|
| `js/data.js`                              | Arreglo `preguntas[]`y arreglo `escalaCalificacion[]` |
| `js/scripts.js`                           | Toda la lógica: pantallas, cálculos, panel, exportar, guardar |
| `css/styles.css`                          | Estilos completos con variables de color |
| `index.html`                              | Estructura de 3 pantallas + referencias a scripts |
| `assets/formato_tamizaje_plantilla.docx`  | Plantilla Word con 155 etiquetas insertadas |
| `docs/incluye_plus_erd.dbml`              | Diagrama de base de datos para dbdiagram.io |

---

## 9. Decisiones técnicas tomadas

| Decisión                                     | Razón |
|----------                                    |-------|
| Librerías locales en `/libs` en vez de CDN   | CDN bloqueado por ERR_BLOCKED_BY_ORB en el entorno |
| CSS propio en vez de solo Bootstrap          | Bootstrap traía demasiado CSS no usado |
| 3 pantallas en una sola página (sin router)  | Simplicidad en la fase inicial sin React |
| localStorage temporal para guardar           | Permite probar sin backend, fácil de reemplazar |
| docxtemplater en lugar de generar PDF desde cero | El formato oficial es Word, resultado idéntico al original |
| uuid como PK en todas las tablas             | Preparado para multi-tenant y sincronización futura |
| Tabla `ciclo` como eje central               | Permite comparar evolución anual por PCD |
| `entidad_id` en tablas principales desde el inicio | Soporte multi-tenant sin migración futura |
| Migración a React solo cuando módulo 1 esté completo y probado | Evitar debuggear lógica y framework al mismo tiempo |

---

## 10. Sesión actual

**Fecha:** 2 de junio de 2026
**Objetivo de la sesión:** Planear ciclo de vida del software y diseñar el ERD
**Lo que se hizo:**
- Redefinición del alcance real del sistema
- Diseño del ERD completo con 10 tablas
- Archivo DBML generado para dbdiagram.io
- CONTEXT.md actualizado
**Pendiente para próxima sesión:** Generar schema de Prisma
**Archivos modificados:** CONTEXT.md, docs/incluye_plus_erd.dbml

---

## 11. Preguntas o dudas abiertas

- [ ] ¿Base de datos en la nube desde el inicio o local primero?
- [ ] ¿El formato Word necesita página 3 completa (texto legal + firma)?
- [ ] ¿El estudio de caso va dentro del módulo PPA o es un módulo separado?
- [ ] ¿Cómo manejar el PPC (Plan Personalizado de Cuidado) para niveles extenso/generalizado vs PPA?
- [ ] Definir schema completo de Prisma antes de construir el backend

---

*Actualizado por:* Jeisson Rangel
*Proyecto iniciado:* 2026
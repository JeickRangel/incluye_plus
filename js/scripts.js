window.addEventListener("DOMContentLoaded", () => {
 
    const questionContainer = document.getElementById("question-container");
    const btnAnterior       = document.getElementById("btnAnterior");
    const btnSiguiente      = document.getElementById("btnSiguiente");
    const textoProgreso     = document.getElementById("textoProgreso");
    const barraProgreso     = document.getElementById("barraProgreso");
    const categoriaActual   = document.getElementById("categoriaActual");
    const resultadoFinal    = document.getElementById("resultado-final");
    // ID temporal de la entidad — luego vendrá del login (JWT)
    const ENTIDAD_ID = "4eb51e92-cdcd-4918-b416-4a07ab35c12d";
    document.getElementById("btnRegistrarPcd").addEventListener("click", registrarNuevaPcd);

    // Variables globales para guardar los datos seleccionados en pantalla 0
    let profesionalSeleccionadoId = null;
    let pcdSeleccionadaId = null;
    let cicloActivoId = null;
    let profesionalSeleccionadoNombre = null; // ← agregar esto
    let indiceActual = 0;
    let respuestas   = [];
 
    const categoriasMatriz = [
        { numero: 1, nombrePantalla: "Aprendizaje y conocimiento",          nombreMatriz: "Categoría 1. Aprendizaje y conocimiento",          inicio: 1,  fin: 5  },
        { numero: 2, nombrePantalla: "Comunicación, lenguaje y pensamiento", nombreMatriz: "Categoría 2. Comunicación, lenguaje y pensamiento", inicio: 6,  fin: 10 },
        { numero: 3, nombrePantalla: "Vida cotidiana",                       nombreMatriz: "Categoría 3. Independencia y autonomía",           inicio: 11, fin: 15 },
        { numero: 4, nombrePantalla: "Participación social",                 nombreMatriz: "Categoría 4. Participación social",                inicio: 16, fin: 20 },
        { numero: 5, nombrePantalla: "Movilidad",                            nombreMatriz: "Categoría 5. Movilidad",                          inicio: 21, fin: 25 }
    ];
 
    // =========================
    // FUNCIONES AUXILIARES
    // =========================
    function obtenerCategoriaPorId(id) {
        return categoriasMatriz.find(c => id >= c.inicio && id <= c.fin) || null;
    }
    function obtenerCategoria(p) {
        const c = obtenerCategoriaPorId(p.id);
        return c ? c.nombrePantalla : (p.categoria || "Sin categoría").trim();
    }
    function obtenerPregunta(p)     { return p.pregunta || "Pregunta no disponible"; }
    function obtenerOrientadoras(p) { return Array.isArray(p.orientadoras) ? p.orientadoras : []; }
    function formatearFecha(f) {
        if (!f) return "";
        const p = f.split("-");
        return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : f;
    }
    function generarCeldasPreguntas() {
        const c = {};
        for (let i = 1; i <= 25; i++) {
            const r = respuestas.find(r => r.idPregunta === i);
            const v = r?.valor;
            c[`p${i}c0`] = v === 0 ? "0" : "";
            c[`p${i}c1`] = v === 1 ? "1" : "";
            c[`p${i}c2`] = v === 2 ? "2" : "";
            c[`p${i}c3`] = v === 3 ? "3" : "";
        }
        return c;
    }
 
    // =========================
    // PANTALLAS
    // =========================
    function mostrarPantallaInicio() {
        document.getElementById("pantalla-inicio").style.display     = "block";
        document.getElementById("pantalla-evaluacion").style.display = "none";
        document.getElementById("pantalla-resultado").style.display  = "none";
    }
    function mostrarPantallaEvaluacion() {
        document.getElementById("pantalla-inicio").style.display     = "none";
        document.getElementById("pantalla-evaluacion").style.display = "block";
        document.getElementById("pantalla-resultado").style.display  = "none";
        const nombre = document.getElementById("nombre")?.value || "";
        const el = document.getElementById("navbar-nombre-pcd");
        if (el) el.textContent = nombre ? `Evaluando: ${nombre}` : "";
    }
    function mostrarPantallaResultado() {
        document.getElementById("pantalla-inicio").style.display     = "none";
        document.getElementById("pantalla-evaluacion").style.display = "none";
        document.getElementById("pantalla-resultado").style.display  = "block";
    }
    function mostrarPantallaRegistro() {
        document.getElementById("pantalla-inicio").style.display    = "none";
        document.getElementById("pantalla-evaluacion").style.display = "none";
        document.getElementById("pantalla-resultado").style.display  = "none";
        document.getElementById("pantalla-registro").style.display   = "block";
    }
 
    // =========================
    // BUSCAR PCD POR NOMBRE (en vivo, datalist)
    // =========================
    let pcdsEncontrados = [];

    document.getElementById("nombre")?.addEventListener("input", async (e) => {
        const texto = e.target.value.trim();
        const lista = document.getElementById("listaPcds");

        if (texto.length === 0) {
            lista.innerHTML = "";
            pcdsEncontrados = [];
            return;
        }

        try {
            const resp = await fetch(`http://localhost:3000/api/pcd/buscar-nombre?nombre=${encodeURIComponent(texto)}&entidadId=${ENTIDAD_ID}`);
            const data = await resp.json();
            pcdsEncontrados = data.data;

            lista.innerHTML = pcdsEncontrados
                .map(p => `<option value="${p.nombre}">${p.nombre} — Doc: ${p.documento}</option>`)
                .join("");
        } catch (err) {
            console.error("Error buscando PCD por nombre:", err);
        }
    });

    document.getElementById("nombre")?.addEventListener("change", (e) => {
        const seleccionado = pcdsEncontrados.find(p => p.nombre === e.target.value);
        if (!seleccionado) return;

        document.getElementById("documento").value = seleccionado.documento;
        pcdSeleccionadaId = seleccionado.id;
        cicloActivoId = seleccionado.cicloActivo ? seleccionado.cicloActivo.id : null;

        console.log("cicloActivoId:", cicloActivoId);    

        if (!cicloActivoId) {
            console.warn("Esta PCD no tiene ciclo activo (EN_CURSO).");
        }
    });

    // Busca PCDs cuyo nombre contenga el texto (ignora mayúsculas/minúsculas)
async function buscarPcdPorNombre(req, res) {
  const { nombre, entidadId } = req.query;
  try {
    const pcds = await prisma.pcd.findMany({
      where: {
        entidadId,
        nombre: { contains: nombre, mode: 'insensitive' }
      },
      select: { id: true, nombre: true, documento: true }
    });
    res.json({ data: pcds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

    // =========================
    // CARGAR PROFESIONALES (select al finalizar)
    // =========================
    let profesionalesEncontrados = [];

    async function cargarProfesionales() {
        const select = document.getElementById("selectProfesional");
        try {
            const resp = await fetch(`http://localhost:3000/api/profesionales?entidadId=${ENTIDAD_ID}`);
            const data = await resp.json();
            profesionalesEncontrados = data.data;
            console.log("Profesionales cargados:", JSON.stringify(profesionalesEncontrados));

            select.innerHTML = '<option value="">Seleccione...</option>';
            profesionalesEncontrados.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id;
                opt.textContent = p.nombre;
                select.appendChild(opt);
            });
        } catch (err) {
            select.innerHTML = '<option value="">Error al cargar</option>';
            console.error("Error cargando profesionales:", err);
        }
    }

    document.getElementById("selectProfesional")?.addEventListener("change", (e) => {
        const seleccionado = profesionalesEncontrados.find(p => p.id === e.target.value);
        if (!seleccionado) return;

        document.getElementById("cargoProfesional").value = seleccionado.disciplina;
        profesionalSeleccionadoId = seleccionado.id;
        profesionalSeleccionadoNombre = seleccionado.nombre;
    });

    // =========================
    // RENDERIZAR PREGUNTA
    // =========================
    function renderizarPregunta() {
        const p  = preguntas[indiceActual];
        const nc = obtenerCategoria(p);
        const tp = obtenerPregunta(p);
        const or = obtenerOrientadoras(p);
 
        textoProgreso.textContent   = `Pregunta ${indiceActual + 1} de ${preguntas.length}`;
        categoriaActual.textContent = nc;
        const pct = Math.round(((indiceActual + 1) / preguntas.length) * 100);
        barraProgreso.style.width   = `${pct}%`;
        barraProgreso.textContent   = `${pct}%`;
 
        const rg = respuestas.find(r => r.idPregunta === p.id);
 
        questionContainer.innerHTML = `
            <div class="evaluacion-grid">
                <div class="col-pregunta">
                    <p class="label-seccion">Pregunta</p>
                    <p class="texto-pregunta">${tp}</p>
                    <p class="label-seccion" style="margin-top:1.25rem">Seleccione la calificación</p>
                    <div class="opciones-grid">
                        ${escalaCalificacion.map(op => `
                            <div class="card opcion-card ${rg && rg.valor === op.valor ? 'seleccionada' : ''}" data-valor="${op.valor}">
                                <div class="card-body">
                                    <h6 class="fw-bold">${op.titulo}</h6>
                                    <p class="mb-0">${op.descripcion}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
                <div class="col-orientadoras">
                    <p class="label-seccion">Preguntas orientadoras</p>
                    <ul class="lista-orientadoras">
                        ${or.length > 0
                            ? or.map(i => `<li>${i}</li>`).join("")
                            : `<li class="sin-orientadoras">No hay preguntas orientadoras registradas.</li>`}
                    </ul>
                </div>
            </div>`;
 
        activarEventosOpciones();
        actualizarBotones();
    }
 
    function activarEventosOpciones() {
        document.querySelectorAll(".opcion-card").forEach(card => {
            card.addEventListener("click", () => {
                document.querySelectorAll(".opcion-card").forEach(c => c.classList.remove("seleccionada"));
                card.classList.add("seleccionada");
            });
        });
    }
 
    function actualizarBotones() {
        btnAnterior.disabled     = indiceActual === 0;
        btnSiguiente.textContent = indiceActual === preguntas.length - 1 ? "Finalizar" : "Siguiente →";
    }
 
    function guardarRespuestaActual() {
        const p  = preguntas[indiceActual];
        const op = document.querySelector(".opcion-card.seleccionada");
        if (!op) { alert("Debes seleccionar una calificación antes de continuar."); return false; }
        const v   = Number(op.dataset.valor);
        const ex  = respuestas.find(r => r.idPregunta === p.id);
        const cat = obtenerCategoria(p);
        if (ex) { ex.valor = v; ex.pregunta = obtenerPregunta(p); ex.categoria = cat; }
        else     respuestas.push({ idPregunta: p.id, categoria: cat, pregunta: obtenerPregunta(p), valor: v });
        return true;
    }
 
    // =========================
    // CÁLCULOS
    // =========================
    function obtenerTipoApoyoCategoria(pct) {
        if (pct < 5)                   return { tipo: "NO REQUIERE APOYO",  equivalencia: 0 };
        if (pct >= 5  && pct <= 24)    return { tipo: "APOYO INTERMITENTE", equivalencia: 1 };
        if (pct >= 25 && pct <= 50)    return { tipo: "APOYO LIMITADO",     equivalencia: 2 };
        if (pct >= 51 && pct <= 84)    return { tipo: "APOYO EXTENSO",      equivalencia: 3 };
        return                                { tipo: "APOYO GENERALIZADO", equivalencia: 4 };
    }
    function obtenerTipoApoyoGeneral(pct) {
        if (pct < 5)                   return { tipo: "NO REQUIERE APOYO",  equivalencia: 0 };
        if (pct >= 5  && pct <= 24)    return { tipo: "APOYO INTERMITENTE", equivalencia: 1 };
        if (pct >= 25 && pct <= 49)    return { tipo: "APOYO LIMITADO",     equivalencia: 2 };
        if (pct >= 50 && pct <= 84)    return { tipo: "APOYO EXTENSO",      equivalencia: 3 };
        return                                { tipo: "APOYO GENERALIZADO", equivalencia: 4 };
    }
 
    function calcularResultadosPorCategoria() {
        return categoriasMatriz.map(cb => {
            const rc  = respuestas.filter(r => r.idPregunta >= cb.inicio && r.idPregunta <= cb.fin).sort((a,b) => a.idPregunta - b.idPregunta);
            const val = rc.map(r => r.valor);
            const suma  = val.reduce((a,n) => a+n, 0);
            const ceros = val.filter(v => v === 0).length;
            const div   = ceros >= 2 ? 12 : 15;
            const pct   = Number(((suma / div) * 100).toFixed(2));
            const ta    = obtenerTipoApoyoCategoria(pct);
            return {
                categoria: cb.nombreMatriz, nombrePantalla: cb.nombrePantalla,
                pregunta1: val[0]??"", pregunta2: val[1]??"", pregunta3: val[2]??"",
                pregunta4: val[3]??"", pregunta5: val[4]??"",
                suma, ceros, division: div, porcentaje: pct,
                tipoApoyo: ta.tipo, equivalencia: ta.equivalencia
            };
        });
    }
 
    function calcularResultadoGeneral(rc) {
        const eq   = rc.map(r => r.equivalencia);
        const sg   = eq.reduce((a,n) => a+n, 0);
        const cg   = eq.filter(v => v === 0).length;
        const dg   = cg >= 2 ? 16 : 20;
        const calc = Number((sg / dg).toFixed(4));
        const pct  = Number((calc * 100).toFixed(2));
        const ta   = obtenerTipoApoyoGeneral(pct);
        return { sumaGeneral: sg, cantidadCerosGeneral: cg, divisionGeneral: dg,
                 calculoGeneral: calc, porcentajeGeneral: pct,
                 tipoApoyoGeneral: ta.tipo, equivalenciaGeneral: ta.equivalencia };
    }
 
    // =========================
    // PANEL DE ANÁLISIS
    // Críticas:  puntaje 3 (primero) y 2 (después)
    // Moderadas: puntaje 1
    // Sin apoyo: puntaje 0
    // =========================
    function generarPanelAnalisis(rc, rg) {
 
        // Separar respuestas por puntaje exacto
        const pregs3 = respuestas.filter(r => r.valor === 3).sort((a,b) => a.idPregunta - b.idPregunta);
        const pregs2 = respuestas.filter(r => r.valor === 2).sort((a,b) => a.idPregunta - b.idPregunta);
        const pregs1 = respuestas.filter(r => r.valor === 1).sort((a,b) => a.idPregunta - b.idPregunta);
        const pregs0 = respuestas.filter(r => r.valor === 0).sort((a,b) => a.idPregunta - b.idPregunta);
 
        // Renderiza una lista de preguntas con su badge de color
        function renderItems(lista, bgBadge, colorBadge) {
            return lista.map(r => `
                <li class="acord-item-preg">
                    <span class="acord-badge" style="background:${bgBadge};color:${colorBadge}">Puntaje ${r.valor}</span>
                    <span>${r.pregunta}</span>
                </li>`).join("");
        }
 
        // Construye una sección del acordeón
        function seccion(id, icono, titulo, resumen, colores, htmlItems) {
            if (!htmlItems) return "";
            return `
            <div class="acord-item" style="border-left:4px solid ${colores.borde}">
                <button class="acord-btn" onclick="toggleAcordeon('${id}')"
                    style="background:${colores.bg}">
                    <div class="acord-btn-izq">
                        <span class="acord-icono">${icono}</span>
                        <div>
                            <p class="acord-titulo" style="color:${colores.titulo}">${titulo}</p>
                            <p class="acord-resumen" style="color:${colores.cats}">${resumen}</p>
                        </div>
                    </div>
                    <span class="acord-flecha" id="flecha-${id}" style="color:${colores.titulo}">▼</span>
                </button>
                <div class="acord-contenido" id="contenido-${id}">
                    <ul class="acord-lista">${htmlItems}</ul>
                </div>
            </div>`;
        }
 
        // Críticas: puntaje 3 primero, luego puntaje 2
        const htmlCriticas = pregs3.length > 0 || pregs2.length > 0
            ? renderItems(pregs3, "#FCEBEB", "#A32D2D") + renderItems(pregs2, "#FAEEDA", "#854F0B")
            : null;
 
        // Moderadas: solo puntaje 1
        const htmlModeradas = pregs1.length > 0
            ? renderItems(pregs1, "#FFF8E1", "#7B5A00")
            : null;
 
        // Sin apoyo: solo puntaje 0
        const htmlSinApoyo = pregs0.length > 0
            ? renderItems(pregs0, "#EAF3DE", "#3B6D11")
            : null;
 
        return `
        <div class="panel-analisis">
            <h4 class="panel-titulo">Análisis de resultados</h4>
            <p class="panel-intro">Resumen automático para apoyar la redacción del concepto técnico.</p>
 
            <div class="acord-grupo">
                ${seccion("criticas", "🔴", "Áreas críticas",
                    `${pregs3.length} aspecto(s) con puntaje 3 &nbsp;·&nbsp; ${pregs2.length} aspecto(s) con puntaje 2`,
                    { bg:"#FCEBEB", borde:"#E24B4A", titulo:"#A32D2D", cats:"#791F1F" },
                    htmlCriticas)}
 
                ${seccion("moderadas", "🟡", "Áreas moderadas",
                    `${pregs1.length} aspecto(s) con puntaje 1`,
                    { bg:"#FAEEDA", borde:"#EF9F27", titulo:"#854F0B", cats:"#633806" },
                    htmlModeradas)}
 
                ${seccion("sin-apoyo", "🟢", "Sin necesidad de apoyo",
                    `${pregs0.length} aspecto(s) con puntaje 0`,
                    { bg:"#EAF3DE", borde:"#639922", titulo:"#3B6D11", cats:"#27500A" },
                    htmlSinApoyo)}
            </div>
 
            <div class="panel-general">
                <div>
                    <p class="panel-general-label">Resultado general</p>
                    <p class="panel-general-tipo">${rg.tipoApoyoGeneral} — ${rg.porcentajeGeneral}%</p>
                </div>
                <div style="text-align:right">
                    <p class="panel-general-label">Suma general</p>
                    <p class="panel-general-num">${rg.sumaGeneral} / ${rg.divisionGeneral}</p>
                </div>
            </div>
        </div>`;
    }
 
    window.toggleAcordeon = function(id) {
        const c = document.getElementById(`contenido-${id}`);
        const f = document.getElementById(`flecha-${id}`);
        const abierto = c.classList.contains("abierto");
        c.classList.toggle("abierto", !abierto);
        f.textContent = abierto ? "▼" : "▲";
    };
 
    // Recoge todos los campos del formulario y envía POST /api/pcd
async function registrarNuevaPcd() {

    // ── Helpers ──────────────────────────────────────────
    // Convierte "true"/"false" string a booleano real
    const bool = id => document.getElementById(id)?.value === "true";
    // Lee el valor de un campo de texto o select
    const val  = id => document.getElementById(id)?.value.trim() || null;
    // Lee un número entero, devuelve null si está vacío
    const num  = id => {
        const v = document.getElementById(id)?.value;
        return v !== "" && v !== null && v !== undefined ? parseInt(v) : null;
    };
    // Lee un número decimal
    const float = id => {
        const v = document.getElementById(id)?.value;
        return v !== "" && v !== null && v !== undefined ? parseFloat(v) : null;
    };

    // ── Bloque pcd (tabla Pcd) ────────────────────────────
    const datosPcd = {
        entidadId: ENTIDAD_ID,   // variable global — igual que cicloActivoId
        tipoDocumento:   val("reg-tipoDocumento"),
        documento:       val("reg-documento"),
        nombre:          val("reg-nombre"),
        fechaNacimiento: val("reg-fechaNacimiento"),
        etapaCicloVital: val("reg-etapaCicloVital"),
        fechaIngresoSDIS:val("reg-fechaIngresoSDIS"),
        sexo:            val("reg-sexo"),
        estadoCivil:     val("reg-estadoCivil"),
    };

    // ── Bloque ficha (tabla FichaPcd) ─────────────────────
    const datosFicha = {
        // Socioeconómicos
        tieneHijos:              bool("reg-tieneHijos"),
        nivelEducativo:          val("reg-nivelEducativo"),
        estudiaActualmente:      bool("reg-estudiaActualmente"),
        regimensSalud:           val("reg-regimenSalud"),
        nombreEps:               val("reg-nombreEps"),
        antecedentesHabitaCalle: bool("reg-antecedentesHabitaCalle"),
        perteneceGrupoEtnico:    bool("reg-perteneceGrupoEtnico"),
        perteneceGrupoLgbti:     bool("reg-perteneceGrupoLgbti"),
        victimaConflicto:        bool("reg-victimaConflicto"),
        // Discapacidad
        tipoDiscapacidad:        val("reg-tipoDiscapacidad"),
        diagnosticoCognitivo:    val("reg-diagnosticoCognitivo"),
        diagnosticoMental:       val("reg-diagnosticoMental"),
        diagnosticoNeurologico:  val("reg-diagnosticoNeurologico"),
        diagnosticoSensorial:    val("reg-diagnosticoSensorial"),
        // Sistema de apoyos
        sistemaApoyoGeneral:     val("reg-sistemaApoyoGeneral"),
        porcentajeSistemaApoyo:  float("reg-porcentajeSistemaApoyo"),
        catAprendizaje:          val("reg-catAprendizaje"),
        catComunicacion:         val("reg-catComunicacion"),
        catIndependencia:        val("reg-catIndependencia"),
        catParticipacion:        val("reg-catParticipacion"),
        catMovilidad:            val("reg-catMovilidad"),
        // Cuidado
        requiereOxigeno:         bool("reg-requiereOxigeno"),
        numMedicamentos:         num("reg-numMedicamentos"),
        enuresis:                val("reg-enuresis"),
        recibePaniales:          bool("reg-recibePaniales"),
        cantidadPanialesMes:     num("reg-cantidadPanialesMes"),
        requiereCuraciones:      bool("reg-requiereCuraciones"),
        // Conductuales
        autoagresividad:         bool("reg-autoagresividad"),
        heteroagresividad:       bool("reg-heteroagresividad"),
        destruccionObjetos:      bool("reg-destruccionObjetos"),
        conductasEscapistas:     bool("reg-conductasEscapistas"),
        movimientosRepetitivos:  bool("reg-movimientosRepetitivos"),
        // Ayudas técnicas
        requiereAyudaTecnica:    bool("reg-requiereAyudaTecnica"),
        tipoAyudaTecnica:        val("reg-tipoAyudaTecnica"),
        tenenciaAyudaTecnica:    val("reg-tenenciaAyudaTecnica"),
        // Referente familiar
        nombreReferente:         val("reg-nombreReferente"),
        documentoReferente:      val("reg-documentoReferente"),
        parentescoReferente:     val("reg-parentescoReferente"),
        edadReferente:           num("reg-edadReferente"),
        cicloVitalReferente:     val("reg-cicloVitalReferente"),
        direccionReferente:      val("reg-direccionReferente"),
        telefonoReferente:       val("reg-telefonoReferente"),
        correoReferente:         val("reg-correoReferente"),
        barrioReferente:         val("reg-barrioReferente"),
        localidadReferente:      val("reg-localidadReferente"),
    };

    // ── Validación mínima antes de enviar ─────────────────
    if (!datosPcd.documento || !datosPcd.nombre || !datosPcd.tipoDocumento) {
        alert("Por favor completa los campos obligatorios: tipo de documento, número y nombre.");
        return;
    }

    // Validar campos obligatorios de ficha
const camposNulos = Object.entries(datosFicha)
    .filter(([clave, valor]) => {
        // Estos campos SÍ pueden ser null (tienen ? en Prisma)
        const opcionales = ['diagnosticoCognitivo','diagnosticoMental','diagnosticoNeurologico',
                           'diagnosticoSensorial','cantidadPanialesMes','tipoAyudaTecnica',
                           'tenenciaAyudaTecnica','correoReferente'];
        return !opcionales.includes(clave) && (valor === null || valor === '');
    })
    .map(([clave]) => clave);

if (camposNulos.length > 0) {
    alert(`Por favor completa todos los campos obligatorios.\n\nFaltan: ${camposNulos.join(', ')}`);
    return;
}

    // ── Envío al backend ──────────────────────────────────
    try {
        const respuesta = await fetch("http://localhost:3000/api/pcd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pcd: datosPcd, ficha: datosFicha })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert(`✅ Persona registrada exitosamente: ${datosPcd.nombre}`);
            mostrarPantallaInicio();
        } else {
            alert(`❌ Error: ${datos.error}`);
            console.error("Error del backend:", datos);
        }

    } catch (error) {
        alert("❌ No se pudo conectar con el servidor. ¿Está corriendo el backend?");
        console.error("Error de red:", error);
    }
}

    // =========================
    // MOSTRAR RESULTADO FINAL
    // =========================
    function mostrarResultadoFinal() {
        const rc = calcularResultadosPorCategoria();
        const rg = calcularResultadoGeneral(rc);
        
        
        let html = `
            <div class="card mb-4">
                <div class="card-body">
                    <h3 class="mb-3">Matriz ponderación de apoyos</h3>
                    <div class="table-responsive">
                        <table class="table table-bordered align-middle text-center">
                            <thead>
                                <tr>
                                    <th rowspan="3">CATEGORÍAS</th>
                                    <th colspan="5">APOYO</th>
                                    <th colspan="5">CÁLCULOS</th>
                                </tr>
                                <tr>
                                    <th rowspan="2">P1</th><th rowspan="2">P2</th>
                                    <th rowspan="2">P3</th><th rowspan="2">P4</th>
                                    <th rowspan="2">P5</th><th rowspan="2">SUMA</th>
                                    <th colspan="2">CÁLCULO</th>
                                    <th rowspan="2">TIPO APOYO</th>
                                    <th rowspan="2">EQUIV.</th>
                                </tr>
                                <tr><th>DIV.</th><th>RESULT.</th></tr>
                            </thead>
                            <tbody>`;
 
        rc.forEach(r => {
            html += `<tr>
                <td class="text-start">${r.categoria}</td>
                <td>${r.pregunta1}</td><td>${r.pregunta2}</td><td>${r.pregunta3}</td>
                <td>${r.pregunta4}</td><td>${r.pregunta5}</td><td>${r.suma}</td>
                <td>${r.division}</td><td>${r.porcentaje}%</td>
                <td>${r.tipoApoyo}</td><td>${r.equivalencia}</td>
            </tr>`;
        });
 
        html += `
            <tr><td colspan="9" class="text-start fw-bold">APOYO GENERAL OBTENIDO =</td><td class="fw-bold">CÁLCULO</td><td class="fw-bold">RESULTADO</td></tr>
            <tr><td colspan="8"></td><td class="fw-bold">SUMA GENERAL</td><td class="fw-bold">DIV. GENERAL</td><td></td></tr>
            <tr><td colspan="8"></td><td>${rg.sumaGeneral}</td><td>${rg.divisionGeneral}</td><td></td></tr>
            <tr><td colspan="8"></td><td class="fw-bold">CÁLCULO</td><td colspan="2" class="fw-bold">RESULTADO</td></tr>
            <tr><td colspan="8"></td><td>${rg.calculoGeneral}</td><td colspan="2">${rg.porcentajeGeneral}%</td></tr>
            <tr><td colspan="8"></td><td colspan="3" class="fw-bold">${rg.tipoApoyoGeneral}</td></tr>
            </tbody></table></div></div></div>`;
 
        html += generarPanelAnalisis(rc, rg);
        resultadoFinal.innerHTML = html;
        mostrarPantallaResultado();
 
        document.getElementById("card-profesional").style.display   = "block";
        document.getElementById("contenedor-botones").style.display = "flex";
        document.getElementById("card-profesional").style.display   = "block";
        document.getElementById("contenedor-botones").style.display = "flex";
        cargarProfesionales();
    }  // <-- nuevo
 
    //Prueba de sesion↓
    async function guardarTamizajeBackend(payload) {

    const response = await fetch(
        "http://localhost:3000/api/tamizaje",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Error al guardar tamizaje"
        );
    }

    return data;
}
    //↑

    // =========================
    // GUARDAR EVALUACIÓN
    // =========================
    document.getElementById("btnGuardar")?.addEventListener("click", async () => {
        const nombreProf = profesionalSeleccionadoNombre || "";
        const cargo      = document.getElementById("cargoProfesional").value.trim();
        const concepto   = document.getElementById("conceptoTecnico").value.trim();
 
        if (!nombreProf || !cargo || !concepto) {
            alert("Por favor completa el nombre del profesional, cargo y concepto técnico antes de guardar.");
            return;
        }
 
        const rc = calcularResultadosPorCategoria();
        const rg = calcularResultadoGeneral(rc);

        //prueba sesion ↓
        const payload = {

        cicloId: cicloActivoId,

        profesionalId: profesionalSeleccionadoId,

        nivelApoyoGeneral: rg.equivalenciaGeneral,

        tipoApoyoGeneral: rg.tipoApoyoGeneral,

        respuestas,

        resultadosCategoria: rc
        };

        //↑
        //Aqui tambien ↓
        try {

    const resultado =
        await guardarTamizajeBackend(payload);

    console.log(
        "Tamizaje guardado en BD:",
        resultado
    );

} catch (error) {

    console.error(error);

    alert(
        "Error al guardar en la base de datos: "
        + error.message
    );

    return;
}

    //↑

        const evaluacion = {
            id:        Date.now(),
            fecha:     document.getElementById("fecha").value,
            nombre:    document.getElementById("nombre").value,
            documento: document.getElementById("documento").value,
            profesional: { nombre: nombreProf, cargo, concepto },
            respuestas,
            resultadosPorCategoria: rc,
            resultadoGeneral: rg,
            fechaGuardado: new Date().toISOString()
        };
 
        const lista = JSON.parse(localStorage.getItem("evaluaciones") || "[]");
        lista.push(evaluacion);
        localStorage.setItem("evaluaciones", JSON.stringify(lista));
 
        const btn = document.getElementById("btnGuardar");
        btn.textContent       = "✓ Guardado";
        btn.disabled          = true;
        btn.style.background  = "#27500A";
        btn.style.borderColor = "#27500A";
 
        setTimeout(() => {
            btn.textContent       = "💾 Guardar evaluación";
            btn.disabled          = false;
            btn.style.background  = "";
            btn.style.borderColor = "";
        }, 3000);
 
        alert(`Evaluación de ${evaluacion.nombre} guardada correctamente.`);
    });
 
    // =========================
    // EXPORTAR WORD
    // =========================
    document.getElementById("btnExportarWord")?.addEventListener("click", async () => {
        const nombreProf = profesionalSeleccionadoNombre || "";
        const cargo      = document.getElementById("cargoProfesional").value.trim();
        const concepto   = document.getElementById("conceptoTecnico").value.trim();
 
        if (!nombreProf || !cargo || !concepto) {
            alert("Por favor completa el nombre del profesional, cargo y concepto técnico antes de descargar.");
            return;
        }
 
        try {
            const response = await fetch("assets/formato_tamizaje_plantilla.docx");
            if (!response.ok) throw new Error("No se pudo cargar la plantilla.");
            const zip = new PizZip(await response.arrayBuffer());
            const doc = new docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
 
            const rc = calcularResultadosPorCategoria();
            const rg = calcularResultadoGeneral(rc);
 
            doc.setData({
                fecha: formatearFecha(document.getElementById("fecha").value),
                nombre: document.getElementById("nombre").value || "",
                documento: document.getElementById("documento").value || "",
                conceptoTecnico: concepto, nombreProfesional: nombreProf, cargoProfesional: cargo,
                ...generarCeldasPreguntas(),
                cat1p1:String(rc[0].pregunta1),cat1p2:String(rc[0].pregunta2),cat1p3:String(rc[0].pregunta3),cat1p4:String(rc[0].pregunta4),cat1p5:String(rc[0].pregunta5),cat1suma:String(rc[0].suma),cat1division:String(rc[0].division),cat1resultado:rc[0].porcentaje+"%",cat1tipo:rc[0].tipoApoyo,cat1equiv:String(rc[0].equivalencia),
                cat2p1:String(rc[1].pregunta1),cat2p2:String(rc[1].pregunta2),cat2p3:String(rc[1].pregunta3),cat2p4:String(rc[1].pregunta4),cat2p5:String(rc[1].pregunta5),cat2suma:String(rc[1].suma),cat2division:String(rc[1].division),cat2resultado:rc[1].porcentaje+"%",cat2tipo:rc[1].tipoApoyo,cat2equiv:String(rc[1].equivalencia),
                cat3p1:String(rc[2].pregunta1),cat3p2:String(rc[2].pregunta2),cat3p3:String(rc[2].pregunta3),cat3p4:String(rc[2].pregunta4),cat3p5:String(rc[2].pregunta5),cat3suma:String(rc[2].suma),cat3division:String(rc[2].division),cat3resultado:rc[2].porcentaje+"%",cat3tipo:rc[2].tipoApoyo,cat3equiv:String(rc[2].equivalencia),
                cat4p1:String(rc[3].pregunta1),cat4p2:String(rc[3].pregunta2),cat4p3:String(rc[3].pregunta3),cat4p4:String(rc[3].pregunta4),cat4p5:String(rc[3].pregunta5),cat4suma:String(rc[3].suma),cat4division:String(rc[3].division),cat4resultado:rc[3].porcentaje+"%",cat4tipo:rc[3].tipoApoyo,cat4equiv:String(rc[3].equivalencia),
                cat5p1:String(rc[4].pregunta1),cat5p2:String(rc[4].pregunta2),cat5p3:String(rc[4].pregunta3),cat5p4:String(rc[4].pregunta4),cat5p5:String(rc[4].pregunta5),cat5suma:String(rc[4].suma),cat5division:String(rc[4].division),cat5resultado:rc[4].porcentaje+"%",cat5tipo:rc[4].tipoApoyo,cat5equiv:String(rc[4].equivalencia),
                sumaGeneral:String(rg.sumaGeneral),divisionGeneral:String(rg.divisionGeneral),
                calculoGeneral:String(rg.calculoGeneral),resultadoGeneral:rg.porcentajeGeneral+"%",
                tipoApoyoGeneral:rg.tipoApoyoGeneral
            });
            doc.render();
            const blob = doc.getZip().generate({ type:"blob", mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(blob, `Tamizaje_${document.getElementById("nombre").value||"evaluacion"}.docx`.replace(/\s+/g,"_"));
 
        } catch (e) {
            console.error(e);
            alert("Error al generar el documento. Revisa la consola.");
        }
    });
 
    // =========================
    // INICIAR
    // =========================
    document.getElementById("btnIniciar")?.addEventListener("click", () => {
        const fecha     = document.getElementById("fecha").value;
        const nombre    = document.getElementById("nombre").value.trim();
        const documento = document.getElementById("documento").value.trim();
        if (!fecha || !nombre || !documento) {
            alert("Por favor completa la fecha, nombre y documento antes de iniciar.");
            return;
        }
        indiceActual = 0;
        respuestas   = [];
        mostrarPantallaEvaluacion();
        renderizarPregunta();
    });
 
    btnSiguiente.addEventListener("click", () => {
        if (!guardarRespuestaActual()) return;
        if (indiceActual < preguntas.length - 1) { indiceActual++; renderizarPregunta(); }
        else mostrarResultadoFinal();
    });
 
    btnAnterior.addEventListener("click", () => {
        if (indiceActual > 0) {
            if (document.querySelector(".opcion-card.seleccionada")) guardarRespuestaActual();
            indiceActual--;
            renderizarPregunta();
        }
    });
 
    document.querySelector("#sidebarToggle")?.addEventListener("click", e => {
        e.preventDefault();
        document.body.classList.toggle("sb-sidenav-toggled");
    });
 
    //mostrarPantallaRegistro();//Temp
    mostrarPantallaInicio();
})
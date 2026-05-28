window.addEventListener("DOMContentLoaded", () => {

    // =========================
    // REFERENCIAS DEL HTML
    // =========================
    const questionContainer = document.getElementById("question-container");
    const btnAnterior       = document.getElementById("btnAnterior");
    const btnSiguiente      = document.getElementById("btnSiguiente");
    const textoProgreso     = document.getElementById("textoProgreso");
    const barraProgreso     = document.getElementById("barraProgreso");
    const categoriaActual   = document.getElementById("categoriaActual");
    const resultadoFinal    = document.getElementById("resultado-final");

    // =========================
    // VARIABLES DE CONTROL
    // =========================
    let indiceActual = 0;
    let respuestas   = [];

    // =========================
    // CONFIGURACIÓN DE CATEGORÍAS
    // =========================
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
    function obtenerCategoriaPorId(idPregunta) {
        return categoriasMatriz.find(cat => idPregunta >= cat.inicio && idPregunta <= cat.fin) || null;
    }

    function obtenerCategoria(preguntaActual) {
        const cat = obtenerCategoriaPorId(preguntaActual.id);
        return cat ? cat.nombrePantalla : (preguntaActual.categoria || "Sin categoría").trim();
    }

    function obtenerPregunta(preguntaActual) {
        return preguntaActual.pregunta || "Pregunta no disponible";
    }

    function obtenerOrientadoras(preguntaActual) {
        return Array.isArray(preguntaActual.orientadoras) ? preguntaActual.orientadoras : [];
    }

    function formatearFecha(fechaInput) {
        if (!fechaInput) return "";
        const partes = fechaInput.split("-");
        if (partes.length !== 3) return fechaInput;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function generarCeldasPreguntas() {
        const celdas = {};
        for (let i = 1; i <= 25; i++) {
            const respuesta = respuestas.find(r => r.idPregunta === i);
            const valor = respuesta?.valor;
            celdas[`p${i}c0`] = valor === 0 ? "0" : "";
            celdas[`p${i}c1`] = valor === 1 ? "1" : "";
            celdas[`p${i}c2`] = valor === 2 ? "2" : "";
            celdas[`p${i}c3`] = valor === 3 ? "3" : "";
        }
        return celdas;
    }

    // =========================
    // ACTUALIZAR NOMBRE EN NAVBAR
    // =========================
    function actualizarNombreNavbar() {
        const nombreNavbar = document.getElementById("navbar-nombre-pcd");
        const nombre = document.getElementById("nombre")?.value || "";
        if (nombreNavbar) {
            nombreNavbar.textContent = nombre ? `Evaluando: ${nombre}` : "";
        }
    }

    // =========================
    // MOSTRAR / OCULTAR PANTALLAS
    // =========================
    function mostrarPantallaInicio() {
        document.getElementById("pantalla-inicio").style.display  = "block";
        document.getElementById("pantalla-evaluacion").style.display = "none";
        document.getElementById("pantalla-resultado").style.display  = "none";
    }

    function mostrarPantallaEvaluacion() {
        document.getElementById("pantalla-inicio").style.display     = "none";
        document.getElementById("pantalla-evaluacion").style.display = "block";
        document.getElementById("pantalla-resultado").style.display  = "none";
        actualizarNombreNavbar();
    }

    function mostrarPantallaResultado() {
        document.getElementById("pantalla-inicio").style.display     = "none";
        document.getElementById("pantalla-evaluacion").style.display = "none";
        document.getElementById("pantalla-resultado").style.display  = "block";
    }

    // =========================
    // RENDERIZAR PREGUNTA
    // =========================
    function renderizarPregunta() {
        const preguntaActual        = preguntas[indiceActual];
        const nombreCategoria       = obtenerCategoria(preguntaActual);
        const textoPregunta         = obtenerPregunta(preguntaActual);
        const preguntasOrientadoras = obtenerOrientadoras(preguntaActual);

        // Progreso
        textoProgreso.textContent   = `Pregunta ${indiceActual + 1} de ${preguntas.length}`;
        categoriaActual.textContent = nombreCategoria;
        const porcentaje = Math.round(((indiceActual + 1) / preguntas.length) * 100);
        barraProgreso.style.width   = `${porcentaje}%`;
        barraProgreso.textContent   = `${porcentaje}%`;

        const respuestaGuardada = respuestas.find(r => r.idPregunta === preguntaActual.id);

        // Layout dos columnas
        questionContainer.innerHTML = `
            <div class="evaluacion-grid">

                <!-- Columna izquierda: pregunta + calificación -->
                <div class="col-pregunta">
                    <p class="label-seccion">Pregunta</p>
                    <p class="texto-pregunta">${textoPregunta}</p>

                    <p class="label-seccion" style="margin-top: 1.25rem;">Seleccione la calificación</p>
                    <div class="opciones-grid">
                        ${escalaCalificacion.map(opcion => `
                            <div class="card opcion-card ${respuestaGuardada && respuestaGuardada.valor === opcion.valor ? 'seleccionada' : ''}"
                                data-valor="${opcion.valor}">
                                <div class="card-body">
                                    <h6 class="fw-bold">${opcion.titulo}</h6>
                                    <p class="mb-0">${opcion.descripcion}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Columna derecha: preguntas orientadoras -->
                <div class="col-orientadoras">
                    <p class="label-seccion">Preguntas orientadoras</p>
                    <ul class="lista-orientadoras">
                        ${preguntasOrientadoras.length > 0
                            ? preguntasOrientadoras.map(item => `<li>${item}</li>`).join("")
                            : `<li class="sin-orientadoras">No hay preguntas orientadoras registradas.</li>`
                        }
                    </ul>
                </div>

            </div>
        `;

        activarEventosOpciones();
        actualizarBotones();
    }

    function activarEventosOpciones() {
        const cards = document.querySelectorAll(".opcion-card");
        cards.forEach(card => {
            card.addEventListener("click", () => {
                cards.forEach(c => c.classList.remove("seleccionada"));
                card.classList.add("seleccionada");
            });
        });
    }

    function actualizarBotones() {
        btnAnterior.disabled     = indiceActual === 0;
        btnSiguiente.textContent = indiceActual === preguntas.length - 1 ? "Finalizar" : "Siguiente →";
    }

    function guardarRespuestaActual() {
        const preguntaActual     = preguntas[indiceActual];
        const opcionSeleccionada = document.querySelector(".opcion-card.seleccionada");

        if (!opcionSeleccionada) {
            alert("Debes seleccionar una calificación antes de continuar.");
            return false;
        }

        const valor              = Number(opcionSeleccionada.dataset.valor);
        const respuestaExistente = respuestas.find(r => r.idPregunta === preguntaActual.id);
        const categoriaCalculada = obtenerCategoria(preguntaActual);

        if (respuestaExistente) {
            respuestaExistente.valor     = valor;
            respuestaExistente.pregunta  = obtenerPregunta(preguntaActual);
            respuestaExistente.categoria = categoriaCalculada;
        } else {
            respuestas.push({ idPregunta: preguntaActual.id, categoria: categoriaCalculada, pregunta: obtenerPregunta(preguntaActual), valor });
        }
        return true;
    }

    // =========================
    // CÁLCULOS
    // =========================
    function obtenerTipoApoyoCategoria(porcentaje) {
        if (porcentaje < 5)                       return { tipo: "NO REQUIERE APOYO",  equivalencia: 0 };
        if (porcentaje >= 5  && porcentaje <= 24) return { tipo: "APOYO INTERMITENTE", equivalencia: 1 };
        if (porcentaje >= 25 && porcentaje <= 50) return { tipo: "APOYO LIMITADO",     equivalencia: 2 };
        if (porcentaje >= 51 && porcentaje <= 84) return { tipo: "APOYO EXTENSO",      equivalencia: 3 };
        return                                           { tipo: "APOYO GENERALIZADO", equivalencia: 4 };
    }

    function obtenerTipoApoyoGeneral(porcentaje) {
        if (porcentaje < 5)                       return { tipo: "NO REQUIERE APOYO",  equivalencia: 0 };
        if (porcentaje >= 5  && porcentaje <= 24) return { tipo: "APOYO INTERMITENTE", equivalencia: 1 };
        if (porcentaje >= 25 && porcentaje <= 49) return { tipo: "APOYO LIMITADO",     equivalencia: 2 };
        if (porcentaje >= 50 && porcentaje <= 84) return { tipo: "APOYO EXTENSO",      equivalencia: 3 };
        return                                           { tipo: "APOYO GENERALIZADO", equivalencia: 4 };
    }

    function calcularResultadosPorCategoria() {
        return categoriasMatriz.map(categoriaBase => {
            const respuestasCategoria = respuestas
                .filter(r => r.idPregunta >= categoriaBase.inicio && r.idPregunta <= categoriaBase.fin)
                .sort((a, b) => a.idPregunta - b.idPregunta);
            const valores       = respuestasCategoria.map(r => r.valor);
            const suma          = valores.reduce((acc, num) => acc + num, 0);
            const cantidadCeros = valores.filter(v => v === 0).length;
            const division      = cantidadCeros >= 2 ? 12 : 15;
            const porcentaje    = Number(((suma / division) * 100).toFixed(2));
            const tipoApoyo     = obtenerTipoApoyoCategoria(porcentaje);
            return {
                categoria: categoriaBase.nombreMatriz,
                pregunta1: valores[0] ?? "", pregunta2: valores[1] ?? "",
                pregunta3: valores[2] ?? "", pregunta4: valores[3] ?? "",
                pregunta5: valores[4] ?? "",
                suma, cantidadCeros, division, porcentaje,
                tipoApoyo: tipoApoyo.tipo, equivalencia: tipoApoyo.equivalencia
            };
        });
    }

    function calcularResultadoGeneral(resultadosCategorias) {
        const equivalencias        = resultadosCategorias.map(r => r.equivalencia);
        const sumaGeneral          = equivalencias.reduce((acc, num) => acc + num, 0);
        const cantidadCerosGeneral = equivalencias.filter(v => v === 0).length;
        const divisionGeneral      = cantidadCerosGeneral >= 2 ? 16 : 20;
        const calculoGeneral       = Number((sumaGeneral / divisionGeneral).toFixed(4));
        const porcentajeGeneral    = Number((calculoGeneral * 100).toFixed(2));
        const tipoApoyoGeneral     = obtenerTipoApoyoGeneral(porcentajeGeneral);
        return { sumaGeneral, cantidadCerosGeneral, divisionGeneral, calculoGeneral, porcentajeGeneral, tipoApoyoGeneral: tipoApoyoGeneral.tipo, equivalenciaGeneral: tipoApoyoGeneral.equivalencia };
    }

    // =========================
    // MOSTRAR RESULTADO FINAL
    // =========================
    function mostrarResultadoFinal() {
        const resultadosCategorias = calcularResultadosPorCategoria();
        const resultadoGeneral     = calcularResultadoGeneral(resultadosCategorias);

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
                                    <th rowspan="2">P 1</th><th rowspan="2">P 2</th>
                                    <th rowspan="2">P 3</th><th rowspan="2">P 4</th>
                                    <th rowspan="2">P 5</th><th rowspan="2">SUMA</th>
                                    <th colspan="2">CÁLCULO</th>
                                    <th rowspan="2">TIPO APOYO</th>
                                    <th rowspan="2">EQUIV</th>
                                </tr>
                                <tr><th>DIVISIÓN</th><th>RESULTADO</th></tr>
                            </thead>
                            <tbody>`;

        resultadosCategorias.forEach(r => {
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
            <tr><td colspan="8"></td><td class="fw-bold">SUMA GENERAL</td><td class="fw-bold">DIVISIÓN GENERAL</td><td></td></tr>
            <tr><td colspan="8"></td><td>${resultadoGeneral.sumaGeneral}</td><td>${resultadoGeneral.divisionGeneral}</td><td></td></tr>
            <tr><td colspan="8"></td><td class="fw-bold">CÁLCULO</td><td colspan="2" class="fw-bold">RESULTADO</td></tr>
            <tr><td colspan="8"></td><td>${resultadoGeneral.calculoGeneral}</td><td colspan="2">${resultadoGeneral.porcentajeGeneral}%</td></tr>
            <tr><td colspan="8"></td><td colspan="3" class="fw-bold">${resultadoGeneral.tipoApoyoGeneral}</td></tr>
            </tbody></table></div></div></div>`;

        resultadoFinal.innerHTML = html;
        mostrarPantallaResultado();

        document.getElementById("card-profesional").style.display      = "block";
        document.getElementById("contenedor-boton-word").style.display  = "block";
    }

    // =========================
    // EXPORTAR WORD
    // =========================
    const btnExportarWord = document.getElementById("btnExportarWord");
    if (btnExportarWord) {
        btnExportarWord.addEventListener("click", async () => {

            const nombreProf = document.getElementById("nombreProfesional").value.trim();
            const cargo      = document.getElementById("cargoProfesional").value.trim();
            const concepto   = document.getElementById("conceptoTecnico").value.trim();

            if (!nombreProf || !cargo || !concepto) {
                alert("Por favor completa el nombre del profesional, cargo y concepto técnico antes de descargar.");
                return;
            }

            try {
                const response = await fetch("assets/formato_tamizaje_plantilla.docx");
                if (!response.ok) throw new Error("No se pudo cargar la plantilla Word.");
                const arrayBuffer = await response.arrayBuffer();
                const zip = new PizZip(arrayBuffer);
                const doc = new docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

                const resultados = calcularResultadosPorCategoria();
                const final      = calcularResultadoGeneral(resultados);

                const datos = {
                    fecha:             formatearFecha(document.getElementById("fecha").value),
                    nombre:            document.getElementById("nombre").value || "",
                    documento:         document.getElementById("documento").value || "",
                    conceptoTecnico:   concepto,
                    nombreProfesional: nombreProf,
                    cargoProfesional:  cargo,
                    ...generarCeldasPreguntas(),
                    cat1p1: String(resultados[0].pregunta1), cat1p2: String(resultados[0].pregunta2), cat1p3: String(resultados[0].pregunta3), cat1p4: String(resultados[0].pregunta4), cat1p5: String(resultados[0].pregunta5), cat1suma: String(resultados[0].suma), cat1division: String(resultados[0].division), cat1resultado: resultados[0].porcentaje + "%", cat1tipo: resultados[0].tipoApoyo, cat1equiv: String(resultados[0].equivalencia),
                    cat2p1: String(resultados[1].pregunta1), cat2p2: String(resultados[1].pregunta2), cat2p3: String(resultados[1].pregunta3), cat2p4: String(resultados[1].pregunta4), cat2p5: String(resultados[1].pregunta5), cat2suma: String(resultados[1].suma), cat2division: String(resultados[1].division), cat2resultado: resultados[1].porcentaje + "%", cat2tipo: resultados[1].tipoApoyo, cat2equiv: String(resultados[1].equivalencia),
                    cat3p1: String(resultados[2].pregunta1), cat3p2: String(resultados[2].pregunta2), cat3p3: String(resultados[2].pregunta3), cat3p4: String(resultados[2].pregunta4), cat3p5: String(resultados[2].pregunta5), cat3suma: String(resultados[2].suma), cat3division: String(resultados[2].division), cat3resultado: resultados[2].porcentaje + "%", cat3tipo: resultados[2].tipoApoyo, cat3equiv: String(resultados[2].equivalencia),
                    cat4p1: String(resultados[3].pregunta1), cat4p2: String(resultados[3].pregunta2), cat4p3: String(resultados[3].pregunta3), cat4p4: String(resultados[3].pregunta4), cat4p5: String(resultados[3].pregunta5), cat4suma: String(resultados[3].suma), cat4division: String(resultados[3].division), cat4resultado: resultados[3].porcentaje + "%", cat4tipo: resultados[3].tipoApoyo, cat4equiv: String(resultados[3].equivalencia),
                    cat5p1: String(resultados[4].pregunta1), cat5p2: String(resultados[4].pregunta2), cat5p3: String(resultados[4].pregunta3), cat5p4: String(resultados[4].pregunta4), cat5p5: String(resultados[4].pregunta5), cat5suma: String(resultados[4].suma), cat5division: String(resultados[4].division), cat5resultado: resultados[4].porcentaje + "%", cat5tipo: resultados[4].tipoApoyo, cat5equiv: String(resultados[4].equivalencia),
                    sumaGeneral: String(final.sumaGeneral), divisionGeneral: String(final.divisionGeneral),
                    calculoGeneral: String(final.calculoGeneral), resultadoGeneral: final.porcentajeGeneral + "%",
                    tipoApoyoGeneral: final.tipoApoyoGeneral
                };

                doc.setData(datos);
                doc.render();

                const blob = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
                const nombreArchivo = `Tamizaje_${datos.nombre || "evaluacion"}_${datos.fecha}.docx`.replace(/\s+/g, "_").replace(/\//g, "-");
                saveAs(blob, nombreArchivo);

            } catch (error) {
                console.error("Error al exportar:", error);
                alert("Error al generar el documento. Revisa la consola para más detalles.");
            }
        });
    }

    // =========================
    // EVENTO: INICIAR EVALUACIÓN
    // =========================
    const btnIniciar = document.getElementById("btnIniciar");
    if (btnIniciar) {
        btnIniciar.addEventListener("click", () => {
            const fecha     = document.getElementById("fecha").value;
            const nombre    = document.getElementById("nombre").value.trim();
            const documento = document.getElementById("documento").value.trim();

            if (!fecha || !nombre || !documento) {
                alert("Por favor completa la fecha, nombre y documento antes de iniciar la evaluación.");
                return;
            }

            indiceActual = 0;
            respuestas   = [];
            mostrarPantallaEvaluacion();
            renderizarPregunta();
        });
    }

    // =========================
    // EVENTO: SIGUIENTE / FINALIZAR
    // =========================
    btnSiguiente.addEventListener("click", () => {
        const guardadoOk = guardarRespuestaActual();
        if (!guardadoOk) return;

        if (indiceActual < preguntas.length - 1) {
            indiceActual++;
            renderizarPregunta();
        } else {
            mostrarResultadoFinal();
        }
    });

    // =========================
    // EVENTO: ANTERIOR
    // =========================
    btnAnterior.addEventListener("click", () => {
        if (indiceActual > 0) {
            const opcionSeleccionada = document.querySelector(".opcion-card.seleccionada");
            if (opcionSeleccionada) guardarRespuestaActual();
            indiceActual--;
            renderizarPregunta();
        }
    });

    // =========================
    // SIDEBAR TOGGLE
    // =========================
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", event => {
            event.preventDefault();
            document.body.classList.toggle("sb-sidenav-toggled");
        });
    }

    // Arrancar en pantalla de inicio
    mostrarPantallaInicio();
});

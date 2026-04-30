// Este evento espera a que TODO el HTML esté cargado antes de ejecutar el JS
window.addEventListener("DOMContentLoaded", () => {

    // =========================
    // REFERENCIAS DEL HTML
    // =========================
    // Aquí guardamos elementos del HTML para poder usarlos en JS
    const questionContainer = document.getElementById("question-container"); // donde se muestra la pregunta
    const btnAnterior = document.getElementById("btnAnterior"); // botón atrás
    const btnSiguiente = document.getElementById("btnSiguiente"); // botón siguiente
    const textoProgreso = document.getElementById("textoProgreso"); // texto "Pregunta X de Y"
    const barraProgreso = document.getElementById("barraProgreso"); // barra visual de progreso
    const categoriaActual = document.getElementById("categoriaActual"); // nombre de categoría
    const resultadoFinal = document.getElementById("resultado-final"); // contenedor del resultado final

    // =========================
    // VARIABLES DE CONTROL
    // =========================

    let indiceActual = 0; // posición actual en el arreglo de preguntas
    let respuestas = []; // aquí se guardan las respuestas del usuario

    // =========================
    // CONFIGURACIÓN DE CATEGORÍAS
    // =========================
    // Esto define cómo se agrupan las preguntas
    const categoriasMatriz = [
        {
            numero: 1,
            nombrePantalla: "Aprendizaje y conocimiento",
            nombreMatriz: "Categoría 1. Aprendizaje y conocimiento",
            inicio: 1,
            fin: 5
        },
        {
            numero: 2,
            nombrePantalla: "Comunicación, lenguaje y pensamiento",
            nombreMatriz: "Categoría 2. Comunicación, lenguaje y pensamiento",
            inicio: 6,
            fin: 10
        },
        {
            numero: 3,
            nombrePantalla: "Vida cotidiana",
            nombreMatriz: "Categoría 3. Independencia y autonomía",
            inicio: 11,
            fin: 15
        },
        {
            numero: 4,
            nombrePantalla: "Participación social",
            nombreMatriz: "Categoría 4. Participación social",
            inicio: 16,
            fin: 20
        },
        {
            numero: 5,
            nombrePantalla: "Movilidad",
            nombreMatriz: "Categoría 5. Movilidad",
            inicio: 21,
            fin: 25
        }
    ];

    // =========================
    // FUNCIONES AUXILIARES
    // =========================

    // Limpia texto (minúsculas, sin tildes)
    function normalizarTexto(texto) {
        return (texto || "")
            .toString()
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Busca la categoría según el ID de la pregunta
    function obtenerCategoriaPorId(idPregunta) {
        const categoriaEncontrada = categoriasMatriz.find(cat =>
            idPregunta >= cat.inicio && idPregunta <= cat.fin
        );

        return categoriaEncontrada || null;
    }

    // Obtiene nombre de categoría para mostrar
    function obtenerCategoria(preguntaActual) {
        const categoriaPorId = obtenerCategoriaPorId(preguntaActual.id);

        if (categoriaPorId) {
            return categoriaPorId.nombrePantalla;
        }

        return (preguntaActual.categoria || "Sin categoría").trim();
    }

    // Obtiene texto de la pregunta
    function obtenerPregunta(preguntaActual) {
        return preguntaActual.pregunta || "Pregunta no disponible";
    }

    // Asegura que orientadoras sea un array
    function obtenerOrientadoras(preguntaActual) {
        return Array.isArray(preguntaActual.orientadoras)
            ? preguntaActual.orientadoras
            : [];
    }

    // =========================
    // EXPORTAR PDF
    // =========================


    const btnExportarPDF = document.getElementById("btnExportarPDF");

    if (btnExportarPDF) {
        btnExportarPDF.addEventListener("click", () => {

        if (resultadoFinal.innerHTML.trim() === "") {
            alert("Primero debes finalizar el formulario.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");

        let y = 10;

    // =========================
    // ENCABEZADO TIPO SDIS (TABLA)
    // =========================

    const logo = new Image();
    logo.src = "assets/logoSDIS.png";

    // MÁRGENES (en mm)
    const margenIzq = 30; // 3 cm
    const margenSup = 30; // 3 cm
    const margenDer = 20; // 2 cm

    const anchoPagina = doc.internal.pageSize.getWidth();
    const anchoDisponible = anchoPagina - margenIzq - margenDer;

    // Tabla del encabezado
    doc.autoTable({
    startY: margenSup,
    margin: {
        left: margenIzq,
        right: margenDer
    },

    theme: "grid",
    styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: "middle"
    },

    columnStyles: {
        0: { cellWidth: anchoDisponible * 0.25 },
        1: { cellWidth: anchoDisponible * 0.50 },
        2: { cellWidth: anchoDisponible * 0.25 }
    },

    // estructura de la tabla
    body: [
        [
            { content: "", rowSpan: 4 },
            {
                content: "PROCESO PRESTACIÓN DE SERVICIOS SOCIALES\n\nFORMATO TAMIZAJE DEL SISTEMA DE APOYO PARA PERSONAS CON DISCAPACIDAD",
                rowSpan: 4,
                styles: { halign: "center", fontStyle: "bold" }
            },
            "Código: FOR-PSS-159"
        ],
        [
            "Versión: 2"
        ],
        [
            "Fecha: Memo I2024022831 – 16/08/2024"
        ],
        [
            "Página: 1 de 6"
        ]
    ],

    // dibuja el logo dentro de la celda
    didDrawCell: function (data) {
    if (data.column.index === 0 && data.row.index === 0) {

        const margenInterno = 2; // espacio dentro de la celda

        const ancho = data.cell.width - (margenInterno * 2);
        const alto = data.cell.height - (margenInterno * 2);

        doc.addImage(
            logo,
            "PNG",
            data.cell.x + margenInterno,
            data.cell.y + margenInterno,
            ancho,
            alto
        );
    }
}
});

    // Actualiza la posición Y después de la tabla
       y = doc.lastAutoTable.finalY + 5;

            // =========================
            // TEXTO INSTRUCCIÓN
            // =========================
doc.setFontSize(9);
doc.setFont("helvetica", "normal");

const texto = doc.splitTextToSize(
    "Diligencie el siguiente formato teniendo en cuenta los conceptos y orientaciones descritas en el instructivo Tamizaje del sistema de apoyos para personas con discapacidad (INS-PSS-034).",
    anchoDisponible
);

doc.text(texto, margenIzq, y, {
    maxWidth: anchoDisponible,
    align: "justify"
});

// Ajuste dinámico de altura (más preciso)
y += texto.length * 4.5;

y += 3;

        // =========================
        // DATOS DEL FORMULARIO
        // =========================
        const fechaInput = document.getElementById("fecha").value;

        let fechaFormateada = "";

        // Convierte la fecha a formato dd/mm/yyyy
        if (fechaInput) {
        const partes = fechaInput.split("-");
        fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        // Escribe los datos en el PDF
        doc.text("Fecha de diligenciamiento:", margenIzq, y);
        doc.text(fechaFormateada, margenIzq + 70, y);
        y += 5;

        doc.text("Nombre de la persona con discapacidad:", margenIzq, y);
        doc.text((document.getElementById("nombre").value || ""), margenIzq + 70, y);
        y += 5;

        doc.text("Documento de identificación:", margenIzq, y);
        doc.text((document.getElementById("documento").value || ""), margenIzq + 70, y);

        y += 8;

        // =========================
        // TABLA 1 (RESPUESTAS)
        // =========================
        doc.setFont("helvetica", "bold");
        doc.text("Tabla 1. Valoración por categorías", margenIzq, y);

        const tablaPreguntas = [];

        // Recorre todas las categorías
        categoriasMatriz.forEach(cat => {

            // Agrega el título de la categoría
            tablaPreguntas.push([
                {
                    content: `${cat.numero}. ${cat.nombrePantalla}`,
                    colSpan: 5,
                    styles: { fillColor: [220,220,220] }
                }
            ]);

            // Recorre las preguntas de esa categoría
            for (let i = cat.inicio; i <= cat.fin; i++) {

                const pregunta = preguntas.find(p => p.id === i);
                const respuesta = respuestas.find(r => r.idPregunta === i);

                // Marca con X la respuesta seleccionada
                tablaPreguntas.push([
                    `${i}. ${pregunta?.pregunta || ""}`,
                    respuesta?.valor === 0 ? "X" : "",
                    respuesta?.valor === 1 ? "X" : "",
                    respuesta?.valor === 2 ? "X" : "",
                    respuesta?.valor === 3 ? "X" : ""
                ]);
            }
        });

        // Dibuja la tabla en el PDF
        doc.autoTable({
            startY: y + 3,
            head: [["Ítem", "0", "1", "2", "3"]],
            body: tablaPreguntas,
            styles: { fontSize: 7 },
            margin: { left: margenIzq, right: margenDer }
        });

        y = doc.lastAutoTable.finalY + 5;

        /*
        // =========================
        // ESCALA
        // =========================
        // Aquí se crea la tabla que muestra qué significa cada valor (0,1,2,3)
        doc.autoTable({
            startY: y,
            head: [["Valor", "Tipo", "Descripción"]], // encabezados de la tabla
            // Se recorre el arreglo escalaCalificacion para llenar la tabla
            body: escalaCalificacion.map(e => [
                e.valor,        // número (0,1,2,3)
                e.titulo,       // nombre del tipo de apoyo
                e.descripcion   // explicación
            ]),
            styles: { fontSize: 7 },
            margin: { left: margenIzq, right: margenDer }
        });

        */

        // Se actualiza la posición Y después de la tabla
        y = doc.lastAutoTable.finalY + 5;

        // =========================
        // MATRIZ
        // =========================
        // Título de la tabla de resultados
        doc.setFont("helvetica", "bold");
        doc.text("Tabla 2. Matriz de resultados", margenIzq, y);

        // Se calculan los resultados por categoría
        const resultados = calcularResultadosPorCategoria();

        // Se arma la estructura de la tabla con esos resultados
        const tablaResultados = resultados.map(r => [
            r.categoria,    // nombre de la categoría
            r.pregunta1,    // respuesta pregunta 1
            r.pregunta2,    
            r.pregunta3,
            r.pregunta4,
            r.pregunta5,
            r.suma,         // suma de valores
            r.division,     // valor divisor
            r.porcentaje + "%",     // porcentaje calculado
            r.tipoApoyo     // tipo de apoyo
        ]); 

        // Se dibuja la tabla en el PDF
        doc.autoTable({
            startY: y + 3,
            head: [["Categoría","P1","P2","P3","P4","P5","Suma","Div","%","Tipo"]],
            body: tablaResultados,
            styles: { fontSize: 7 },
            margin: { left: margenIzq, right: margenDer }
        });

        // Se actualiza la posición Y
        y = doc.lastAutoTable.finalY + 8;

        // =========================
        // RESULTADO FINAL
        // =========================
        // Se calcula el resultado general (todas las categorías)
        const final = calcularResultadoGeneral(resultados);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        // Se escribe el porcentaje final
        doc.text(`Resultado final: ${final.porcentajeGeneral}%`, margenIzq, y);
        y += 5;

        // Se escribe el tipo de apoyo final
        doc.text(`Tipo de apoyo: ${final.tipoApoyoGeneral}`, margenIzq, y);

        // =========================
        // GUARDAR
        // =========================
        // Descarga el archivo PDF
        doc.save("Evaluacion.pdf");
    });
}

    // FUNCIÓN: renderizarPregunta()
    // Muestra en pantalla la pregunta actual con sus opciones
    function renderizarPregunta() {

        // Se obtiene la pregunta actual según el índice
        const preguntaActual = preguntas[indiceActual];

        // Se obtienen datos de la pregunta
        const nombreCategoria = obtenerCategoria(preguntaActual);
        const textoPregunta = obtenerPregunta(preguntaActual);
        const preguntasOrientadoras = obtenerOrientadoras(preguntaActual);

        // Se actualiza el texto de progreso (ej: Pregunta 3 de 25)
        textoProgreso.textContent = `Pregunta ${indiceActual + 1} de ${preguntas.length}`;

        // Mostramos el nombre de la categoría actual
        categoriaActual.textContent = nombreCategoria;

        // Se calcula el porcentaje de avance
        const porcentaje = Math.round(((indiceActual + 1) / preguntas.length) * 100);

        // Se actualiza la barra de progreso
        barraProgreso.style.width = `${porcentaje}%`;
        barraProgreso.textContent = `${porcentaje}%`;

        // Buscamos si esta pregunta ya había sido respondida antes
        // Esto sirve para que, si el usuario vuelve hacia atrás,
        // se vea marcada la opción que ya había elegido
        const respuestaGuardada = respuestas.find(r => r.idPregunta === preguntaActual.id);

        // Aquí construimos el HTML dinámicamente
        // y lo metemos dentro del contenedor principal de la pregunta
        questionContainer.innerHTML = `
            <h3 class="mb-3">${nombreCategoria}</h3>
            <p class="fs-5 fw-semibold">${textoPregunta}</p>

            <div class="mb-4">
                <h5>Preguntas orientadoras</h5>
                <ul class="list-group">
                    ${
                        preguntasOrientadoras.length > 0
                            ? preguntasOrientadoras.map(item => `
                                <li class="list-group-item">${item}</li>
                            `).join("")
                            : `<li class="list-group-item text-muted">No hay preguntas orientadoras registradas.</li>`
                    }
                </ul>
            </div>

            <div class="mb-4">
                <h5>Seleccione la calificación</h5>
                <div class="row g-3">
                    ${escalaCalificacion.map(opcion => `
                        <div class="col-md-6">
                            <div class="card opcion-card h-100 ${respuestaGuardada && respuestaGuardada.valor === opcion.valor ? 'seleccionada' : ''}" data-valor="${opcion.valor}">
                                <div class="card-body">
                                    <h6 class="fw-bold">${opcion.titulo}</h6>
                                    <p class="mb-0">${opcion.descripcion}</p>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

        // Después de dibujar el HTML, activamos los clics de las tarjetas
        activarEventosOpciones();

        // También actualizamos el estado de los botones
        actualizarBotones();
    }

    // FUNCIÓN: activarEventosOpciones()
    // Permite que el usuario haga clic en una opción 0,1,2,3
    function activarEventosOpciones() {
        const cards = document.querySelectorAll(".opcion-card");

        cards.forEach(card => {
            card.addEventListener("click", () => {
                cards.forEach(c => c.classList.remove("seleccionada"));
                card.classList.add("seleccionada");
            });
        });
    }

    // FUNCIÓN: guardarRespuestaActual()
    // Guarda la respuesta seleccionada de la pregunta actual
    function guardarRespuestaActual() {
        const preguntaActual = preguntas[indiceActual];
        const opcionSeleccionada = document.querySelector(".opcion-card.seleccionada");

        if (!opcionSeleccionada) {
            alert("Debes seleccionar una calificación antes de continuar.");
            return false;
        }

        const valor = Number(opcionSeleccionada.dataset.valor);
        const respuestaExistente = respuestas.find(r => r.idPregunta === preguntaActual.id);
        const categoriaCalculada = obtenerCategoria(preguntaActual);

        if (respuestaExistente) {
            respuestaExistente.valor = valor;
            respuestaExistente.pregunta = obtenerPregunta(preguntaActual);
            respuestaExistente.categoria = categoriaCalculada;
        } else {
            respuestas.push({
                idPregunta: preguntaActual.id,
                categoria: categoriaCalculada,
                pregunta: obtenerPregunta(preguntaActual),
                valor: valor
            });
        }

        return true;
    }

    // FUNCIÓN: actualizarBotones()
    // Activa o desactiva botones según la pregunta actual
    function actualizarBotones() {
        btnAnterior.disabled = indiceActual === 0;
        btnSiguiente.textContent = indiceActual === preguntas.length - 1 ? "Finalizar" : "Siguiente";
    }

    // FUNCIÓN: obtenerTipoApoyoCategoria()
    // Según el porcentaje, devuelve tipo de apoyo y equivalencia
    // para cada categoría
    // Escala del instructivo por categoría:
    // <5 = No requiere apoyo
    // 5-24 = Apoyo intermitente
    // 25-50 = Apoyo limitado
    // 51-84 = Apoyo extenso
    // 85 o más = Apoyo generalizado
    function obtenerTipoApoyoCategoria(porcentaje) {
        if (porcentaje < 5) {
            return { tipo: "NO REQUIERE APOYO", equivalencia: 0 };
        } else if (porcentaje >= 5 && porcentaje <= 24) {
            return { tipo: "APOYO INTERMITENTE", equivalencia: 1 };
        } else if (porcentaje >= 25 && porcentaje <= 50) {
            return { tipo: "APOYO LIMITADO", equivalencia: 2 };
        } else if (porcentaje >= 51 && porcentaje <= 84) {
            return { tipo: "APOYO EXTENSO", equivalencia: 3 };
        } else {
            return { tipo: "APOYO GENERALIZADO", equivalencia: 4 };
        }
    }

    // FUNCIÓN: obtenerTipoApoyoGeneral()
    // Según el porcentaje, devuelve el tipo de apoyo final general
    // Escala del instructivo para apoyo general:
    // <5 = No requiere apoyo
    // 5-24 = Apoyo intermitente
    // 25-49 = Apoyo limitado
    // 50-84 = Apoyo extenso
    // 85 o más = Apoyo generalizado
    function obtenerTipoApoyoGeneral(porcentaje) {
        if (porcentaje < 5) {
            return { tipo: "NO REQUIERE APOYO", equivalencia: 0 };
        } else if (porcentaje >= 5 && porcentaje <= 24) {
            return { tipo: "APOYO INTERMITENTE", equivalencia: 1 };
        } else if (porcentaje >= 25 && porcentaje <= 49) {
            return { tipo: "APOYO LIMITADO", equivalencia: 2 };
        } else if (porcentaje >= 50 && porcentaje <= 84) {
            return { tipo: "APOYO EXTENSO", equivalencia: 3 };
        } else {
            return { tipo: "APOYO GENERALIZADO", equivalencia: 4 };
        }
    }

    // FUNCIÓN: calcularResultadosPorCategoria()
    // Agrupa respuestas por categoría y calcula:
    // pregunta1, pregunta2, pregunta3, pregunta4, pregunta5,
    // suma, ceros, división, porcentaje, tipo de apoyo y equivalencia
    function calcularResultadosPorCategoria() {
        const resultados = [];

        categoriasMatriz.forEach(categoriaBase => {
            // Filtramos por rango de id, no por texto
            const respuestasCategoria = respuestas
                .filter(r => r.idPregunta >= categoriaBase.inicio && r.idPregunta <= categoriaBase.fin)
                .sort((a, b) => a.idPregunta - b.idPregunta);

            const valores = respuestasCategoria.map(r => r.valor);
            const suma = valores.reduce((acc, num) => acc + num, 0);
            const cantidadCeros = valores.filter(v => v === 0).length;
            const division = cantidadCeros >= 2 ? 12 : 15;
            const porcentaje = Number(((suma / division) * 100).toFixed(2));
            const tipoApoyo = obtenerTipoApoyoCategoria(porcentaje);

            resultados.push({
                categoria: categoriaBase.nombreMatriz,
                pregunta1: valores[0] ?? "",
                pregunta2: valores[1] ?? "",
                pregunta3: valores[2] ?? "",
                pregunta4: valores[3] ?? "",
                pregunta5: valores[4] ?? "",
                suma,
                cantidadCeros,
                division,
                porcentaje,
                tipoApoyo: tipoApoyo.tipo,
                equivalencia: tipoApoyo.equivalencia
            });
        });

        return resultados;
    }

    // FUNCIÓN: calcularResultadoGeneral()
    // Calcula el resultado final usando las equivalencias
    // de todas las categorías
    function calcularResultadoGeneral(resultadosCategorias) {
        const equivalencias = resultadosCategorias.map(r => r.equivalencia);
        const sumaGeneral = equivalencias.reduce((acc, num) => acc + num, 0);
        const cantidadCerosGeneral = equivalencias.filter(v => v === 0).length;
        const divisionGeneral = cantidadCerosGeneral >= 2 ? 16 : 20;
        const calculoGeneral = Number((sumaGeneral / divisionGeneral).toFixed(4));
        const porcentajeGeneral = Number((calculoGeneral * 100).toFixed(2));
        const tipoApoyoGeneral = obtenerTipoApoyoGeneral(porcentajeGeneral);

        return {
            sumaGeneral,
            cantidadCerosGeneral,
            divisionGeneral,
            calculoGeneral,
            porcentajeGeneral,
            tipoApoyoGeneral: tipoApoyoGeneral.tipo,
            equivalenciaGeneral: tipoApoyoGeneral.equivalencia
        };
    }

    // FUNCIÓN: mostrarResultadoFinal()
    // Construye la matriz final parecida al formato del sistema de apoyos
    function mostrarResultadoFinal() {
        const resultadosCategorias = calcularResultadosPorCategoria();
        const resultadoGeneral = calcularResultadoGeneral(resultadosCategorias);

        let html = `
            <div class="card shadow-sm border-0 rounded-4 mb-4">
                <div class="card-body">
                    <h3 class="mb-3">Matriz ponderación de apoyos</h3>

                    <div class="table-responsive">
                        <table class="table table-bordered align-middle text-center">
                            <thead class="table-light">
                         <tr>
                            <th rowspan="3">CATEGORÍAS</th>
                            <th colspan="5">APOYO</th>
                            <th colspan="5">CÁLCULOS</th>
                        </tr>
                        <tr>
                            <!-- APOYO -->
                            <th rowspan="2">Pregunta 1</th>
                            <th rowspan="2">Pregunta 2</th>
                            <th rowspan="2">Pregunta 3</th>
                            <th rowspan="2">Pregunta 4</th>
                            <th rowspan="2">Pregunta 5</th>

                        <!-- CÁLCULOS -->
                            <th rowspan="2">SUMA</th>
                            <th colspan="2">CÁLCULO</th>
                            <th rowspan="2">TIPO APOYO</th>
                            <th rowspan="2">EQUIVALENCIA NUMÉRICA</th>
                        </tr>
                        <tr>
                                <th>DIVISIÓN</th>
                                <th>RESULTADO</th>
                            </tr>
                        </thead>
                            <tbody>
        `;

        resultadosCategorias.forEach(r => {
            html += `
                <tr>
                    <td class="text-start">${r.categoria}</td>
                    <td>${r.pregunta1}</td>
                    <td>${r.pregunta2}</td>
                    <td>${r.pregunta3}</td>
                    <td>${r.pregunta4}</td>
                    <td>${r.pregunta5}</td>
                    <td>${r.suma}</td>
                    <td>${r.division}</td>
                    <td>${r.porcentaje}%</td>
                    <td>${r.tipoApoyo}</td>
                    <td>${r.equivalencia}</td>
                </tr>
            `;
        });

        html += `
                                <tr>
                                    <td colspan="9" class="text-start fw-bold">APOYO GENERAL OBTENIDO =</td>
                                    <td class="fw-bold">CÁLCULO</td>
                                    <td class="fw-bold">RESULTADO</td>
                                </tr>
                                <tr>
                                    <td colspan="8"></td>
                                    <td class="fw-bold">SUMA GENERAL</td>
                                    <td class="fw-bold">DIVISIÓN GENERAL</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colspan="8"></td>
                                    <td>${resultadoGeneral.sumaGeneral}</td>
                                    <td>${resultadoGeneral.divisionGeneral}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colspan="8"></td>
                                    <td class="fw-bold">CÁLCULO</td>
                                    <td colspan="2" class="fw-bold">RESULTADO</td>
                                </tr>
                                <tr>
                                    <td colspan="8"></td>
                                    <td>${resultadoGeneral.calculoGeneral}</td>
                                    <td colspan="2">${resultadoGeneral.porcentajeGeneral}%</td>
                                </tr>
                                <tr>
                                    <td colspan="8"></td>
                                    <td colspan="3" class="fw-bold">${resultadoGeneral.tipoApoyoGeneral}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        resultadoFinal.innerHTML = html;
    }

    // EVENTO DEL BOTÓN SIGUIENTE
    btnSiguiente.addEventListener("click", () => {
        const guardadoOk = guardarRespuestaActual();
        if (!guardadoOk) return;

        if (indiceActual < preguntas.length - 1) {
            indiceActual++;
            renderizarPregunta();
        } else {
            mostrarResultadoFinal();
            alert("Formulario finalizado correctamente.");
        }
    });

    // EVENTO DEL BOTÓN ANTERIOR
    btnAnterior.addEventListener("click", () => {
        if (indiceActual > 0) {
            const opcionSeleccionada = document.querySelector(".opcion-card.seleccionada");
            if (opcionSeleccionada) {
                guardarRespuestaActual();
            }

            indiceActual--;
            renderizarPregunta();
        }
    });

    // BOTÓN PARA MOSTRAR / OCULTAR SIDEBAR
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", event => {
            event.preventDefault();
            document.body.classList.toggle("sb-sidenav-toggled");
        });
    }

    // Apenas carga la página, mostramos la primera pregunta
    renderizarPregunta();
});
const preguntas = [
    {
        id: 1,
        categoria: "Aprendizaje y conocimiento",
        pregunta: "Pregunta 1: Requiere apoyo para la percepción de la información desde diferentes canales sensoriales (visual, auditivo y táctil).",
        orientadoras: [
            "¿Reconoce objetos o imágenes cuando se le muestran?",
            "¿Responde a sonidos o llamados por su nombre?",
            "¿Identifica estímulos a través del tacto (texturas, objetos)?",
        ]
    },
    {
        id: 2,
        categoria: "Aprendizaje y conocimiento",
        pregunta: "Pregunta 2: Requiere apoyo para mantener la atención en una actividad.",
        orientadoras: [
            "¿Logra concentrarse en una actividad por un tiempo determinado?",
            "¿Se distrae fácilmente con estímulos del entorno?",
            "¿Mantiene la atención hasta terminar una tarea sencilla?",
        ]
    },
    {
        id: 3,
        categoria: "Aprendizaje y conocimiento",
        pregunta: "Pregunta 3: Requiere apoyo para ejecutar instrucciones en un entorno.",
        orientadoras: [
            "¿Sigue instrucciones simples (ej: “ven”, “siéntate”)?",
            "¿Necesita que le repitan o le muestren cómo hacerlo?",
            "¿Ejecuta instrucciones en actividades cotidianas?",
        ]
    },
    {
        id: 4,
        categoria: "Aprendizaje y conocimiento",
        pregunta: "Pregunta 4: Requiere apoyo para hacer uso de estrategias para resolver problemas.",
        orientadoras: [
            "¿Identifica cuando algo no funciona o está mal?",
            "¿Busca soluciones o alternativas por sí mismo?",
            "¿Necesita guía para resolver situaciones simples?",
        ]
    },
    {
        id: 5,
        categoria: "Aprendizaje y conocimiento",
        pregunta: "Pregunta 5: Requiere apoyo para ejecutar acciones secuenciales de dos o más comandos.",
        orientadoras: [
            "¿Realiza actividades paso a paso (ej: lavarse las manos)?",
            "¿Sigue secuencias sin ayuda?",
            "¿Se pierde o necesita apoyo en procesos con varios pasos?",
        ]
    },
    {
        id: 6,
        categoria: "Comunicación, lenguaje y pensamiento",
        pregunta: "Pregunta 6: Requiere apoyo para recepcionar el mensaje de forma verbal o no verbal.",
        orientadoras: [
            "¿Entiende cuando le hablan?",
            "¿Responde a gestos o indicaciones no verbales?",
            "¿Comprende órdenes simples?",
        ]
    },
    {
        id: 7,
        categoria: "Comunicación, lenguaje y pensamiento",
        pregunta: "Pregunta 7: Requiere apoyo para comprender e interpretar señales, signos y símbolos, pictogramas entre otros.",
        orientadoras: [
            "¿Reconoce señales, pictogramas o imágenes?",
            "¿Entiende gestos o expresiones de otras personas?",
            "¿Asocia símbolos con acciones o significados?",
        ]
    },
    {
        id: 8,
        categoria: "Comunicación, lenguaje y pensamiento",
        pregunta: "Pregunta 8: Requiere apoyo para comunicar de forma verbal o no verbal (movimientos corporales o gestuales, lengua de señas, tableros de comunicación, dispositivos entre otros).",
        orientadoras: [
            "¿Se comunica para expresar necesidades?",
            "¿Usa palabras, gestos o apoyos (señas, tableros)?",
            "¿Necesita ayuda para comunicarse?",
        ]
    },
    {
        id: 9,
        categoria: "Comunicación, lenguaje y pensamiento",
        pregunta: "Pregunta 9: Requiere apoyo para lograr estructurar una frase con contenido y sentido.",
        orientadoras: [
            "¿Forma frases con sentido?",
            "¿Se le entiende cuando habla?",
            "¿Organiza ideas al comunicarse?",
        ]
    },
    {
        id: 10,
        categoria: "Comunicación, lenguaje y pensamiento",
        pregunta: "Pregunta 10: Requiere apoyo para producir mensajes verbales o escritos.",
        orientadoras: [
            "¿Puede decir o escribir mensajes básicos?",
            "¿Responde preguntas sencillas?",
            "¿Necesita apoyo para expresar ideas completas?",
        ]
    },
    {
        id: 11,
        categoria: "Vida cotidiana",
        pregunta: "Pregunta 11: Requiere apoyo para alimentarse de manera independiente.",
        orientadoras: [
            "¿Come solo?",
            "¿Usa cubiertos adecuadamente?",
            "¿Requiere ayuda para alimentarse?",
        ]
    },
    {
        id: 12,
        categoria: "Vida cotidiana",
        pregunta: "Pregunta 12: Requiere apoyo para realizar las actividades de higiene personal.",
        orientadoras: [
            "¿Se baña solo?",
            "¿Se cepilla los dientes sin ayuda?",
            "¿Se viste y desviste solo?",
        ]
    },
    {
        id: 13,
        categoria: "Vida cotidiana",
        pregunta: "Pregunta 13: Requiere apoyo para realizar acciones para el control de esfínter.",
        orientadoras: [
            "¿Reconoce la necesidad de ir al baño?",
            "¿Va al baño de manera independiente?",
            "¿Usa pañal o dispositivos de apoyo?",
        ]
    },
    {
        id: 14,
        categoria: "Vida cotidiana",
        pregunta: "Pregunta 14: Requiere apoyo para realizar actividades para la limpieza y organización de espacios.",
        orientadoras: [
            "¿Organiza sus objetos personales?",
            "¿Realiza tareas del hogar (barrer, recoger)?",
            "¿Necesita supervisión para estas actividades?",
        ]
    },
    {
        id: 15,
        categoria: "Vida cotidiana",
        pregunta: "Pregunta 15: Requiere apoyo para desenvolverse de manera independiente en la calle.",
        orientadoras: [
            "¿Sale solo a la calle?",
            "¿Se ubica en su entorno (barrio, calles)?",
            "¿Realiza actividades fuera de casa sin apoyo?",
        ]
    },
    {
        id: 16,
        categoria: "Participación social",
        pregunta: "Pregunta 16: Requiere apoyo para establecer relaciones con otras personas de su entorno.",
        orientadoras: [
            "¿Tiene amigos o interactúa con otras personas?",
            "¿Inicia conversaciones o contacto social?",
            "¿Comparte actividades con otros?",
        ]
    },
    {
        id: 17,
        categoria: "Participación social",
        pregunta: "Pregunta 17: Requiere apoyo para el manejo emociones.",
        orientadoras: [
            "¿Reconoce cuando está molesto o triste?",
            "¿Controla sus emociones?",
            "¿Cómo reacciona ante situaciones difíciles?",
        ]
    },
    {
        id: 18,
        categoria: "Participación social",
        pregunta: "Pregunta 18: Requiere apoyo para seguir y hacer uso de normas sociales de acuerdo con el entorno donde se encuentra.",
        orientadoras: [
            "¿Respeta normas básicas (saludar, esperar turno)?",
            "¿Reconoce lo que está permitido o no?",
            "¿Sigue reglas en diferentes entornos?",
        ]
    },
    {
        id: 19,
        categoria: "Participación social",
        pregunta: "Pregunta 19: Requiere apoyo para interactuar en diferentes entornos.",
        orientadoras: [
            "¿Participa en actividades fuera de casa?",
            "¿Se adapta a diferentes espacios (servicio, comunidad)?",
            "¿Interactúa con personas fuera del entorno familiar?",
        ]
    },
    {
        id: 20,
        categoria: "Participación social",
        pregunta: "Pregunta 20: Requiere apoyo para reconocerse como sujeto de derechos y deberes.",
        orientadoras: [
            "¿Reconoce situaciones donde tiene derechos?",
            "¿Cumple normas o responsabilidades?",
            "¿Identifica lo que debe y no debe hacer?",
        ]
    },
    {
        id: 21,
        categoria: "Movilidad",
        pregunta: "Pregunta 21: Requiere apoyo para transferir o realizar cambios de posición (acostarse, sentarse, ponerse de pie).",
        orientadoras: [
            "¿Se levanta, se sienta o se acuesta solo?",
            "¿Necesita ayuda para cambiar de posición?",
            "¿Mantiene el equilibrio en diferentes posturas?",
        ]
    },
    {
        id: 22,
        categoria: "Movilidad",
        pregunta: "Pregunta 22: Requiere apoyo para manipular objetos.",
        orientadoras: [
            "¿Sujeta objetos con facilidad?",
            "¿Usa sus manos con precisión?",
            "¿Manipula objetos pequeños o herramientas?",
        ]
    },
    {
        id: 23,
        categoria: "Movilidad",
        pregunta: "Pregunta 23: Requiere apoyo para desplazarse en su entorno cotidiano.",
        orientadoras: [
            "¿Se moviliza solo dentro de la vivienda?",
            "¿Accede a espacios como baño o cocina?",
            "¿Requiere apoyo para desplazarse?",
        ]
    },
    {
        id: 24,
        categoria: "Movilidad",
        pregunta: "Pregunta 24: Requiere apoyo para movilizarse de un sitio a otro en la comunidad.",
        orientadoras: [
            "¿Se mueve solo en la comunidad?",
            "¿Cruza calles o se orienta en espacios públicos?",
            "¿Necesita acompañamiento?",
        ]
    },
    {
        id: 25,
        categoria: "Movilidad",
        pregunta: "Pregunta 25: Requiere apoyo para el uso de medios de transporte público.",
        orientadoras: [
            "¿Usa transporte público?",
            "¿Reconoce rutas o destinos?",
            "¿Sube y baja del transporte sin ayuda?",
        ]
    }
];

const escalaCalificacion = [
    {
        valor: 0,
        titulo: "0 - Independiente",
        descripcion: "No requiere apoyos, es independiente."
    },
    {
        valor: 1,
        titulo: "1 - Apoyo esporádico",
        descripcion: "Requiere supervisión, apoyo transitorio, incitación verbal o gestual."
    },
    {
        valor: 2,
        titulo: "2 - Apoyo parcial permanente",
        descripcion: "Requiere estímulo y apoyo permanente, con ayuda física parcial."
    },
    {
        valor: 3,
        titulo: "3 - Apoyo total",
        descripcion: "Requiere apoyo total, de elevada intensidad, en distintos ambientes."
    }
];
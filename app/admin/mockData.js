export const initialConfirmados = [
  // 1er encuentro
  { encounter: 1, id: 1, name: "María José Albarracín", email: "mariajosealbarracin@gmail.com", location: "San Miguel de Tucumán", phone: "3814521876", confirmed: true },
  { encounter: 1, id: 2, name: "Santiago Bustos", email: "santi.bustos99@gmail.com", location: "Yerba Buena", phone: "3815049382", confirmed: true },
  { encounter: 1, id: 3, name: "Florencia Medina", email: "flor_medina@hotmail.com", location: "Concepción", phone: "3865412984", confirmed: false },
  { encounter: 1, id: 4, name: "Joaquín González", email: "joaco.gonzalez@gmail.com", location: "San Miguel de Tucumán", phone: "3816782341", confirmed: true },
  { encounter: 1, id: 5, name: "Camila Ruiz", email: "cami.ruiz@gmail.com", location: "Tafí Viejo", phone: "3813904561", confirmed: false },
  { encounter: 1, id: 6, name: "Mateo Díaz", email: "mateodiaz@yahoo.com.ar", location: "Yerba Buena", phone: "3815127893", confirmed: true },
  { encounter: 1, id: 7, name: "Lucía Fernández", email: "luciaf_98@gmail.com", location: "San Miguel de Tucumán", phone: "3814039281", confirmed: true },
  { encounter: 1, id: 8, name: "Bautista Herrera", email: "bauti.herrera@hotmail.com", location: "Aguilares", phone: "3865223344", confirmed: false },
  { encounter: 1, id: 9, name: "Martina Mansilla", email: "martina.mansilla@gmail.com", location: "Banda del Río Salí", phone: "3813884930", confirmed: true },
  { encounter: 1, id: 10, name: "Facundo Ortiz", email: "facu.ortiz@gmail.com", location: "Lules", phone: "3815002938", confirmed: false },
  { encounter: 1, id: 11, name: "Agustina Carrizo", email: "agus.carrizo97@gmail.com", location: "San Miguel de Tucumán", phone: "3814672839", confirmed: true },
  { encounter: 1, id: 12, name: "Tomás Juárez", email: "tomasjuarez@gmail.com", location: "Yerba Buena", phone: "3815882930", confirmed: false },
  { encounter: 1, id: 13, name: "Sofía Leguizamón", email: "sofia.legui@live.com", location: "Monteros", phone: "3863492810", confirmed: true },
  { encounter: 1, id: 14, name: "Lucas Alderete", email: "lucas.alderete@gmail.com", location: "Famaillá", phone: "3816392019", confirmed: false },

  // 2do encuentro
  { encounter: 2, id: 101, name: "Martín Paz Lozano", email: "mpazlozano@gmail.com", location: "San Miguel de Tucumán", phone: "3813459203", confirmed: true },
  { encounter: 2, id: 102, name: "Delfina Soria", email: "delfi.soria@hotmail.com", location: "Yerba Buena", phone: "3815993029", confirmed: true },
  { encounter: 2, id: 103, name: "Rodrigo Ledesma", email: "rodrigo.ledesma@gmail.com", location: "Concepción", phone: "3865992019", confirmed: false },
  { encounter: 2, id: 104, name: "Guadalupe Juárez", email: "guadajuarez99@gmail.com", location: "Tafí Viejo", phone: "3814882019", confirmed: true },
  { encounter: 2, id: 105, name: "Nicolás Giménez", email: "nico.gimenez@gmail.com", location: "San Miguel de Tucumán", phone: "3815239019", confirmed: true },
  { encounter: 2, id: 106, name: "Victoria Romano", email: "vicromano@gmail.com", location: "Yerba Buena", phone: "3815049283", confirmed: false },
  { encounter: 2, id: 107, name: "Franco Maza", email: "francomaza@yahoo.com", location: "Aguilares", phone: "3865123902", confirmed: true },
  { encounter: 2, id: 108, name: "Julieta Valdez", email: "juli.valdez@gmail.com", location: "Monteros", phone: "3863492010", confirmed: false },
  { encounter: 2, id: 109, name: "Ignacio Brandán", email: "nacho.brandan@gmail.com", location: "Banda del Río Salí", phone: "3813920193", confirmed: true },
  { encounter: 2, id: 110, name: "Valentina Luna", email: "valen.luna@live.com.ar", location: "San Miguel de Tucumán", phone: "3814238920", confirmed: false },
  { encounter: 2, id: 111, name: "Bruno Villagra", email: "bruno.villagra@gmail.com", location: "Lules", phone: "3815129039", confirmed: true },
  { encounter: 2, id: 112, name: "Emilia Córdoba", email: "emi.cordoba@gmail.com", location: "Tafí Viejo", phone: "3813928102", confirmed: true },
  { encounter: 2, id: 113, name: "Mariano Correa", email: "mcorrea96@gmail.com", location: "San Miguel de Tucumán", phone: "3814092839", confirmed: false }
];

export const initialPendientes = [
  // 1er encuentro
  { encounter: 1, id: 1, name: "Mariano Paz", phone: "3815551234", email: "mariano.paz@gmail.com", age: 22, time: "18:42", status: "pending" },
  { encounter: 1, id: 2, name: "Lucila Sosa", phone: "3814839201", email: "lucila.sosa@gmail.com", age: 25, time: "18:15", status: "approved" },
  { encounter: 1, id: 3, name: "Juan Cruz Gómez", phone: "3815049382", email: "juancruzg@hotmail.com", age: 27, time: "18:22", status: "approved" },
  { encounter: 1, id: 4, name: "Clara Mirra", phone: "3813892019", email: "clara.mirra@gmail.com", age: 20, time: "17:55", status: "approved" },
  
  // 2do encuentro
  { encounter: 2, id: 101, name: "Esteban Quiroga", phone: "3815938201", email: "estebanquiroga@gmail.com", age: 24, time: "18:31", status: "approved" },
  { encounter: 2, id: 102, name: "Paula Aráoz", phone: "3814029103", email: "paula.araoz@gmail.com", age: 23, time: "18:05", status: "approved" }
];

export const initialAcreditados = [
  // 1er encuentro
  { encounter: 1, id: 1, name: "María José Albarracín", email: "mariajosealbarracin@gmail.com", phone: "3814521876", type: "Confirmado", time: "18:10" },
  { encounter: 1, id: 2, name: "Santiago Bustos", email: "santi.bustos99@gmail.com", phone: "3815049382", type: "Confirmado", time: "18:12" },
  { encounter: 1, id: 3, name: "Joaquín González", email: "joaco.gonzalez@gmail.com", phone: "3816782341", type: "Confirmado", time: "18:15" },
  { encounter: 1, id: 4, name: "Mateo Díaz", email: "mateodiaz@yahoo.com.ar", phone: "3815127893", type: "Confirmado", time: "18:20" },
  { encounter: 1, id: 5, name: "Lucía Fernández", email: "luciaf_98@gmail.com", phone: "3814039281", type: "Confirmado", time: "18:25" },
  { encounter: 1, id: 6, name: "Martina Mansilla", email: "martina.mansilla@gmail.com", phone: "3813884930", type: "Confirmado", time: "18:28" },
  { encounter: 1, id: 7, name: "Agustina Carrizo", email: "agus.carrizo97@gmail.com", phone: "3814672839", type: "Confirmado", time: "18:30" },
  { encounter: 1, id: 8, name: "Sofía Leguizamón", email: "sofia.legui@live.com", phone: "3863492810", type: "Confirmado", time: "18:32" },
  { encounter: 1, id: 9, name: "Facundo Ortiz", email: "facu.ortiz@gmail.com", phone: "3815002938", type: "Inscripto", time: "18:35" },
  { encounter: 1, id: 10, name: "Tomás Juárez", email: "tomasjuarez@gmail.com", phone: "3815882930", type: "Inscripto", time: "18:40" },
  { encounter: 1, id: 11, name: "Lucila Sosa", email: "lucila.sosa@gmail.com", phone: "3814839201", type: "Walk-in", time: "18:15" },
  { encounter: 1, id: 12, name: "Juan Cruz Gómez", email: "juancruzg@hotmail.com", phone: "3815049382", type: "Walk-in", time: "18:22" },
  { encounter: 1, id: 13, name: "Clara Mirra", email: "clara.mirra@gmail.com", phone: "3813892019", type: "Walk-in", time: "17:55" },

  // 2do encuentro
  { encounter: 2, id: 101, name: "Martín Paz Lozano", email: "mpazlozano@gmail.com", phone: "3813459203", type: "Confirmado", time: "18:05" },
  { encounter: 2, id: 102, name: "Delfina Soria", email: "delfi.soria@hotmail.com", phone: "3815993029", type: "Confirmado", time: "18:07" },
  { encounter: 2, id: 103, name: "Guadalupe Juárez", email: "guadajuarez99@gmail.com", phone: "3814882019", type: "Confirmado", time: "18:10" },
  { encounter: 2, id: 104, name: "Nicolás Giménez", email: "nico.gimenez@gmail.com", phone: "3815239019", type: "Confirmado", time: "18:12" },
  { encounter: 2, id: 105, name: "Franco Maza", email: "francomaza@yahoo.com", phone: "3865123902", type: "Confirmado", time: "18:18" },
  { encounter: 2, id: 106, name: "Ignacio Brandán", email: "nacho.brandan@gmail.com", phone: "3813920193", type: "Confirmado", time: "18:22" },
  { encounter: 2, id: 107, name: "Bruno Villagra", email: "bruno.villagra@gmail.com", phone: "3815129039", type: "Confirmado", time: "18:25" },
  { encounter: 2, id: 108, name: "Emilia Córdoba", email: "emi.cordoba@gmail.com", phone: "3813928102", type: "Confirmado", time: "18:29" },
  { encounter: 2, id: 109, name: "Julieta Valdez", email: "juli.valdez@gmail.com", phone: "3863492010", type: "Inscripto", time: "18:31" },
  { encounter: 2, id: 110, name: "Valentina Luna", email: "valen.luna@live.com.ar", phone: "3814238920", type: "Inscripto", time: "18:33" },
  { encounter: 2, id: 111, name: "Esteban Quiroga", email: "estebanquiroga@gmail.com", phone: "3815938201", type: "Walk-in", time: "18:31" },
  { encounter: 2, id: 112, name: "Paula Aráoz", email: "paula.araoz@gmail.com", phone: "3814029103", type: "Walk-in", time: "18:05" }
];

export const feedbackStats = {
  1: {
    respuestas: 72,
    promedio: 9.2,
    nps: 78,
    recomiendan: 96,
    promotores: 82,
    pasivos: 14,
    detractores: 4,
    ratings: [0, 0, 1, 0, 1, 2, 4, 10, 18, 36], // rating 1 to 10
    recomiendanPercentages: { si: 95.8, talvez: 4.2, no: 0 },
    proximosTemas: [
      { name: "Economía y Desarrollo Regional", count: 24, percent: 33 },
      { name: "Modernización del Estado y TICs", count: 19, percent: 26 },
      { name: "Comunicación Política y Campañas", count: 15, percent: 21 },
      { name: "Liderazgo, Oratoria y Debate", count: 12, percent: 17 },
      { name: "Políticas Sociales y Empleo Joven", count: 8, percent: 11 }
    ],
    procedencia: [
      { space: "Universidad", count: 24 },
      { space: "Militancia", count: 18 },
      { space: "Independiente", count: 15 },
      { space: "ONG / Soc. Civil", count: 10 },
      { space: "Sector Privado", count: 5 }
    ]
  },
  2: {
    respuestas: 0,
    promedio: 0,
    nps: 0,
    recomiendan: 0,
    promotores: 0,
    pasivos: 0,
    detractores: 0,
    ratings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    recomiendanPercentages: { si: 0, talvez: 0, no: 0 },
    proximosTemas: [],
    procedencia: []
  }
};

export const feedbackComments = [
  { encounter: 1, id: 1, rating: 10, email: "santi.bustos99@gmail.com", comment: "Excelente organización y nivel de los expositores. Increíble poder conversar con legisladores y ministros en un mismo lugar y de manera tan cercana.", time: "17/05/2026 21:14", space: "Universidad" },
  { encounter: 1, id: 2, rating: 9, email: "mariajosealbarracin@gmail.com", comment: "Me gustó mucho la pluralidad. Había chicos de partidos políticos totalmente opuestos debatiendo con mucho respeto. Un oasis hoy en día.", time: "17/05/2026 21:18", space: "Independiente" },
  { encounter: 1, id: 3, rating: 10, email: "luciaf_98@gmail.com", comment: "La simulación legislativa del final del encuentro fue clave. Ojalá el próximo sea aún más práctico.", time: "17/05/2026 21:30", space: "Militancia" },
  { encounter: 1, id: 4, rating: 8, email: "tomasjuarez@gmail.com", comment: "Muy bueno todo. Creo que faltó un poco más de tiempo para preguntas del público a los expositores, a veces quedaban temas muy interesantes en el tintero.", time: "17/05/2026 21:42", space: "Sector Privado" },
  { encounter: 1, id: 5, rating: 10, email: "clara.mirra@gmail.com", comment: "Increíble experiencia. CEJOP realmente llena un vacío de formación en Tucumán. Muy recomendado.", time: "17/05/2026 21:55", space: "ONG / Soc. Civil" },
  { encounter: 1, id: 6, rating: 7, email: "facu.ortiz@gmail.com", comment: "El debate estuvo bueno pero se extendió demasiado la primera charla de la tarde y se desorganizó un poco el cronograma. Los expositores, excelentes.", time: "17/05/2026 22:05", space: "Universidad" }
];

export const emailStats = {
  total: 231,
  enviados: 228,
  fallidos: 3
};

export const emailCampaigns = [
  { encounter: 1, name: "confirmacion-encuentro-1", sent: 104, type: "Transactional" },
  { encounter: 1, name: "recordatorio-acreditacion-encuentro-1", sent: 104, type: "Reminder" },
  { encounter: 1, name: "gracias-feedback-encuentro-1", sent: 104, type: "Survey" },
  { encounter: 2, name: "confirmacion-encuentro-2", sent: 127, type: "Transactional" },
  { encounter: 2, name: "recordatorio-acreditacion-encuentro-2", sent: 127, type: "Reminder" }
];

export const prioritiesAccordionData = {
  1: [
    {
      id: "educacion",
      title: "Educación (59 menciones)",
      responses: [
        "Debemos modernizar el estatuto docente y capacitar en nuevas tecnologías. La educación secundaria en Tucumán está totalmente desconectada del mercado laboral tecnológico actual.",
        "Es urgente implementar la boleta única de educación: presupuesto directo a las escuelas y evaluación constante de directivos. Faltan gabinetes psicopedagógicos en el interior.",
        "Articular la escuela con los oficios locales. No todo es ir a la universidad; necesitamos técnicos agrícolas, de software y de construcción con formación moderna y ética.",
        "La deserción escolar en zonas vulnerables requiere de becas de acompañamiento personalizadas. Las escuelas deben volver a ser centros de contención y excelencia."
      ]
    },
    {
      id: "infraestructura",
      title: "Infraestructura (42 menciones)",
      responses: [
        "Los accesos a la provincia y las rutas del interior productivo están destrozadas. Afecta directamente al turismo y a la salida de la producción de azúcar y limón.",
        "El servicio de agua y cloacas en el Gran San Miguel es insostenible. Se rompen calles nuevas por pérdidas constantes de SAT. Se necesita un ente regulador real.",
        "Falta conectividad de internet de fibra óptica en las comunas del interior. Un joven de Amaicha no puede estudiar a distancia ni programar si no tiene buen ancho de banda.",
        "Inversión estructural en transporte público. Necesitamos carriles exclusivos y renovación de flota. Viajar de Tafí Viejo a la capital toma más de una hora en hora pico."
      ]
    },
    {
      id: "seguridad",
      title: "Seguridad (38 menciones)",
      responses: [
        "Mayor presencia policial en cuadrantes específicos a través de mapas del delito digitales. Menos burocracia en comisarías y más agentes en la calle.",
        "Es clave la capacitación en derechos humanos y en técnicas de mediación para los agentes de policía, sumado a mejores salarios para evitar la corrupción.",
        "Cámaras de seguridad en tiempo real conectadas al 911 en los accesos de Yerba Buena, Banda del Río Salí y Lules. El monitoreo vecinal ayuda pero no alcanza."
      ]
    }
  ],
  2: [
    {
      id: "educacion",
      title: "Educación (79 menciones)",
      responses: [
        "La reforma curricular de la provincia debe incluir programación e inteligencia artificial desde el ciclo básico. La brecha digital es la nueva brecha de alfabetización.",
        "Fortalecer los institutos de formación docente (IES). La calidad educativa empieza por quienes enseñan. Deben rendir concursos públicos y transparentes.",
        "Inclusión real y educación especial en todas las escuelas públicas. Faltan docentes de apoyo y rampas de acceso en la mayoría de los establecimientos del interior.",
        "Vincular las universidades (UNT, UTN, USPT) con las escuelas secundarias para guiar la vocación de los alumnos y reducir el abandono en primer año universitario."
      ]
    },
    {
      id: "desarrollo_econ",
      title: "Desarrollo Económico (53 menciones)",
      responses: [
        "Reducir la presión fiscal provincial (Ingresos Brutos). Tucumán es una de las provincias más caras para producir de la región. Necesitamos incentivos para pymes.",
        "Fomentar el polo tecnológico y el clúster de software. Tucumán tiene talento universitario de sobra pero las empresas se mudan a otras provincias por falta de seguridad jurídica.",
        "Créditos blandos de la Caja Popular de Ahorros para microemprendedores jóvenes. Arrancar un negocio hoy sin capital familiar en Tucumán es casi imposible.",
        "Promover la marca Tucumán en el exterior. Exportar más limón, arándanos, palta y software. Agilizar los trámites de exportación provinciales."
      ]
    },
    {
      id: "transparencia",
      title: "Transparencia (41 menciones)",
      responses: [
        "Ley de Acceso a la Información Pública real y efectiva. Los ciudadanos y periodistas deben poder ver el sueldo y los gastos de todos los funcionarios con tres clics.",
        "Fomentar la digitalización completa de expedientes en la administración pública. El papel solo sirve para esconder trámites y demorar resoluciones.",
        "Boleta Única de papel para terminar con los acoples y el clientelismo electoral en Tucumán. Las elecciones deben ser transparentes, baratas y representativas."
      ]
    }
  ]
};

export const dirigentesData = {
  1: {
    tucumanAdmiran: [
      { name: "Rossana Chahla", count: 24, percent: 23 },
      { name: "Osvaldo Jaldo", count: 15, percent: 14 },
      { name: "Roberto Sánchez", count: 12, percent: 11 },
      { name: "Silvia Elías de Pérez", count: 9, percent: 9 },
      { name: "Mariano Campero", count: 8, percent: 8 }
    ],
    argentinaAdmiran: [
      { name: "Patricia Bullrich", count: 21, percent: 20 },
      { name: "Javier Milei", count: 19, percent: 18 },
      { name: "Victoria Villarruel", count: 11, percent: 11 },
      { name: "Horacio Rodríguez Larreta", count: 9, percent: 9 },
      { name: "Mauricio Macri", count: 8, percent: 8 }
    ],
    tucumanCuestionan: [
      { name: "Juan Manzur", count: 32, percent: 31 },
      { name: "Ricardo Bussi", count: 18, percent: 17 },
      { name: "Osvaldo Jaldo", count: 11, percent: 11 },
      { name: "Germán Alfaro", count: 9, percent: 9 },
      { name: "Federico Masso", count: 6, percent: 6 }
    ],
    argentinaCuestionan: [
      { name: "Alberto Fernández", count: 35, percent: 34 },
      { name: "Cristina Kirchner", count: 28, percent: 27 },
      { name: "Javier Milei", count: 14, percent: 13 },
      { name: "Sergio Massa", count: 12, percent: 12 },
      { name: "Axel Kicillof", count: 8, percent: 8 }
    ]
  },
  2: {
    tucumanAdmiran: [
      { name: "Rossana Chahla", count: 31, percent: 24 },
      { name: "Osvaldo Jaldo", count: 19, percent: 15 },
      { name: "Mariano Campero", count: 14, percent: 11 },
      { name: "Roberto Sánchez", count: 11, percent: 9 },
      { name: "Beatriz Ávila", count: 7, percent: 6 }
    ],
    argentinaAdmiran: [
      { name: "Javier Milei", count: 28, percent: 22 },
      { name: "Patricia Bullrich", count: 23, percent: 18 },
      { name: "Victoria Villarruel", count: 14, percent: 11 },
      { name: "Mauricio Macri", count: 9, percent: 7 },
      { name: "Rodrigo de Loredo", count: 8, percent: 6 }
    ],
    tucumanCuestionan: [
      { name: "Juan Manzur", count: 37, percent: 29 },
      { name: "Ricardo Bussi", count: 23, percent: 18 },
      { name: "Osvaldo Jaldo", count: 15, percent: 12 },
      { name: "Germán Alfaro", count: 11, percent: 9 },
      { name: "José Alperovich", count: 9, percent: 7 }
    ],
    argentinaCuestionan: [
      { name: "Alberto Fernández", count: 42, percent: 33 },
      { name: "Cristina Kirchner", count: 31, percent: 24 },
      { name: "Javier Milei", count: 19, percent: 15 },
      { name: "Axel Kicillof", count: 15, percent: 12 },
      { name: "Sergio Massa", count: 9, percent: 7 }
    ]
  }
};

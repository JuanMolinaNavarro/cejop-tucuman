// Plantillas de sección reutilizables para el constructor de formularios.
// Al insertarlas, se crean como una sección normal (con sus preguntas), que
// después queda 100% editable. JS puro (cliente + servidor).

export const PLANTILLAS_SECCION = [
  {
    id: "datos_contacto",
    nombre: "Datos de contacto",
    descripcion:
      "Nombre, contacto y datos básicos del postulante. Reutilizable en cualquier formulario.",
    seccion: {
      titulo: "Tus datos",
      descripcion: "Información de contacto",
      preguntas: [
        {
          tipo: "texto_corto",
          etiqueta: "Nombre y apellido",
          requerido: true,
          config: { placeholder: "Tu nombre completo", rol_contacto: "nombre" },
        },
        {
          tipo: "texto_corto",
          etiqueta: "Teléfono",
          requerido: true,
          config: { placeholder: "381 ...", rol_contacto: "telefono" },
        },
        {
          tipo: "email",
          etiqueta: "Mail",
          requerido: true,
          config: { placeholder: "tu@email.com", rol_contacto: "email" },
        },
        {
          tipo: "numero",
          etiqueta: "Edad",
          requerido: true,
          config: { placeholder: "18–30", entero: true, min: null, max: null },
        },
        {
          tipo: "boolean",
          etiqueta: "¿Fuiste al primer CEJOP?",
          requerido: true,
          config: { etiqueta_si: "Sí", etiqueta_no: "No" },
        },
        {
          tipo: "localidad",
          etiqueta: "Localidad",
          requerido: true,
          config: {},
        },
        {
          tipo: "boolean",
          etiqueta: "¿Estás afiliado a algún partido político?",
          requerido: true,
          config: { etiqueta_si: "Sí", etiqueta_no: "No" },
        },
        {
          tipo: "boolean",
          etiqueta: "¿Participás en alguna ONG, fundación o agrupación civil?",
          requerido: true,
          config: { etiqueta_si: "Sí", etiqueta_no: "No" },
        },
        {
          tipo: "texto_largo",
          etiqueta: "¿A qué te dedicás?",
          requerido: true,
          config: {
            placeholder:
              "Contanos brevemente: si estudiás (qué carrera), si trabajás (de qué y dónde), o ambos.",
            rows: 3,
          },
        },
      ],
    },
  },
];

export const PLANTILLAS_POR_ID = Object.fromEntries(
  PLANTILLAS_SECCION.map((p) => [p.id, p])
);

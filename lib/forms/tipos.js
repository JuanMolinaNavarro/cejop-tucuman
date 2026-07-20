// Catálogo de tipos de pregunta del constructor de formularios.
// Fuente de verdad compartida entre el builder (admin), el render público y el
// análisis. JS puro, importable en cliente y servidor (sin dependencias).

/**
 * @typedef {Object} Opcion
 * @property {string} id      Identificador estable de la opción (se guarda en la respuesta).
 * @property {string} label   Texto visible.
 * @property {string} [detalle] Texto largo opcional (pregunta/aclaración, ej. prioridades).
 */

// Roles de contacto: marcan qué preguntas alimentan las columnas fijas de
// `respuestas` (nombre/email/telefono) para poder listar, exportar y deduplicar.
export const ROLES_CONTACTO = [
  { id: "", label: "— Ninguno —" },
  { id: "nombre", label: "Nombre" },
  { id: "email", label: "Email" },
  { id: "telefono", label: "Teléfono" },
];

// Categorías de valor, usadas por validación, análisis y export CSV.
export const VALOR = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  STRING_ARRAY: "string[]", // selección múltiple
  RANKING: "ranking", // string[] ordenado de longitud n
};

// Catálogo ordenado (el orden define el menú "Agregar pregunta").
export const TIPOS_PREGUNTA = [
  {
    id: "texto_corto",
    label: "Texto corto",
    descripcion: "Una línea de texto libre.",
    icon: "Type",
    valor: VALOR.STRING,
    tieneOpciones: false,
    admiteContacto: true,
    configDefault: { placeholder: "", maxLength: null, rol_contacto: "" },
  },
  {
    id: "texto_largo",
    label: "Texto largo",
    descripcion: "Párrafo de varias líneas.",
    icon: "AlignLeft",
    valor: VALOR.STRING,
    tieneOpciones: false,
    admiteContacto: false,
    configDefault: { placeholder: "", maxLength: null, rows: 4 },
  },
  {
    id: "email",
    label: "Email",
    descripcion: "Correo electrónico validado.",
    icon: "Mail",
    valor: VALOR.STRING,
    tieneOpciones: false,
    admiteContacto: true,
    configDefault: { placeholder: "tu@email.com", rol_contacto: "email" },
  },
  {
    id: "numero",
    label: "Número",
    descripcion: "Valor numérico (ej. edad o teléfono).",
    icon: "Hash",
    valor: VALOR.NUMBER,
    tieneOpciones: false,
    admiteContacto: true,
    configDefault: { placeholder: "", min: null, max: null, entero: true, rol_contacto: "" },
  },
  {
    id: "boolean",
    label: "Sí / No",
    descripcion: "Dos opciones excluyentes.",
    icon: "ToggleLeft",
    valor: VALOR.BOOLEAN,
    tieneOpciones: false,
    admiteContacto: false,
    configDefault: { etiqueta_si: "Sí", etiqueta_no: "No" },
  },
  {
    id: "seleccion_unica",
    label: "Selección única",
    descripcion: "Elegir una opción de una lista.",
    icon: "CircleDot",
    valor: VALOR.STRING,
    tieneOpciones: true,
    admiteContacto: false,
    configDefault: { opciones: [], presentacion: "botones" },
  },
  {
    id: "seleccion_multiple",
    label: "Selección múltiple",
    descripcion: "Elegir varias opciones.",
    icon: "ListChecks",
    valor: VALOR.STRING_ARRAY,
    tieneOpciones: true,
    admiteContacto: false,
    configDefault: { opciones: [], min: null, max: null },
  },
  {
    id: "ranking",
    label: "Ranking (elegir y ordenar)",
    descripcion: "Elegir N opciones y ordenarlas por prioridad.",
    icon: "ListOrdered",
    valor: VALOR.RANKING,
    tieneOpciones: true,
    admiteContacto: false,
    configDefault: { opciones: [], n: 3, con_detalle: false },
  },
];

export const TIPOS_POR_ID = Object.fromEntries(
  TIPOS_PREGUNTA.map((t) => [t.id, t])
);

export const IDS_TIPOS = TIPOS_PREGUNTA.map((t) => t.id);

/** Devuelve la metadata de un tipo, o undefined. */
export function tipoInfo(tipo) {
  return TIPOS_POR_ID[tipo];
}

/** ¿El tipo maneja una lista de opciones? */
export function tieneOpciones(tipo) {
  return Boolean(TIPOS_POR_ID[tipo]?.tieneOpciones);
}

/** ¿El tipo puede mapearse a una columna de contacto? */
export function admiteContacto(tipo) {
  return Boolean(TIPOS_POR_ID[tipo]?.admiteContacto);
}

/** Config por defecto (clonada) para una pregunta nueva de un tipo dado. */
export function configPorDefecto(tipo) {
  const base = TIPOS_POR_ID[tipo]?.configDefault ?? {};
  return structuredClone(base);
}

/** Slug simple y estable para ids de opción a partir de un texto. */
export function slugify(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

/**
 * Crea una opción nueva con id único dentro de `existentes`.
 * @param {string} label
 * @param {Opcion[]} existentes
 * @returns {Opcion}
 */
export function nuevaOpcion(label, existentes = []) {
  const usados = new Set(existentes.map((o) => o.id));
  const base = slugify(label) || "opcion";
  let id = base;
  let i = 2;
  while (usados.has(id)) id = `${base}_${i++}`;
  return { id, label: label || "Nueva opción", detalle: "" };
}

// Catálogo de localidades de la provincia de Tucumán + alias comunes.
// Reutilizable para (a) normalizar/deduplicar en el análisis de respuestas y
// (b) poblar un combobox de localidades en el formulario. JS puro (server o cliente).

export const LOCALIDADES_TUCUMAN = [
  { nombre: "San Miguel de Tucumán", alias: ["smt", "s m t", "capital", "san miguel", "tucuman capital", "s m de tucuman", "sn miguel de tucuman"] },
  { nombre: "Yerba Buena", alias: ["yb", "yerba"] },
  { nombre: "Tafí Viejo", alias: ["tv"] },
  { nombre: "Las Talitas", alias: [] },
  { nombre: "Alderetes", alias: [] },
  { nombre: "Banda del Río Salí", alias: ["la banda", "brs", "banda del rio sali"] },
  { nombre: "Lules", alias: [] },
  { nombre: "El Manantial", alias: ["manantial"] },
  { nombre: "Concepción", alias: [] },
  { nombre: "Aguilares", alias: [] },
  { nombre: "Monteros", alias: [] },
  { nombre: "Famaillá", alias: [] },
  { nombre: "Bella Vista", alias: [] },
  { nombre: "Simoca", alias: [] },
  { nombre: "Tafí del Valle", alias: ["tafi del valle"] },
  { nombre: "Juan Bautista Alberdi", alias: ["alberdi", "jb alberdi"] },
  { nombre: "Graneros", alias: [] },
  { nombre: "La Cocha", alias: [] },
  { nombre: "Trancas", alias: [] },
  { nombre: "Burruyacú", alias: [] },
  { nombre: "Delfín Gallo", alias: [] },
  { nombre: "San Pablo", alias: [] },
  { nombre: "Los Ralos", alias: [] },
  { nombre: "Santa Ana", alias: [] },
  { nombre: "Ranchillos", alias: [] },
  { nombre: "Villa Quinteros", alias: [] },
  { nombre: "Río Chico", alias: [] },
  { nombre: "Villa de Lamadrid", alias: ["lamadrid"] },
  { nombre: "Tapia", alias: [] },
  { nombre: "Raco", alias: [] },
  { nombre: "El Cadillal", alias: ["cadillal"] },
  { nombre: "San Javier", alias: [] },
  { nombre: "Amaicha del Valle", alias: ["amaicha"] },
  { nombre: "Colalao del Valle", alias: [] },
  { nombre: "Cruz Alta", alias: [] },
  { nombre: "Los Nogales", alias: [] },
  { nombre: "San Andrés", alias: [] },
  { nombre: "Garmendia", alias: [] },
];

/** Clave normalizada: sin acentos, en minúsculas, sin puntuación y con espacios colapsados. */
export function normalizarClave(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // quita diacríticos (tildes/diéresis)
    .toLowerCase()
    .replace(/[.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Índice clave-normalizada → nombre canónico (incluye alias).
const LOOKUP = new Map();
for (const loc of LOCALIDADES_TUCUMAN) {
  LOOKUP.set(normalizarClave(loc.nombre), loc.nombre);
  for (const a of loc.alias) LOOKUP.set(normalizarClave(a), loc.nombre);
}

/** Nombre canónico de la localidad de Tucumán, o null si no está en el catálogo. */
export function canonicalizarLocalidad(valor) {
  return LOOKUP.get(normalizarClave(valor)) ?? null;
}

/** Nombres canónicos ordenados alfabéticamente (para poblar un combobox/select). */
export const NOMBRES_LOCALIDADES = LOCALIDADES_TUCUMAN.map((l) => l.nombre).sort(
  (a, b) => a.localeCompare(b, "es")
);

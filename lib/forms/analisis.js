// Análisis genérico de respuestas por pregunta. Cada tipo se muestra de la mejor
// forma: opciones/booleanos como barras, ranking ponderado, números como
// mín/prom/máx + distribución, y textos (incluidos los campos de contacto) como
// frecuencias (si los valores se repiten, ej. localidad) o como lista (si son casi
// todos únicos, ej. nombre/email/teléfono/texto libre). JS puro (server o cliente).
import { estaVacio } from "./validation";
import { canonicalizarLocalidad, normalizarClave } from "./localidades";

function pct(count, total) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

const ROLES_CONTACTO = ["nombre", "email", "telefono"];

/** ¿La pregunta es un campo de contacto (nombre/email/teléfono)? */
export function esContacto(pregunta) {
  return ROLES_CONTACTO.includes(pregunta?.config?.rol_contacto);
}

export function computarAnalisis(preguntas, respuestas) {
  const filas = (respuestas ?? []).map((r) => r?.respuestas ?? {});
  return preguntas.map((p) => analizarPregunta(p, filas));
}

// ¿La etiqueta sugiere una pregunta de localidad? Solo ahí se aplica el catálogo
// de Tucumán (alias tipo SMT/YB + nombres canónicos). El resto usa la normalización
// genérica (sin acentos, sin distinguir mayúsculas).
function pareceLocalidad(etiqueta) {
  return /(localidad|ciudad|municipio|pueblo|donde|proceden|proven)/.test(
    normalizarClave(etiqueta ?? "")
  );
}

/** ¿La pregunta es de localidad? (tipo dedicado o etiqueta; para agregaciones/dashboard) */
export function esPreguntaLocalidad(pregunta) {
  return pregunta?.tipo === "localidad" || pareceLocalidad(pregunta?.etiqueta);
}

/** ¿La pregunta es de edad? (número cuya etiqueta menciona edad/años) */
export function esPreguntaEdad(pregunta) {
  return (
    pregunta?.tipo === "numero" &&
    /(edad|\banos?\b)/.test(normalizarClave(pregunta?.etiqueta ?? ""))
  );
}

// Agrupa una lista de textos por clave normalizada (sin acentos, case-insensitive)
// para que "San Miguel de Tucumán/Tucuman/tucuman" cuenten como una. Con
// { localidad: true } canonicaliza con el catálogo de Tucumán (alias SMT/YB, nombre
// canónico). Devuelve [{ valor, count, percent }] ordenado por count desc.
export function agruparTexto(valores, { localidad = false } = {}) {
  const strs = (valores ?? []).map((v) => String(v).trim()).filter(Boolean);
  const total = strs.length;
  const grupos = new Map(); // clave → { canon, count, variantes: Map<original, count> }
  for (const s of strs) {
    const canon = localidad ? canonicalizarLocalidad(s) : null;
    const clave = canon ? normalizarClave(canon) : normalizarClave(s);
    const g = grupos.get(clave) ?? { canon, count: 0, variantes: new Map() };
    g.count += 1;
    if (canon) g.canon = canon;
    g.variantes.set(s, (g.variantes.get(s) ?? 0) + 1);
    grupos.set(clave, g);
  }
  return [...grupos.values()]
    .map((g) => {
      // Mostrar el nombre canónico del catálogo, o la variante escrita más frecuente.
      const display =
        g.canon ?? [...g.variantes.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return { valor: display, count: g.count, percent: pct(g.count, total) };
    })
    .sort((a, b) => b.count - a.count);
}

// Texto: cuenta frecuencias (con normalización). Si hay repetición y pocas categorías
// → barras/torta (ej. localidad); si son casi todos únicos → lista.
function analizarTexto(base, valores) {
  const strs = valores.map((v) => String(v).trim()).filter(Boolean);
  const total = strs.length;
  const frecuencias = agruparTexto(strs, {
    localidad: base.tipo === "localidad" || pareceLocalidad(base.etiqueta),
  });
  const distinct = frecuencias.length;
  const esCategorico = distinct > 0 && distinct <= 20 && distinct < total;
  return {
    ...base,
    total,
    modo: "texto",
    mostrar: esCategorico ? "frecuencias" : "lista",
    frecuencias,
    textos: strs,
  };
}

// Estadísticas (mín/prom/máx) + distribución de una lista de números. maxDistintos
// limita cuándo se arma la distribución para no generar histogramas ilegibles.
export function distribucionNumerica(valores, maxDistintos = 20) {
  const nums = (valores ?? []).map(Number).filter((n) => !Number.isNaN(n));
  const suma = nums.reduce((a, b) => a + b, 0);
  const map = new Map();
  for (const n of nums) map.set(n, (map.get(n) ?? 0) + 1);
  const distintos = [...map.keys()];
  const distribucion =
    distintos.length > 0 && distintos.length <= maxDistintos
      ? [...map.entries()]
          .map(([valor, count]) => ({ valor, count, percent: pct(count, nums.length) }))
          .sort((a, b) => a.valor - b.valor)
      : null;
  return {
    count: nums.length,
    min: nums.length ? Math.min(...nums) : null,
    max: nums.length ? Math.max(...nums) : null,
    promedio: nums.length ? Math.round((suma / nums.length) * 10) / 10 : null,
    distribucion,
  };
}

function analizarNumero(base, valores) {
  return { ...base, modo: "numero", ...distribucionNumerica(valores) };
}

function analizarPregunta(pregunta, filas) {
  const valores = filas.map((f) => f[pregunta.id]).filter((v) => !estaVacio(v));
  const total = valores.length;
  const base = {
    preguntaId: pregunta.id,
    etiqueta: pregunta.etiqueta,
    tipo: pregunta.tipo,
    contacto: esContacto(pregunta),
    total,
  };
  const opciones = pregunta.config?.opciones ?? [];

  // Campos de contacto: se muestran como valores, nunca como estadística numérica
  // (no tiene sentido promediar teléfonos).
  if (base.contacto) return analizarTexto(base, valores);

  switch (pregunta.tipo) {
    case "boolean": {
      const si = valores.filter((v) => v === true).length;
      const no = valores.filter((v) => v === false).length;
      return {
        ...base,
        modo: "opciones",
        opciones: [
          { id: "si", label: pregunta.config?.etiqueta_si ?? "Sí", count: si, percent: pct(si, total) },
          { id: "no", label: pregunta.config?.etiqueta_no ?? "No", count: no, percent: pct(no, total) },
        ],
      };
    }

    case "seleccion_unica": {
      const conteo = new Map();
      for (const v of valores) conteo.set(v, (conteo.get(v) ?? 0) + 1);
      return {
        ...base,
        modo: "opciones",
        opciones: opciones
          .map((o) => ({
            id: o.id,
            label: o.label,
            count: conteo.get(o.id) ?? 0,
            percent: pct(conteo.get(o.id) ?? 0, total),
          }))
          .sort((a, b) => b.count - a.count),
      };
    }

    case "seleccion_multiple": {
      const conteo = new Map();
      for (const arr of valores)
        for (const v of arr) conteo.set(v, (conteo.get(v) ?? 0) + 1);
      return {
        ...base,
        modo: "opciones",
        multiple: true,
        opciones: opciones
          .map((o) => ({
            id: o.id,
            label: o.label,
            count: conteo.get(o.id) ?? 0,
            percent: pct(conteo.get(o.id) ?? 0, total), // % sobre encuestados
          }))
          .sort((a, b) => b.count - a.count),
      };
    }

    case "ranking": {
      const n = pregunta.config?.n ?? 3;
      const acc = new Map(); // id -> { count, score, porRango }
      for (const arr of valores) {
        arr.forEach((id, idx) => {
          const e = acc.get(id) ?? { count: 0, score: 0, porRango: {} };
          e.count += 1;
          e.score += n - idx; // pos 1 => n pts ... pos n => 1 pt
          const rango = idx + 1;
          e.porRango[rango] = (e.porRango[rango] ?? 0) + 1;
          acc.set(id, e);
        });
      }
      return {
        ...base,
        modo: "ranking",
        n,
        items: opciones
          .map((o) => {
            const e = acc.get(o.id) ?? { count: 0, score: 0, porRango: {} };
            return {
              id: o.id,
              label: o.label,
              count: e.count,
              percent: pct(e.count, total),
              score: e.score,
              porRango: e.porRango,
            };
          })
          .sort((a, b) => b.score - a.score),
      };
    }

    case "numero":
      return analizarNumero(base, valores);

    default:
      // texto_corto, texto_largo, email
      return analizarTexto(base, valores);
  }
}

/**
 * Serializa un valor de respuesta a texto plano para el CSV/tabla del admin.
 */
export function valorATexto(pregunta, valor) {
  if (estaVacio(valor)) return "";
  const opciones = pregunta?.config?.opciones ?? [];
  const label = (id) => opciones.find((o) => o.id === id)?.label ?? id;
  switch (pregunta?.tipo) {
    case "boolean":
      return valor ? pregunta.config?.etiqueta_si ?? "Sí" : pregunta.config?.etiqueta_no ?? "No";
    case "seleccion_unica":
      return label(valor);
    case "seleccion_multiple":
      return valor.map(label).join("; ");
    case "ranking":
      return valor.map((id, i) => `${i + 1}. ${label(id)}`).join("; ");
    default:
      return String(valor);
  }
}

// Análisis genérico de respuestas por pregunta.
// Reemplaza las pestañas fijas "Prioridades" y "Dirigentes" del admin: para
// cualquier pregunta de opción/ranking genera conteos/rankings; las de texto
// se listan individualmente. JS puro (se puede correr en server o cliente).
import { estaVacio } from "./validation";

function pct(count, total) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

const ROLES_CONTACTO = ["nombre", "email", "telefono"];

/**
 * Una pregunta es "analizable" si NO es un campo de contacto. Los campos de
 * contacto (nombre/email/teléfono) son datos identificatorios de cada persona:
 * su lugar es la tabla de respuestas, no el análisis agregado (no tiene sentido,
 * p. ej., promediar números de teléfono).
 */
export function esAnalizable(pregunta) {
  return !ROLES_CONTACTO.includes(pregunta?.config?.rol_contacto);
}

/**
 * @param {Array} preguntas  Preguntas del formulario (ordenadas).
 * @param {Array} respuestas Filas de `respuestas` (cada una con `.respuestas` jsonb).
 * @returns {Array} un objeto de análisis por pregunta (excluye campos de contacto).
 */
export function computarAnalisis(preguntas, respuestas) {
  const filas = (respuestas ?? []).map((r) => r?.respuestas ?? {});
  return preguntas.filter(esAnalizable).map((p) => analizarPregunta(p, filas));
}

function analizarPregunta(pregunta, filas) {
  const valores = filas
    .map((f) => f[pregunta.id])
    .filter((v) => !estaVacio(v));
  const total = valores.length;
  const base = {
    preguntaId: pregunta.id,
    etiqueta: pregunta.etiqueta,
    tipo: pregunta.tipo,
    total,
  };
  const opciones = pregunta.config?.opciones ?? [];
  const labelDe = (id) => opciones.find((o) => o.id === id)?.label ?? id;

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

    case "numero": {
      const nums = valores.map(Number).filter((n) => !Number.isNaN(n));
      const suma = nums.reduce((a, b) => a + b, 0);
      return {
        ...base,
        modo: "numero",
        count: nums.length,
        min: nums.length ? Math.min(...nums) : null,
        max: nums.length ? Math.max(...nums) : null,
        promedio: nums.length ? Math.round((suma / nums.length) * 10) / 10 : null,
      };
    }

    default: {
      // texto_corto, texto_largo, email → respuestas individuales
      return {
        ...base,
        modo: "texto",
        textos: valores.map((v) => String(v)),
      };
    }
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

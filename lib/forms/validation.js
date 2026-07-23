// Validación de respuestas de formularios dinámicos.
// `validarValor` es la fuente de verdad (pura, usable en cliente y servidor).
// `construirSchema` envuelve esa lógica en un schema Zod para el server action.
import { z } from "zod";
import { TIPOS_POR_ID } from "./tipos";
import { NOMBRES_LOCALIDADES, normalizarClave } from "./localidades";

// Mismo regex de email que usaba el formulario original.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** ¿El valor cuenta como "sin responder"? (false y 0 SÍ son respuestas válidas) */
export function estaVacio(v) {
  if (v === undefined || v === null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

function idsOpciones(pregunta) {
  return (pregunta?.config?.opciones ?? []).map((o) => o.id);
}

/**
 * Valida una respuesta contra su pregunta.
 * @returns {string|null} mensaje de error (es-AR) o null si es válida.
 */
export function validarValor(pregunta, valor) {
  const requerido = Boolean(pregunta?.requerido);
  const cfg = pregunta?.config ?? {};

  if (estaVacio(valor)) {
    return requerido ? "Este campo es obligatorio" : null;
  }

  switch (pregunta?.tipo) {
    case "texto_corto":
    case "texto_largo": {
      const s = String(valor);
      if (cfg.maxLength && s.length > cfg.maxLength) {
        return `Máximo ${cfg.maxLength} caracteres`;
      }
      return null;
    }

    case "email":
      return EMAIL_RE.test(String(valor)) ? null : "Formato de email no válido";

    case "localidad": {
      // Solo se admiten localidades del catálogo (sin texto libre).
      const clave = normalizarClave(valor);
      const ok = NOMBRES_LOCALIDADES.some((n) => normalizarClave(n) === clave);
      return ok ? null : "Elegí una localidad de la lista";
    }

    case "numero": {
      const n = Number(valor);
      if (Number.isNaN(n)) return "Debe ser un número";
      if (cfg.entero && !Number.isInteger(n)) return "Debe ser un número entero";
      if (cfg.min != null && n < cfg.min) return `El mínimo es ${cfg.min}`;
      if (cfg.max != null && n > cfg.max) return `El máximo es ${cfg.max}`;
      return null;
    }

    case "boolean":
      return typeof valor === "boolean" ? null : "Seleccioná una opción";

    case "seleccion_unica": {
      const ids = idsOpciones(pregunta);
      return ids.includes(valor) ? null : "Opción inválida";
    }

    case "seleccion_multiple": {
      if (!Array.isArray(valor)) return "Selección inválida";
      const ids = idsOpciones(pregunta);
      if (!valor.every((v) => ids.includes(v))) return "Opción inválida";
      if (new Set(valor).size !== valor.length) return "Hay opciones repetidas";
      if (cfg.min != null && valor.length < cfg.min)
        return `Elegí al menos ${cfg.min}`;
      if (cfg.max != null && valor.length > cfg.max)
        return `Elegí como máximo ${cfg.max}`;
      return null;
    }

    case "ranking": {
      if (!Array.isArray(valor)) return "Ranking inválido";
      const n = cfg.n ?? 3;
      const ids = idsOpciones(pregunta);
      if (!valor.every((v) => ids.includes(v))) return "Opción inválida";
      if (new Set(valor).size !== valor.length) return "Hay opciones repetidas";
      if (valor.length !== n) return `Elegí y ordená exactamente ${n}`;
      return null;
    }

    default:
      return null;
  }
}

/**
 * Valida un conjunto de respuestas (keyed por pregunta_id).
 * @returns {{ ok: boolean, errores: Record<string,string> }}
 */
export function validarValores(preguntas, valores) {
  const errores = {};
  for (const p of preguntas) {
    const err = validarValor(p, valores?.[p.id]);
    if (err) errores[p.id] = err;
  }
  return { ok: Object.keys(errores).length === 0, errores };
}

/**
 * Normaliza un valor para guardar en jsonb (coerción y limpieza).
 * Devuelve `undefined` si está vacío (no se guarda).
 */
export function normalizarValor(pregunta, valor) {
  if (estaVacio(valor)) return undefined;
  switch (pregunta?.tipo) {
    case "numero":
      return Number(valor);
    case "boolean":
      return Boolean(valor);
    case "texto_corto":
    case "texto_largo":
    case "email":
    case "localidad":
      return String(valor).trim();
    default:
      return valor; // arrays de selección/ranking se guardan tal cual
  }
}

/**
 * Schema Zod para el server action: autoritativo, apoyado en `validarValores`.
 * Uso: `const r = construirSchema(preguntas).safeParse(valores)`.
 */
export function construirSchema(preguntas) {
  return z.record(z.string(), z.any()).superRefine((valores, ctx) => {
    for (const p of preguntas) {
      const err = validarValor(p, valores?.[p.id]);
      if (err) {
        ctx.addIssue({
          code: "custom",
          message: err,
          path: [String(p.id)],
        });
      }
    }
  });
}

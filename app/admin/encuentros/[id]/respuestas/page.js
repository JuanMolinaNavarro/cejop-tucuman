import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  getEncuentro,
  getFormularioParaEditar,
  getRespuestas,
} from "@/lib/forms/queries";
import RespuestasView from "./RespuestasView";

export const metadata = { title: "Respuestas — Admin CEJOP" };

const TIPOS = ["inscripcion", "feedback"];

export default async function RespuestasPage({ params, searchParams }) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const tipo = TIPOS.includes(sp?.tipo) ? sp.tipo : "inscripcion";

  const encuentro = await getEncuentro(id);
  if (!encuentro) notFound();

  const formulario = await getFormularioParaEditar(id, tipo);
  const respuestas = formulario ? await getRespuestas(formulario.id) : [];

  return (
    <RespuestasView
      encuentro={encuentro}
      formulario={formulario}
      respuestasIniciales={respuestas}
      tipo={tipo}
    />
  );
}

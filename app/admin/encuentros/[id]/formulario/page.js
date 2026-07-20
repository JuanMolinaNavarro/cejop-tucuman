import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { getEncuentro, getFormularioParaEditar } from "@/lib/forms/queries";
import { asegurarFormulario } from "@/app/admin/actions";
import FormBuilder from "./FormBuilder";

export const metadata = { title: "Formulario — Admin CEJOP" };

const TIPOS = ["inscripcion", "feedback"];

export default async function FormularioPage({ params, searchParams }) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const tipo = TIPOS.includes(sp?.tipo) ? sp.tipo : "inscripcion";

  const encuentro = await getEncuentro(id);
  if (!encuentro) notFound();

  // Crea el formulario (del tipo pedido) si todavía no existe.
  await asegurarFormulario(id, tipo);
  const formulario = await getFormularioParaEditar(id, tipo);
  if (!formulario) notFound();

  return (
    <FormBuilder encuentro={encuentro} formularioInicial={formulario} tipo={tipo} />
  );
}

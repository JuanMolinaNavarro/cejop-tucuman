import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  getEncuentro,
  getFormularioParaEditar,
  getRespuestas,
  getAcreditaciones,
} from "@/lib/forms/queries";
import AcreditacionView from "./AcreditacionView";

export const metadata = { title: "Acreditación — Admin CEJOP" };

export default async function AcreditacionPage({ params }) {
  await requireAdmin();
  const { id } = await params;

  const encuentro = await getEncuentro(id);
  if (!encuentro) notFound();

  const form = await getFormularioParaEditar(id, "inscripcion");
  const inscriptos = form ? await getRespuestas(form.id) : [];
  const acreditaciones = await getAcreditaciones(id);

  return (
    <AcreditacionView
      encuentro={encuentro}
      inscriptosIniciales={inscriptos}
      acreditacionesIniciales={acreditaciones}
    />
  );
}

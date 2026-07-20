import { requireAdmin } from "@/lib/supabase/auth";
import { getEncuentrosConResumen } from "@/lib/forms/queries";
import EncuentrosManager from "./EncuentrosManager";

export const metadata = { title: "Encuentros — Admin CEJOP" };

export default async function EncuentrosPage() {
  await requireAdmin();
  const encuentros = await getEncuentrosConResumen();
  return <EncuentrosManager encuentrosIniciales={encuentros} />;
}

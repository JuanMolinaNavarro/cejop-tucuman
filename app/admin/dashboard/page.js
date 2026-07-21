import { requireAdmin } from "@/lib/supabase/auth";
import { getDashboardData } from "@/lib/forms/queries";
import DashboardView from "./DashboardView";

export const metadata = { title: "Dashboard — Admin CEJOP" };

export default async function DashboardPage() {
  await requireAdmin();
  const data = await getDashboardData();
  return <DashboardView data={data} />;
}

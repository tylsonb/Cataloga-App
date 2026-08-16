import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!(await requireAdmin())) redirect("/");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar variant="admin" />
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
    </div>
  );
}
